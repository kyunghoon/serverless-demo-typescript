const jwt = require('jsonwebtoken');
import config from '../../config';
import { Json } from './types';

if (!config.AUTH_TOKEN_SECRET) {
  throw new Error('AUTH_TOKEN_SECRET not set');
}

const authorize = (token: string, requiredPermissions: string[]) => {
  try {
    // make sure user is logged in
    const user = jwt.verify(token, config.AUTH_TOKEN_SECRET);

    // make sure user have the required permissions
    user.permissions = user.permissions || [];
    requiredPermissions.forEach((p) => {
      if (user.permissions.indexOf(p) === -1) {
        throw new Error('user is unauthorized to take this action');
      }
    });
    return user;
  } catch (e) {
    throw new Error('invalid token');
  }
};

const authenticate = (json: Json) => {
  return jwt.sign(json, config.AUTH_TOKEN_SECRET);
};

export default { authenticate, authorize };
