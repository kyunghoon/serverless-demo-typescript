import * as React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Button } from 'rebass';
import { usersQuery } from '../userlist';

interface User {
  email: string;
  id: string;
  name: string;
  screenName: string;
}

interface UserItemProps extends User {
  submit: (userId: string) => void;
}

const UserItem = ({ email, id, name, screenName, submit }: UserItemProps ) => (
  <tr>
    <td>{email}</td>
    <td>{id}</td>
    <td>{name}</td>
    <td>{screenName}</td>
    <td>
      <Button onClick={() => submit(id)}>Remove</Button>
    </td>
  </tr>
);

export const removeUserQuery = gql`
  mutation ($id: String!) {
    removeUser(id: $id) { id }
  }
`;

export default graphql(removeUserQuery, {
  props: ({ mutate }) => ({
    submit: (id: string) => mutate({
      variables: { id },
      refetchQueries: [{
        query: usersQuery,
      }],
    }),
  }),
})(UserItem);