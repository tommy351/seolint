import { LintError, Rule } from '../types';

const rule: Rule = {
  name: 'img-alt',
  lint($) {
    const errors: LintError[] = [];

    $('img').each((i, elem) => {
      if (!$(elem).attr('alt')) {
        errors.push({
          element: elem,
          message: '<img> tag requires alt attribute'
        });
      }
    });

    return { errors };
  }
};

export default rule;
