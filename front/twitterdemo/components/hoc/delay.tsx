import * as React from 'react';

type DelayState = {
  isWaiting: boolean;
}

const withDelay = <Props extends {}>(Wrapped: React.ComponentClass<Props>): React.ComponentClass<Props> => {
  return class extends React.Component<Props, DelayState> {
    timeoutId: number;
    constructor(props: Props) {
      super(props);
      this.state = { isWaiting: true };
    }
    componentDidMount() {
      this.timeoutId = 0;
    }
    componentWillReceiveProps(nextProps: Props) {
      this.setState({ isWaiting: true });
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = 0;
      }
      this.timeoutId = window.setTimeout(() => {
        this.setState({ isWaiting: false });
      }, 2000);
    }
    componentWillUnmount() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = 0;
      }
    }
    render() {
      if (this.state.isWaiting) {
        return null;
      } else {
        return <Wrapped {...this.props} />;
      }
    }
  }
};

export default withDelay;
