import * as React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import UserItem from '../useritem';

interface User {
  id: string;
  email: string;
  name: string;
  screenName: String;
}

interface QueryData {
  users: Array<User>;
  error: string;
  loading: boolean;
}

interface QueryResult {
  data: QueryData;
}

const UserList = ({ data }: QueryResult) => {
  if (data.loading) { return (<h6>Loading...</h6>); }
  if (data.error) { console.error(data.error); return <h6>Something Broke</h6>; }
  return (
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Id</th>
          <th>Name</th>
          <th>ScreenName</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {data.users.map(item => (<UserItem key={item.id} {...item} />))}
      </tbody>
    </table>
  );
};

export const usersQuery = gql`
  query {
    users {
      id
      email
      name
      screenName
    }
  }
`;

export default graphql(usersQuery)(UserList);