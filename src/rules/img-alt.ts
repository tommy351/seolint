import { LintError, Rule } from '../types';

const rule: Rule = {
  name: 'img-alt',
  lint($: CheerioStatic) {
    const errors: LintError[] = [];

    $('img').each((i, elem) => {
      if (!$(elem).attr('alt')) {
        errors.push({
          message: '<img> tag requires alt attribute'
        });
      }
    });

    return { errors };
  }
};

export default rule;
