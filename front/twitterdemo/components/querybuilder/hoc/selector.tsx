import * as React from 'react';
import { Flex } from 'reflexbox';
import { Close, Arrow, Dropdown, DropdownMenu, NavItem } from 'rebass';
import { QExpr } from '../types';

interface SelectorProps {
  value: QExpr;
  hideRemove?: boolean;
  hideBorder?: boolean;
  onAddClick: ({ type, value }: { type: string, value: QExpr }) => void;
  onRemoveClick: ({ type, value }: { type: string, value: QExpr }) => void;
}

interface SelectorState {
  isOpen: boolean;
}

interface WrappedComponentCtor extends React.StatelessComponent<{ value: QExpr }> {
  displayName?: string;
  name?: string;
}

const withSelector = (hideBorder = false) => (Wrapped: WrappedComponentCtor) => {
  class Selector extends React.Component<SelectorProps, SelectorState> {
    static defaultProps: any;
    static displayName = `withSelector(${Wrapped.displayName || Wrapped.name || 'Component'})`;
    constructor(props: SelectorProps) {
      super(props);
      this.state = { isOpen: false };
    }
    render() {
      const { hideRemove, onAddClick, onRemoveClick, value, ...props } = this.props;
      const addClick = (type: string) => onAddClick({ type, value });
      const removeClick = (e: any) => onRemoveClick({ type: '', value });
      const childrenComp = hideBorder ?
        (<Flex><Wrapped value={value} {...props} /></Flex>) :
        (<Flex pl={1} pt={1} pr={1} mb={1} wrap style={{ borderWidth: 2, borderStyle: 'dashed', borderColor: 'lightgray', borderRadius: '6px' }}>
          <Wrapped value={value} {...props} />
        </Flex>);
      return (
        <Dropdown>
          <Flex>
            {childrenComp}
            {hideRemove ?
                (<Flex mb={1} flexColumn align="center" justify="center" style={{ cursor: 'pointer' }} onClick={(e: any) => { e.preventDefault(); this.setState({ isOpen: true }); }}>
                  <Arrow direction={this.state.isOpen ? 'up' : 'down'} />
                </Flex>) :
                (<Flex mb={1} flexColumn align="center" justify="center" style={{ position: 'static', cursor: 'pointer' }} onClick={(e: any) => { e.preventDefault(); this.setState({ isOpen: true }); }}>
                  <Close style={{ left: '2px', top: '-12px', visibility: (hideRemove ? 'hidden' : 'visible'), position: 'relative', height: '26px', marginLeft: '4px' }} onClick={(e: any) => removeClick(e)} />
                  <Arrow style={{ margin: '12px 5px 12px 4px', position: 'absolute' }} direction={this.state.isOpen ? 'up' : 'down'} />
                </Flex>)}
          </Flex>
          <DropdownMenu mb={1} style={{ top: 'initial', borderWidth: '0', position: 'inherit' }} open={this.state.isOpen} onDismiss={() => this.setState({ isOpen: false })}>
            <NavItem is="a" onClick={() => addClick('not')}>+Not</NavItem>
            <NavItem is="a" onClick={() => addClick('mention')}>+Mention</NavItem>
          </DropdownMenu>
        </Dropdown>
      );
    }
  }
  Selector.defaultProps = {
    hideBorder: false,
    hideRemove: false,
  };
  return Selector;
};

export default withSelector;
