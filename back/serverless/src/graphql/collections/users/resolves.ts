import * as bcryptjs from 'bcryptjs';
const uuid = require('uuid-js');
import aws from '../aws';
import auth from '../auth';

const create = async (email: string, password: string) => {
  const exists = await aws.dynamodb.Query('Users', 'emailIndex', { email }, []);
  if (exists && exists.length > 0) throw new Error('email already in use');
  const newUser = await aws.dynamodb.Put('Users', { id: uuid.create().toString() }, {
    email,
    permissions: ['UPDATE_USER', 'DELETE_USER'],
    screenName: email.split('@')[0],
    hash: bcryptjs.hashSync(password, 10),
  });
  return Object.assign({}, newUser, { token: auth.authenticate(newUser) });
};

const login = async (fields: string[], email: string, password: string) => {
  const result = await aws.dynamodb.Query('Users', 'emailIndex', { email }, [...fields, ...['hash']]);
  if (!result) throw new Error('user not found');
  if (result.length !== 1) throw new Error('multiple users found');

  const user = result[0];
  if (!bcryptjs.compareSync(password, user['hash'])) {
    throw new Error('invalid password');
  }
  return Object.assign({}, user, { token: auth.authenticate(user) });
};

const findOne = async (id: string) => {
  return aws.dynamodb.Get('Users', { id });
}

const find = async (fields: string[]) =>
  aws.dynamodb.Scan('Users', fields);

const update = async (id: string, name: string, screenName: string) =>
  aws.dynamodb.Update('Users', { id }, { name, screenName });

const remove = async (id: string) => {
  if (id === '1') throw new Error('cannot remove guest account');
  return aws.dynamodb.Remove('Users', { id });
};

export default {
  create,
  find,
  findOne,
  login,
  remove,
  update,
};
