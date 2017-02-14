import * as React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import usersQuery from '../userlist';

interface SignupState {
  email: string,
  password: string,
}

interface SignupProps {
  onSubmit: (email: string, password: string) => Promise<any>;
}

class Signup extends React.Component<SignupProps, SignupState> {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
    };
  }

  emailChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: event.target.value });
  };

  passwordChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: event.target.value });
  };

  registerClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!this.state.email) { throw new Error('invalid email'); }
    if (!this.state.password) { throw new Error('invalid password'); }

    this.props.onSubmit(this.state.email, this.state.password)
      .then(_result => {
        this.setState({
          email: '',
          password: '',
        });
      }).catch(e => console.error(e));
  };

  render() {
    return (
      <form action="">
        <fieldset>
          <label htmlFor="emailField">Email</label>
          <input type="text" placeholder="Enter Email" id="emailField" value={this.state.email} onChange={this.emailChanged} />
          <label htmlFor="passworldField">Password</label>
          <input type="password" placeholder="Password" id="passwordField" value={this.state.password} onChange={this.passwordChanged} />
          <input className="button-primary" type="submit" value="Register" onClick={this.registerClicked} />
          <input className="float-right" type="submit" value="Sign In" onClick={this.registerClicked} />
        </fieldset>
      </form>
    );
  }
}

export const createUserQuery = gql`
  mutation ($email: String!, $password: String!) {
    createUser(email: $email, password: $password) {
      id
      email
    }
  }
`;

export default graphql(createUserQuery, {
  props: ({ mutate }) => ({
    submit: (email: string, password: string) => mutate({
      variables: { email, password },
      optimisticResponse: {
        createUser: {
          id: '...',
          email,
        },
      },
      refetchQueries: [{
        query: usersQuery,
      }],
    }),
  }),
})(Signup);
