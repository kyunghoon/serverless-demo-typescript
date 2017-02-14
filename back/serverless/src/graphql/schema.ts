import { GraphQLObjectType, GraphQLSchema } from 'graphql';

import userQueries from './collections/users/queries';
import queryQueries from './collections/queries/queries';
import userMutations from './collections/users/mutations';

const queries = {...userQueries, ... queryQueries};

const mutations = {... userMutations};

const Queries = new GraphQLObjectType({
  name: 'Queries',
  fields: queries,
});

const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: mutations,
});

export default new GraphQLSchema({
  query: Queries,
  mutation: Mutations,
});

