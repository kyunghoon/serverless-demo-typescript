import { GraphQLList, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql';
import resolves from './resolves';
const TwitterSearchResultType = require('./objtype');

export default {
  search: {
    type: new GraphQLList(TwitterSearchResultType),
    description: 'search twitter',
    args: {
      query: { type: new GraphQLNonNull(GraphQLString) },
      count: { type: GraphQLInt },
    },
    resolve: async (source: any, args: { query: string }) => {
      const result = await resolves.search(args.query);
      resolves.create(source, args.query);
      return result;
    },
  },
};

