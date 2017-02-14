import * as AWS from 'aws-sdk';
import config from '../../config';
import * as _ from 'lodash';
import { Json, StringMap } from './types';
import { objectEntries, promisify } from './helpers';

if (!config.AWS_DYNAMO_DB_ENDPOINT) throw new Error('AWS_DYNAMO_DB_ENDPOINT not set');

if (process.env.NODE_ENV !== 'production') {
  console.log(`AWS_DYNAMO_DB_ENDPOINT = ${config.AWS_DYNAMO_DB_ENDPOINT}`);
}

AWS.config.update({
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  region: config.AWS_REGION,
  apiVersions: {
    dynamodb: '2012-08-10',
  },
});

const dynamodb = new AWS.DynamoDB({
    endpoint: config.AWS_DYNAMO_DB_ENDPOINT
});

const docClient = new AWS.DynamoDB.DocumentClient({
  service: dynamodb
});

const formatTableName = (tableName: string) => `${process.env.NODE_ENV}_${tableName}`;

// { a: 1, b: 2 }, ... -> { ':a': 1, ':b': 2, ... }
const buildAttributeValues = (...rest: StringMap[]) =>
  objectEntries(rest.reduce((r, i) => ({...r, ...i}), {})).reduce((r, [k, v]) => ({...r, ...{[`:${k}`]: v }}), {});

// ['a', 'b', ...] -> { '#a': 'a', '#b': 'b', ... }
const buildAttributeNames = (...rest: string[][]) =>
  _.uniq(([] as string[]).concat(...rest)).reduce((r, i) => ({...r, ...{ [`#${i}`]: i }}), {});

// ['a', 'b', ...] -> 'set #a = :a, #b = :b, ...'
const buildUpdateExpression = (...rest: string[][]) =>
  `set ${_.uniq(([] as string[]).concat(...rest)).reduce((r, i) => `${r ? `${r}, ` : r}#${i} = :${i}`, '')}`;

// ['a', 'b', ...] -> '#a = :a AND #b = :b AND ...'
const buildConditionExpression = (fn: (i: string) => string) => (...rest: string[][]) =>
  _.uniq(([] as string[]).concat(...rest)).reduce((r, i) => `${r ? `${r} AND ` : r}${fn(i)}`, '');

// ['a', 'b', ...] -> '#a, #b, ...'
const buildProjectionExpression = (...rest: string[][]) =>
  _.uniq(([] as string[]).concat(...rest)).map(i => `#${i}`).join(', ');

const db = {
  put: promisify<AWS.DynamoDB.DocumentClient.PutItemOutput, AWS.DynamoDB.DocumentClient.PutItemInput>(docClient.put.bind(docClient)),
  get: promisify<AWS.DynamoDB.DocumentClient.GetItemOutput, AWS.DynamoDB.DocumentClient.GetItemInput>(docClient.get.bind(docClient)),
  scan: promisify<AWS.DynamoDB.DocumentClient.ScanOutput, AWS.DynamoDB.DocumentClient.ScanInput>(docClient.scan.bind(docClient)),
  update: promisify<AWS.DynamoDB.DocumentClient.UpdateItemOutput, AWS.DynamoDB.DocumentClient.UpdateItemInput>(docClient.update.bind(docClient)),
  delete: promisify<AWS.DynamoDB.DocumentClient.DeleteItemOutput, AWS.DynamoDB.DocumentClient.DeleteItemInput>(docClient.delete.bind(docClient)),
  query: promisify<AWS.DynamoDB.DocumentClient.QueryOutput, AWS.DynamoDB.DocumentClient.QueryInput>(docClient.query.bind(docClient)),
};

const helpers = {
  Query: async (tableName: string, IndexName: string, Key: StringMap, Names: string[]) => {
      const query = {
        TableName: formatTableName(tableName),
        IndexName,
        KeyConditionExpression: buildConditionExpression((i: string) => `#${i} = :${i}`)(Object.keys(Key)),
        ExpressionAttributeNames: buildAttributeNames(Object.keys(Key), Names),
        ExpressionAttributeValues: buildAttributeValues(Key),
        ProjectionExpression: buildProjectionExpression(Object.keys(Key), Names),
      };
      const result = await db.query(query);
      return result.Items;
  },
  Update: async (tableName: string, Key: StringMap, Values: StringMap) => {
    const result = await db.update({
      TableName: formatTableName(tableName),
      Key,
      ReturnValues: 'ALL_NEW',
      ConditionExpression: buildConditionExpression(i => `#${i} = :${i}`)(Object.keys(Key)),
      ExpressionAttributeNames: buildAttributeNames(Object.keys(Key), Object.keys(Values)),
      ExpressionAttributeValues: buildAttributeValues(Key, Values),
      UpdateExpression: buildUpdateExpression(Object.keys(Values)),
    });
    return result.Attributes;
  },
  Remove: async (tableName: string, Key: StringMap) => {
    const result = await db.delete({
      TableName: formatTableName(tableName),
      Key,
      ReturnValues: 'ALL_OLD',
    });
    return result.Attributes;
  },
  Scan: async (tableName: string, AttributesToGet: string[]) => {
    const result = await db.scan({
      TableName: formatTableName(tableName),
      AttributesToGet,
    });
    return result.Items;
  },
  Get: async (tableName: string, Key: StringMap) => {
    const result = await db.get({
      TableName: formatTableName(tableName),
      Key,
    });
    return result.Item;
  },
  Put: async (tableName: string, Key: StringMap, Item: Json) => {
    const query = {
      Key,
      TableName: formatTableName(tableName),
      ConditionExpression: buildConditionExpression(i => `attribute_not_exists(${i})`)(Object.keys(Key)),
      Item: {...Item, ...Key},
    };
    await db.put(query);
    return {...Item, ...Key};
  },
};

export default {
  sdk: AWS,
  dynamodb: helpers,
};
