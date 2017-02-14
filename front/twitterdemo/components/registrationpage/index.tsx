import * as React from 'react';
import Header from '../header';
import Footer from '../footer';
import Signup from '../signup';
import UserList from '../userlist';

const RegistrationPage: () => React.ReactElement<any> = () => (
  <div>
    <Header />
    <h3>Register</h3>
    <Signup />
    <h4>User List</h4>
    <UserList />
    <Footer />
  </div>
);

export default RegistrationPage;