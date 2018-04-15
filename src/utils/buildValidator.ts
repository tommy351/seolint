import Ajv, { ValidateFunction } from 'ajv';
import { Rule } from '../types';

const ajv = new Ajv({
  useDefaults: true
});

export function buildValidator(rules: {
  [key: string]: Rule;
}): ValidateFunction {
  const ruleProps: { [key: string]: object } = {};

  for (const key of Object.keys(rules)) {
    const rule = rules[key];
    const prop = {
      additionalItems: false,
      items: [{ type: 'boolean' }],
      minItems: 1,
      type: 'array'
    };

    ruleProps[key] = prop;

    if (rule.schema) {
      prop.items.push(rule.schema as any);
    }
  }

  return ajv.compile({
    properties: {
      rules: {
        additionalProperties: false,
        properties: ruleProps,
        type: 'object'
      }
    },
    required: ['rules'],
    type: 'object'
  });
}
