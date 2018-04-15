import { LintError, Rule } from '../types';

const rule: Rule = {
  schema: {
    default: 15,
    minimum: 0,
    type: 'integer'
  },
  lint($, max) {
    const errors: LintError[] = [];

    if ($('strong').length > max) {
      errors.push({
        message: `The number of <strong> tag must not larger than ${max}`
      });
    }

    return { errors };
  }
};

export default rule;
