import * as React from 'react';
import { Button } from 'rebass';
import Header from '../header'

class MainPage extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <Header />
        <Button>Hello World</Button>
      </div>);
  };
}

export default MainPage;
