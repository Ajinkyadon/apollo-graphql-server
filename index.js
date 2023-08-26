const { ApolloServer, gql } = require('apollo-server');
const axios = require('axios');

const typeDefs = gql`
  type Repository {
    name: String
    size: Int
    owner: String
    isPrivate: Boolean
    numFiles: Int
    ymlContent: String
    activeWebhooks: Int
  }

  type Query {
    repositories(token: String!): [Repository]
    repositoryDetails(token: String!, repoName: String!): Repository
  }
`;

const resolvers = {
  Query: {
    repositories: async (_, { token }) => {
      try {
        
        const response = await axios.get('https://api.github.com/user/repos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return response.data.map(repo => ({
          name: repo.name,
          size: repo.size,
          owner: repo.owner.login,
        }));
      } catch (error) {
        throw new Error('Failed to fetch repositories.');
      }
    },
    repositoryDetails: async (_, { token, repoName }) => {
      try {
        const response = await axios.get(`https://api.github.com/repos/${repoName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      //  console.log("contents_url", response);
      //  https://api.github.com/repos/Ajinkyadon/repoA/contents/{+path}
      //   const ymlFileContentResponse = await axios.get(`https://api.github.com/repos/${repoName}/contents/`, {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   });

      //  const ymlContent = ymlFileContentResponse.data[0]?.content || '';

        // You can fetch and calculate other details like isPrivate, numFiles, activeWebhooks here

        return {
          name: response.data.name,
          size: response.data.size,
          owner: response.data.owner.login,
          isPrivate: response.data.private,
          numFiles: response.data.size, // Replace with actual numFiles logic
       //  ymlContent: Buffer.from(ymlContent, 'base64').toString('utf-8'),
          activeWebhooks: 0, // Replace with actual activeWebhooks logic
        };
      } catch (error) {
        throw new Error('Failed to fetch repository details.');
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server running at ${url}`);
});
