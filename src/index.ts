import { ApolloServer, gql } from 'apollo-server'
import { booksService } from './books-service';
import { Book } from './db-books';
import { githubUser } from './github-user';

const typeDefs = gql`
  type Book {
    id: Int
    title: String 
    author: String
  }

  type GitHubUser {
    login: String
    id: Int
    avatar_url: String
    bio: String
    public_repos: Int
  }

  input BookInput {
    title: String 
    author: String
  }

  type Query {
    books: [Book]
    bookById(id: Int): Book
    getGithubUser(username: String): GitHubUser
  }

  type Mutation {
    bookUpdate(id: Int, fields: BookInput): Book
    bookRemove(id: Int): Book
  }
`;

const resolvers = {
  Query: {
    books: (): Book[] => {
      return booksService.getAllBooks()
    },

    bookById: async (a: any, args: { id: number }): Promise<Book | undefined> => {
      return await booksService.getById(args.id)
    },

    getGithubUser: async (_: any, args: { username: string }) => {
      const { username } = args
      return await githubUser.getByUsername(username)
    }
  },

  Mutation: {
    bookUpdate: (_: any, args: { id: number, fields: any }) => {
      return booksService.bookUpdate(args.id, args.fields)
    },
    bookRemove: (_: any, args: { id: number }) => {
      return booksService.bookRemove(args.id)
    }
  }
};

const server = new ApolloServer(
  {
    typeDefs,
    resolvers,
  });

server.listen().then(({ url }: any) => {
  console.log(`Server ready at ${url}`);
});