import * as React from 'react';
import { Flex, Box } from 'reflexbox';
import { Button } from 'rebass';
import Ands from './ands';
import { joinTerms } from './helpers';
import { AndTree } from './types';

interface OrsProps {
  ors: [number, AndTree][];
  onTermKeyUp: (e: any, orKey: number, andKey: number) => void;
  onTermBlur: (e: any, orKey: number, andKey: number) => void;
  onTermFocus?: (e: any, orKey: number, andKey: number) => void;
  onTermClick?: (e: any, orKey: number, andKey: number) => void;
  onTermChange: (e: any, orKey: number, andKey: number) => void;
  onTermUpdateExpression: (e: any, orKey: number, andKey: number) => void;
  onAndClick: (e: any, orKey: number) => void;
  onOrClick: (e: any) => void;
}

interface OrsState {
  focusedKey: number;
}

const getAndKeyList = (props: OrsProps, orKey: number) => Object.entries(props.ors.find(([k]) => k === orKey)[1]).map(([k]) => parseInt(k));
const getOrKeyList = (props: OrsProps) => props.ors.map(([k]) => k);
const getFirstOrKey = (props: OrsProps) => getOrKeyList(props)[0];
const getLastOrKey = (props: OrsProps) => props.ors[props.ors.length - 1][0];
const getPrevOrKey = (props: OrsProps, orKey: number) => {
  const keyList = getOrKeyList(props);
  const index = keyList.findIndex(k => k === orKey);
  if (index < 1) return null;
  return keyList[index - 1];
};
const getNextOrKey = (props: OrsProps, orKey: number) => {
  const keyList = getOrKeyList(props);
  const index = keyList.findIndex(k => k === orKey);
  if (index + 1 > keyList.length - 1) return null;
  return keyList[index + 1];
};

class Ors extends React.Component<OrsProps, OrsState> {
  static displayName: string;
  static defaultProps: any;
  constructor(props: OrsProps) {
    super(props);
    this.state = { focusedKey: getFirstOrKey(props) };
  }
  componentWillReceiveProps = (newProps: OrsProps) => {
    if (newProps.ors.length > this.props.ors.length) {
      this.setState({ focusedKey: getLastOrKey(newProps) });
    } else if (newProps.ors.length < this.props.ors.length) {
      const prevOrKey = getPrevOrKey(this.props, this.state.focusedKey);
      if (prevOrKey !== null) {
        this.setState({ focusedKey: prevOrKey });
      }
    }
  }
  termKeyUp = (e: any, orKey: number, andKey: number) => {
    if (e.key === 'Backspace' && e.target.value.trim().length === 0) {
      const andList = getAndKeyList(this.props, orKey);
      if ((andList.length > 0 && andKey <= andList[0])
        || (andList.length === 0 && e.target.value.length === 0)) {
        const prevOrKey = getPrevOrKey(this.props, orKey);
        if (prevOrKey !== null) {
          this.setState({ focusedKey: prevOrKey });
        } else if (andList.length === 0) {
          const nextOrKey = getNextOrKey(this.props, orKey);
          if (nextOrKey !== null) {
            this.setState({ focusedKey: nextOrKey });
          }
        }
      }
    }
    this.props.onTermKeyUp(e, orKey, andKey);
  }
  termBlur = (e: any, orKey: number, andKey: number) => {
    if (this.props.onTermBlur) {
      this.props.onTermBlur(e, orKey, andKey);
    }
  }
  termFocus = (e: any, orKey: number, andKey: number) => {
    if (this.props.onTermFocus) {
      this.props.onTermFocus(e, orKey, andKey);
    }
  }
  termClick = (e: any, orKey: number, andKey: number) => {
    this.setState({ focusedKey: orKey });
    if (this.props.onTermClick) {
      this.props.onTermClick(e, orKey, andKey);
    }
  }
  andClick = (e: any, orKey: number) => {
    this.setState({ focusedKey: orKey });
    this.props.onAndClick(e, orKey);
  }
  renderOr = ([orKey, ands]: [number, AndTree], index: number) => {
    if (orKey === 0) {
      return (<Box mb={1} key={`_${index}`}>OR</Box>);
    }
    const sorted = Object.entries(ands).map(([k, v]) => [parseInt(k), v] as [number, any]).sort(([a], [b]) => a - b);
    return (<Ands
      key={orKey} id={orKey} ands={sorted} onAndClick={this.andClick}
      focused={this.state.focusedKey === orKey}
      onTermClick={this.termClick}
      onTermBlur={this.termBlur}
      onTermChange={this.props.onTermChange}
      onTermKeyUp={this.termKeyUp}
      onTermFocus={this.termFocus}
      onTermUpdateExpression={this.props.onTermUpdateExpression}
    />);
  };
  orClick = (e: any) => {
    this.props.onOrClick(e);
  }
  render() {
    //console.log('OR-FOCUS-KEY:', this.state.focusedKey);
    const last = Object.entries(this.props.ors[this.props.ors.length - 1][1]);
    const shouldRenderButton = last.reduce((r, [_k, v]) => r + joinTerms(v).length, 0) > 0;
    return (
      <Flex flexColumn align="center">
        {this.props.ors.intersperse([0, {}]).map(this.renderOr)}
        {!shouldRenderButton ? (<span />) : (<Button pl={1} pr={1} onClick={this.orClick}>+Or</Button>)}
      </Flex>
    );
  }
}

Ors.displayName = 'Ors';

Ors.defaultProps = {
  onTermClick: null,
  onTermFocus: null,
  onTermBlur: null,
};

export default Ors;
