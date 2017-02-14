// development config

import common from './common';

const vars = {
  AWS_ACCESS_KEY_ID: null as string|null,
  AWS_SECRET_ACCESS_KEY: null as string|null,
  AWS_REGION: 'ap-northeast-1',
  AWS_DYNAMO_DB_ENDPOINT: 'https://dynamodb.ap-northeast-1.amazonaws.com',
  CORS_ALLOW_ORIGIN: 'http://kyunghoon-client.s3-website-ap-northeast-1.amazonaws.com',
};

export default { ...common, ...vars };
