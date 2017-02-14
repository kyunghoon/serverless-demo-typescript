import * as React from 'react';
import { Flex } from 'reflexbox';
import { Link } from 'react-router';

const Header = () => (
  <Flex col={12} justify="space-around">
    <Link to="/twittersearch">Search</Link>
    <Link to="/registration">Register</Link>
  </Flex>
);

export default Header;
