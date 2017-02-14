import * as React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Box } from 'reflexbox';
import withDelay from '../hoc/delay';

type Result = {
  id_str: string;
  text: string;
  truncated: boolean;
  source: string;
  user: { screen_name: string, name: string };
  is_quote_status: boolean;
  quoted_status_id_str: string;
  retweet_count: number;
  favorite_count: number;
  favorite: boolean;
  retweeted: boolean;
  possibly_sensitive: boolean;
  lang: string;
};

const SearchResult = ({ id_str, text, truncated, source, user, is_quote_status, quoted_status_id_str, retweet_count: retweetCount, favorite_count: favoriteCount, favorite, retweeted, possibly_sensitive, lang }: Result) => { // eslint-disable-line no-unused-vars
  return (
    <tr>
      <td>{user.screen_name}</td>
      <td>{user.name}</td>
      <td>{text}</td>
    </tr>
  );
};

interface ApolloResult {
  data: { loading: boolean, error: any, search: Result[] };
}

interface SearchQuery {
  query: string;
}

type SearchResultsProps = SearchQuery & ApolloResult

class SearchResults extends React.Component<SearchResultsProps, {}> {
  render() {
    if (this.props.data.loading) { return (<h6>Loading...</h6>); }
    if (this.props.data.error) { console.error(this.props.data.error); return <h6>Something Broke</h6>; }
    return (
      <Box ml={4} mr={4}>
        <table>
          <thead>
            <tr>
              <th>ScreenName</th>
              <th>Name</th>
              <th>Text</th>
            </tr>
          </thead>
          <tbody>
            {this.props.data.search.map(r => <SearchResult key={r.id_str} {...r} />)}
          </tbody>
        </table>
      </Box>
    );
  };
}

export const searchQuery = gql`
  query ($query: String!) {
    search (query: $query) {
      id_str
      text
      truncated
      source
      user {
        id_str
        name
        screen_name
        location
        description
        url
      }
      is_quote_status
      quoted_status_id_str
      retweet_count
      favorite_count
      favorited
      retweeted
      possibly_sensitive
      lang
    }
  }
`;

// recompose's compose typechecking ignores passed in props, rolled out my own
const compose = <P, C extends React.ComponentClass<P>>(
  ...fns: ((Component: React.ComponentClass<P>) => C)[]) => (Component: C) => 
  fns.reduce((i, fn) => fn(i), Component)
  
export default compose(withDelay, graphql(searchQuery))(SearchResults);
