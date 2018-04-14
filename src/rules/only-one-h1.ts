import { LintError, Rule } from '../types';

const rule: Rule = {
  name: 'only-one-h1',
  lint($) {
    const errors: LintError[] = [];

    if ($('h1').length > 1) {
      errors.push({
        message: 'More than one <h1> tags exist'
      });
    }

    return { errors };
  }
};

export default rule;
