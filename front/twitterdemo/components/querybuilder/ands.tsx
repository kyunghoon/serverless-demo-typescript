import * as React from 'react';
import { Flex, Box } from 'reflexbox';
import { Button } from 'rebass';
import { joinTerms, renderExpression } from './helpers';
import { QExpr } from './types';

interface AndsProps {
  id: number;
  ands: [number, QExpr][];
  focused: boolean;
  onTermClick: (e: any, orKey: number, andKey: number) => void;
  onTermChange: (e: any, orKey: number, andKey: number) => void;
  onTermKeyUp: (e: any, orKey: number, andKey: number) => void;
  onTermBlur: (e: any, orKey: number, andKey: number) => void;
  onTermFocus: (e: any, orKey: number, andKey: number) => void;
  onTermUpdateExpression: (value: any, orKey: number, andKey: number) => void;
  onAndClick: (e: any, andKey: number) => void;
}

interface AndsState {
  focusedKey: number;
}

const getAndKeyList = (props: AndsProps) => props.ands.map(([k]) => k);
const getFirstAndKey = (props: AndsProps) => getAndKeyList(props)[0];
const getPrevAndKey = (props: AndsProps, andKey: number) => {
  const keyList = getAndKeyList(props);
  const index = keyList.findIndex(k => k === andKey);
  if (index < 1) return null;
  return keyList[index - 1];
};
const getNextAndKey = (props: AndsProps, andKey: number) => {
  const keyList = getAndKeyList(props);
  const index = keyList.findIndex(k => k === andKey);
  if (index + 1 > keyList.length - 1) return null;
  return keyList[index + 1];
};

class Ands extends React.Component<AndsProps, AndsState> {
  static displayName: string;
  static defaultProps: any;
  constructor(props: AndsProps) {
    super(props);
    this.state = { focusedKey: getFirstAndKey(props) };
  }
  termChange = (e: any, orKey: number, andKey: number) => {
    this.setState({ focusedKey: andKey });
    this.props.onTermChange(e, orKey, andKey);
  }
  termKeyUp = (e: any, orKey: number, andKey: number) => {
    if (e.key === 'Backspace' && e.target.value.trim().length === 0) {
      const prevAndKey = getPrevAndKey(this.props, andKey);
      if (prevAndKey !== null) {
        this.setState({ focusedKey: prevAndKey });
      } else {
        const nextAndKey = getNextAndKey(this.props, andKey);
        if (nextAndKey !== null) {
          this.setState({ focusedKey: nextAndKey });
        }
      }
    }
    this.props.onTermKeyUp(e, orKey, andKey);
  }
  termClick = (e: any, orKey: number, andKey: number) => {
    this.setState({ focusedKey: andKey });
    this.props.onTermClick(e, orKey, andKey);
  }
  termBlur = (e: any, orKey: number, andKey: number) => {
    this.props.onTermBlur(e, orKey, andKey);
  }
  termUpdateExpression = ({ type, value }: {type: string, value: QExpr}, orKey: number, andKey: number) => {
    this.props.onTermUpdateExpression(value, orKey, andKey);
  }
  renderAnd = ([andKey, value]: [number, QExpr], orKey: number, index: number) => {
    const props = {
      onClick: (e: any) => this.termClick(e, orKey, andKey),
      onBlur: (e: any) => this.termBlur(e, orKey, andKey),
      onFocus: (e: any) => this.props.onTermFocus(e, orKey, andKey),
      onChange: (e: any) => this.termChange(e, orKey, andKey),
      onKeyUp: (e: any) => this.termKeyUp(e, orKey, andKey),
      onUpdateExpression: (pair: {type: string, value: QExpr}) => this.termUpdateExpression(pair, orKey, andKey),
      focused: this.props.focused && andKey === this.state.focusedKey,
    };
    const ret = renderExpression(props, value);
    if (index === 0) {
      return <Box key={`_${index}`}>{ret}</Box>;
    } else {
      return <Flex align="center" key={`_${index}`}><Box mb={1} ml={1} mr={1}>AND</Box>{ret}</Flex>;
    }
  };

  render() {
    const last = this.props.ands[this.props.ands.length - 1];
    const shouldRenderButton = joinTerms(last[last.length - 1]).length > 0;
    return (
      <Flex key={this.props.id} pl={1} pt={1} pr={1} mb={1} wrap align="center" style={{ borderWidth: 2, borderStyle: 'dashed', borderColor: 'lightgray', borderRadius: '6px' }}>
        {this.props.ands.map((pair, index) => this.renderAnd(pair, this.props.id, index))}
        {!shouldRenderButton ?
          null : (<Flex flexColumn justify="center"><Button ml={1} mb={1} pl={1} pr={1} onClick={(e: any) => this.props.onAndClick(e, this.props.id)}>+And</Button></Flex>)
        }
      </Flex>
    );
  }
}

Ands.displayName = 'Ands';

Ands.defaultProps = {
  focused: false,
};

export default Ands;
