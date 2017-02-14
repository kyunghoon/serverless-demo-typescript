import { validate } from '../validation';

const validations = {
  password: (value: string) => (/[a-zA-Z0-9!@#\$%\^&\*]\w{3,14}$/.test(value) ? null : 'invalid password'), // eslint-disable-line no-useless-escape
  username: (value: string) => (/^[a-z0-9_-]{3,16}$/.test(value) ? null : 'invalid username'),
  email: (value: string) => (/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(value) ? null : 'invalid email'),
};

export default (data: { [key: string]: string }) => {
  const errors = validate(data, validations);
  if (errors.length > 0) {
    throw new Error(errors.join(','));
  }
};
