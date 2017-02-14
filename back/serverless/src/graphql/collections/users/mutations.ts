import { GraphQLString, GraphQLNonNull } from 'graphql';
const getFieldNames = require('graphql-list-fields');
import UserType from './objtype';
import validate from './validate';
import resolves from './resolves';

export default {
  createUser: {
    type: UserType,
    description: 'Create User',
    args: {
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (source: any, args: { email: string, password: string }) => {
      validate(args);
      return resolves.create(args.email, args.password);
    },
  },
  loginUser: {
    type: UserType,
    description: 'Login User',
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
  updateUser: {
    type: UserType,
    description: 'Delete User',
    args: {
      id: { type: new GraphQLNonNull(GraphQLString) },
      name: { type: GraphQLString },
      screenName: { type: GraphQLString },
      description: { type: GraphQLString },
    },
    resolve: (source: any, args: { id: string, name: string, screenName: string }) => resolves.update(args.id, args.name, args.screenName),
  },
  removeUser: {
    type: UserType,
    description: 'Delete User',
    args: {
      id: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: (source: any, args: { id: string }) => resolves.remove(args.id),
  },
};
