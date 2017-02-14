import * as React from 'react';
import update = require('react-addons-update');
import { Heading } from 'rebass';
import { Flex } from 'reflexbox';
import * as _ from 'lodash';
import Ors from './ors';
import { joinTerms } from './helpers';
import { OrTree, QExpr } from './types';

interface QueryBuilderState {
  query: string;
  tree: OrTree;
  counter: number;
}

interface QueryBuilderProps {
  onQueryChange: (query: string) => void;
  onClick?: (e: any) => void;
  onAndClick?: (e: any, orKey: string) => void;
  onOrClick?: (e: any) => void;
}

const parseQExpr: (qexpr: QExpr) => string = (qexpr) => {
  if (_.isNil(qexpr)) {
    throw new Error('bad expression');
  } else if (_.isString(qexpr)) {
    return qexpr;
  } else if (_.isArray(qexpr.$and)) { // {$and [...]}
    if (qexpr.$and.length === 1) {
      return parseQExpr(qexpr.$and[0]);
    }
    return `(${qexpr.$and.map(parseQExpr).join(' ')})`;
  } else if (_.isArray(qexpr.$or)) { // {$or [...]}
    if (qexpr.$or.length === 1) {
      return parseQExpr(qexpr.$or[0]);
    }
    return `(${qexpr.$or.map(parseQExpr).join(' OR ')})`;
  } else if (qexpr.$not) { // {$not ...}
    return `-${parseQExpr(qexpr.$not)}`;
  } else if (qexpr.$exact) { // {$exact ...}
    return `"${parseQExpr(qexpr.$exact)}"`;
  } else if (qexpr.$to) { // {$to ...}
    return `to:${parseQExpr(qexpr.$to)}`;
  } else if (qexpr.$from) { // {$from ...}
    return `from:${parseQExpr(qexpr.$from)}`;
  } else if (qexpr.$pos) { // {$pos ...}
    return `${parseQExpr(qexpr.$pos)} :)`;
  } else if (qexpr.$neg) { // {$neg ...}
    return `${parseQExpr(qexpr.$neg)} :(`;
  } else if (qexpr.$q) { // {$q ...}
    return `${parseQExpr(qexpr.$q)} ?`;
  } else if (qexpr.$mention) { // {$mention ...}
    return `@${parseQExpr(qexpr.$mention)}`;
  } else {
    return '';
  }
};

const treeToQExpr = (tree: OrTree) => ({
  $or: Object.entries(tree).map(([_k, v]) => ({
    $and: Object.entries(v).map(([_k1, v2]) => v2),
  })),
});

export default class QueryBuilder extends React.Component<QueryBuilderProps, QueryBuilderState> {
  static displayName: string;
  constructor(props: QueryBuilderProps) {
    super(props);
    this.state = {
      // the data structure used for queries are represented using a collection inside a collection
      // the outer collection represents the `ors`, the inner collection represents the `ands`
      // these collections must always have at least one element
      tree: { 1: { 2: '' } },

      // the built query
      query: '',

      // needed for genering unique keys for iterated components
      counter: 3,
    };
  }

  componentDidUpdate = (prevProps: QueryBuilderProps, prevState: QueryBuilderState) => {
    if (prevState.query !== this.state.query) {
      if (this.props.onQueryChange) {
        this.props.onQueryChange(this.state.query);
      }
    }
  };

  termBlur = (e: any, orKey: number, andKey: number) => {
    const newTree = update(this.state.tree, { $merge: {} });
    if (!e.target.value) {
      if ((Object.entries(newTree).length === 1 && Object.entries(newTree[orKey]).length > 1)
        || (Object.entries(newTree).length > 1 && Object.entries(newTree[orKey]).length > 0)) {
        delete newTree[orKey][andKey];
      }
      if (Object.entries(newTree).length > 1 && Object.entries(newTree[orKey]).length === 0) {
        delete newTree[orKey];
      }
      this.setState({
        query: parseQExpr(treeToQExpr(newTree)),
        tree: newTree,
      });
    }
  };

  termChange = (e: any, orKey: number, andKey: number) => {
    const newTerm = e.target.value;
    const joinedTerm = joinTerms(newTerm);
    if (joinedTerm.endsWith(' ') && joinedTerm.length > 1) {
      this.pushAnd(orKey);
    } else {
      const newTree = update(this.state.tree, { [orKey]: { [andKey]: { $set: newTerm } } });
      this.setState({
        query: parseQExpr(treeToQExpr(newTree)),
        tree: newTree,
      });
    }
  };

  termKeyUp = (e: any, orKey: number, andKey: number) => {
    if (e.key === 'Enter') {
      this.pushOr();
    }
  }

  pushOr = () => {
    const idx = this.state.counter;
    this.setState({
      tree: update(this.state.tree, { $merge: { [idx]: { [idx + 1]: '' } } }),
      counter: idx + 2,
    });
  }

  pushAnd = (orKey: number) => {
    const idx = this.state.counter;
    this.setState({
      tree: update(this.state.tree, { [orKey]: { $merge: { [idx]: '' } } }),
      counter: idx + 1,
    });
  }

  andClick = (e: any, orKey: number) => {
    e.preventDefault();
    this.pushAnd(orKey);
  };

  orClick = (e: React.MouseEvent<Event>) => {
    e.preventDefault();
    this.pushOr();
  };

  termUpdateExpression = (newValue: QExpr, orKey: number, andKey: number) => {
    //console.log('OLDVAL:', JSON.stringify(this.state.tree), JSON.stringify(newValue));
    const newTree = update(this.state.tree, { [`${orKey}`]: { [`${andKey}`]: { $set: newValue } } });
    //console.log('NEWVAL:', JSON.stringify(newTree));
    this.setState({
      query: parseQExpr(treeToQExpr(newTree)),
      tree: newTree,
    });
  };

  toSortedEntities = (col: OrTree) =>
    Object.entries(col).map(([k, v]) => [parseInt(k), v] as [number, {}]).sort(([a], [b]) => a - b);

  render() {
    //console.log('QUERY', this.state.query, JSON.stringify(this.state.tree), parseQExpr(treeToQExpr(this.state.tree)));
    return (
      <Flex flexColumn align="center" mt={4} mb={4}>
        <Heading ml={2} mb={2} level={2}>Twitter QueryBuilder</Heading>
        <Ors
          ors={this.toSortedEntities(this.state.tree)}
          onOrClick={this.orClick}
          onAndClick={this.andClick}
          onTermBlur={this.termBlur}
          onTermChange={this.termChange}
          onTermKeyUp={this.termKeyUp}
          onTermUpdateExpression={this.termUpdateExpression}
        />
      </Flex>
    );
  };
}

QueryBuilder.displayName = 'QueryBuilder';

