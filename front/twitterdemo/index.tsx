import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import * as _ from 'lodash';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { Router, Route, hashHistory } from 'react-router';

import StylesPage from './components/stylespage';
import RegistrationPage from './components/registrationpage';
import SearchPage from './components/searchpage';
import MagePage from './components/mainpage';

import './styles.css';
import 'milligram-cssnext/dist/milligram.css'; // eslint-disable-line import/first

// Extensions
declare global {
  interface Array<T> {
    partition(size: number): Array<Array<T>>;
    intersperse(size: T): Array<T>;
    find(predicate: (search: T) => boolean) : T;
    findIndex(predicate: (search: T) => boolean) : number;
  }
  interface String {
    endsWith(suffix: string): boolean;
    startsWith(prefix: string): boolean;
    replaceAll(find: string, replace: string): string;
  }
}
Array.prototype.partition = function partition(size) { const result = _.groupBy(this, function group(item, i) { return Math.floor(i / size); }); return _.values(result); }; // eslint-disable-line no-extend-native, prefer-arrow-callback
Array.prototype.intersperse = function intersperse<T>(i: T) { return [].concat(...this.map((e: T) => [i, e])).slice(1); }; // eslint-disable-line no-extend-native
String.prototype.endsWith = function endsWith(suffix) { return this.indexOf(suffix, this.length - suffix.length) !== -1; }; // eslint-disable-line no-extend-native
String.prototype.startsWith = function startsWith(prefix) { return this.slice(0, prefix.length) === prefix; }; // eslint-disable-line no-extend-native
String.prototype.replaceAll = function replaceAll(find, replace) { return this.replace(new RegExp(find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'), 'g'), replace); }; // eslint-disable-line no-extend-native, no-useless-escape

if (!process.env.GRAPHQL_ENDPOINT) throw new Error('GRAPHQL_ENDPOINT not set');

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: process.env.GRAPHQL_ENDPOINT,
  }),
});

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <ApolloProvider client={client}>
        <Router key={Math.random()} history={hashHistory}>
          <Route path="/" component={MagePage} />
          <Route path="/twittersearch" component={SearchPage} />
          <Route path="/registration" component={RegistrationPage} />
          <Route path="/styles" component={StylesPage} />
        </Router>
      </ApolloProvider>
    </AppContainer>,
    document.getElementById('root'),
  );
};

render();

declare global {
  interface NodeModule {
    hot: {accept: (path: string, fn: () => void) => void};
  }
}

if (module.hot) {
  module.hot.accept('./components/searchpage', () => render());
  module.hot.accept('./components/stylespage', () => render());
  module.hot.accept('./components/registrationpage', () => render());
}
