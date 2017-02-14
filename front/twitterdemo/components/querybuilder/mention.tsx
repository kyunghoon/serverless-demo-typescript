import * as React from 'react';
import { Flex } from 'reflexbox';
import withSelector from './hoc/selector';

interface Props {
  children?: React.ReactNode;
}

const Mention = (props: Props) => {
  return (
    <Flex>
      <Flex mb={1} mr={1} flexColumn justify="center">
        Mention
      </Flex>
      {props.children}
    </Flex>
  );
};

export default withSelector()(Mention);

