// test config

import common from './common';

const vars = {
  AWS_DYNAMO_DB_ENDPOINT: 'http://localhost:8000',
};

export default { ...common, ...vars };
