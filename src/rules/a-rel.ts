import { LintError, Rule } from '../types';

const rule: Rule = {
  lint($) {
    const errors: LintError[] = [];

    $('a').each((i, elem) => {
      if (!$(elem).attr('rel')) {
        errors.push({
          element: elem,
          message: '<a> tag requires rel attribute'
        });
      }
    });

    return { errors };
  }
};

export default rule;
