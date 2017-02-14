import * as React from 'react';
import { Flex, withReflex } from 'reflexbox';
import withSelector from './hoc/selector';
import { compose } from 'recompose';

interface TermState {
}

interface TermProps {
  onFocus: (e: any) => void;
  onClick: (e: any) => void;
  onChange: (e: any) => void;
  onKeyUp: (e: any) => void;
  onBlur: (e: any) => void;
  isOpen: boolean;
  focused?: boolean;
  value: any;
}

class Term extends React.Component<TermProps, TermState> {
  static displayName: string = 'Term';
  static defaultProps: any;
  input: any;
  constructor(props: TermProps) {
    super(props);
    this.state = { isOpen: false };
  }
  componentDidMount = () => {
    this.input.focus();
  };
  focus = (e: any) => {
    // fix to move cursor to end of input
    e.target.value = e.target.value; // eslint-disable-line no-param-reassign

    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  };
  click = (e: any) => {
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }
  change = (e: any) => {
    this.props.onChange(e);
  }
  keyUp = (e: any) => {
    if (e.key === 'Backspace') {
      if (e.target.value.length === 0) {
        this.input.blur();
      }
    }
    this.props.onKeyUp(e);
  }
  render() {
    return (
      <Flex>
        <input
          ref={input => {
            this.input = input;
            if (this.input) { if (this.props.focused) this.input.focus(); }
          }}
          style={{ textAlign: 'center', marginBottom: '8px' }}
          autoFocus={false}
          type="text"
          placeholder="Term"
          value={this.props.value}
          onClick={this.click}
          onFocus={this.focus}
          onBlur={this.props.onBlur}
          onChange={this.change}
          onKeyUp={this.keyUp}
        />
      </Flex>
    );
  }
}

Term.defaultProps = {
  focused: false,
};

export default compose(withReflex(), withSelector(true))(Term);
