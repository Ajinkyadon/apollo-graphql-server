
const React = require('react');
const { useState, useEffect } = require('react');
const { request } = require('graphql-request');

function App() {
    const githubToken = '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'; // Replace with your GitHub token
    const repoName = 'AjinkyaDon/repoA'; // Replace with an actual repository name

    const [repositories, setRepositories] = useState([]);
    const [repoDetails, setRepoDetails] = useState({});

    useEffect(() => {
        const fetchRepositories = async () => {
            const query = `
          query {
            repositories(token: "${githubToken}") {
              name
              size
              owner
            }
          }
        `;

            try {
                const data = await request('http://localhost:4000/', query);
                setRepositories(data.repositories);
            } catch (error) {
                console.error('Error fetching repositories:', error);
            }
        };

        const fetchRepositoryDetails = async () => {
            const query = `
          query {
            repositoryDetails(token: "${githubToken}", repoName: "${repoName}") {
              name
              size
              owner
              isPrivate
              numFiles
              ymlContent
              activeWebhooks
            }
          }
        `;

            try {
                const data = await request('http://localhost:4000/', query);
                setRepoDetails(data.repositoryDetails);
            } catch (error) {
                console.error('Error fetching repository details:', error);
            }
        };

        fetchRepositories();
        fetchRepositoryDetails();
    }, []);

    return (
        React.createElement('div', null,
            React.createElement('h1', null, 'Repositories'),
            React.createElement('ul', null,
                repositories.map(repo => (
                    React.createElement('li', { key: repo.name },
                        `${repo.name} - Size: ${repo.size} - Owner: ${repo.owner}`
                    )
                ))
            ),
            React.createElement('h1', null, 'Repository Details'),
            React.createElement('pre', null, JSON.stringify(repoDetails, null, 2))
        )
    );
}

module.exports = App;
