import { LintError, Rule } from '../types';

const rule: Rule = {
  schema: {
    default: 15,
    minimum: 0,
    type: 'integer'
  },
  lint($, max) {
    const errors: LintError[] = [];
    const strong = $('strong');

    for (let i = max; i < strong.length; i++) {
      errors.push({
        element: strong[i],
        message: `The number of <strong> tag must not larger than ${max}`
      });
    }

    return { errors };
  }
};

export default rule;
