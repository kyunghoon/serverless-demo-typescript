import { objectEntries } from './helpers';

type Validation = (value: string) => string|null;

interface Validations {
  [name: string]: Validation;
}

export const validate = (object: { [key: string]: string }, validations: Validations): string[] => {
  const errors: string[] = [];
  objectEntries(object).forEach(([key, value]) => {
    const validate = validations[key];
    if (validate) {
      const error = validate(value);
      if (error) {
        errors.push(error);
      }
    }
  });
  return errors;
};