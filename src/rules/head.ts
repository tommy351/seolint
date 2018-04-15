import { LintError, Rule } from '../types';

const rule: Rule = {
  schema: {
    default: {},
    properties: {
      meta: {
        default: ['description', 'keywords'],
        items: {
          enum: ['description', 'keywords', 'author'],
          type: 'string'
        },
        type: 'array'
      },
      title: {
        default: true,
        type: 'boolean'
      }
    },
    type: 'object'
  },
  lint($, options) {
    const errors: LintError[] = [];
    const head = $('head');

    if (options.title && !head.children('title').length) {
      errors.push({
        element: head[0],
        message: '<title> tag is required in <head>'
      });
    }

    const metas = head
      .children('meta')
      .map((i, elem) => $(elem).attr('name'))
      .get();

    for (const name of options.meta) {
      if (!~metas.indexOf(name)) {
        errors.push({
          element: head[0],
          message: `<meta name="${name}"> is required in <head>`
        });
      }
    }

    return { errors };
  }
};

export default rule;
