import { GraphQLList, GraphQLString, GraphQLNonNull } from 'graphql';
const getFieldNames = require('graphql-list-fields');
import UserType from './objtype';
import validate from './validate';
import resolves from './resolves';

export default {
  users: {
    type: new GraphQLList(UserType),
    description: 'list of users',
    resolve: async (source: any, args: {}, context: any, info: any) => {
      const fields = getFieldNames(info);
      return resolves.find(fields);
    },
  },
  user: {
    type: UserType,
    description: 'get a user by id',
    args: {
      id: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (source: any, args: { id: string }) => {
      validate(args);
      return resolves.findOne(args.id);
    },
  },
  login: {
    type: UserType,
    description: 'get user by email and password',
    args: {
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (source: any, args: { email: string, password: string }, context: any, info: any) => {
      validate(args);
      const fields = getFieldNames(info);
      return resolves.login(fields, args.email, args.password);
    },
  },
  viewer: {
    type: UserType,
    description: 'get current viewer',
    resolve: async (source: any, args: {}, context: any, info: any) => {
      const fields = getFieldNames(info);
      return resolves.login(fields, 'guest@guests.com', 'guest');
    },
  },
};
