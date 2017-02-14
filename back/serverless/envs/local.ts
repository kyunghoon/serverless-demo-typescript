// development config

import common from './common';

const vars = {
  AWS_ACCESS_KEY_ID: 'omit',
  AWS_SECRET_ACCESS_KEY: 'omit',
  AWS_REGION: 'us-east-1',
  AWS_DYNAMO_DB_ENDPOINT: process.env.DOCKER_ENV === 'lambci' ? 'http://dynamodb:8000' : 'http://localhost:8000',
  CORS_ALLOW_ORIGIN: '*',
};

export default { ...common, ...vars };
