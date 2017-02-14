import { graphql } from 'graphql';
import Schema from './schema';

export default (query: string, variables: { [key: string]: string }) => graphql(Schema, query, null, {}, variables);
