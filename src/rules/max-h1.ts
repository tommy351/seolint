import { LintError, Rule } from '../types';

const rule: Rule = {
  lint($) {
    const errors: LintError[] = [];

    return { errors };
  }
};

export default rule;
