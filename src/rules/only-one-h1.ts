import { LintError, Rule } from '../types';

const rule: Rule = {
  lint($) {
    const errors: LintError[] = [];
    const h1 = $('h1');

    for (let i = 1; i < h1.length; i++) {
      errors.push({
        element: h1[i],
        message: 'More than one <h1> tags exist'
      });
    }

    return { errors };
  }
};

export default rule;
