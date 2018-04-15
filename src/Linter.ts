import Ajv, { ValidateFunction } from 'ajv';
import { load } from 'cheerio';
import { readFile } from 'fs';
import getStream from 'get-stream';
import { Readable } from 'stream';
import { promisify } from 'util';
import defaultRules from './rules';
import { LintResult, Rule } from './types';
import { getLocation } from './utils/getLocation';

const ValidationError: any = Ajv.ValidationError;
const readFileAsync = promisify(readFile);

const ajv = new Ajv({
  useDefaults: true
});

function defaultValidator() {
  return true;
}

export interface LintOptions {
  rules: {
    [key: string]: any;
  };
}

export class Linter {
  private readonly rules: { [key: string]: Rule } = {};
  private validateOptions: ValidateFunction = defaultValidator;

  constructor() {
    this.defineRules(defaultRules);
  }

  public lintString(input: string, options: LintOptions): LintResult {
    return this.doLint(input, options);
  }

  public async lintFile(
    path: string,
    options: LintOptions
  ): Promise<LintResult> {
    return this.doLint(await readFileAsync(path, 'utf8'), options);
  }

  public async lintStream(
    input: Readable,
    options: LintOptions
  ): Promise<LintResult> {
    return this.doLint(await getStream(input), options);
  }

  public getRule(name: string): Rule | undefined {
    return this.rules[name];
  }

  public defineRules(rules: { [key: string]: Rule }) {
    for (const key of Object.keys(rules)) {
      this.rules[key] = rules[key];
    }

    this.validateOptions = buildValidator(this.rules);
  }

  private doLint(input: string, options: LintOptions): LintResult {
    options = normalizeLintOptions(options);

    if (!this.validateOptions(options)) {
      throw new ValidationError(this.validateOptions.errors);
    }

    const $ = load(input, {
      locationInfo: true
    } as any);

    const result: LintResult = {
      errors: []
    };

    for (const key of Object.keys(options.rules)) {
      const rule = this.rules[key];
      const [enabled, ruleOptions] = options.rules[key];

      if (!enabled) {
        continue;
      }

      const { errors } = rule.lint($, ruleOptions);

      result.errors = result.errors.concat(
        errors.map(err => ({
          ...err,
          location: err.location || getLocation(err.element),
          name: key
        }))
      );
    }

    return result;
  }
}

function buildValidator(rules: { [key: string]: Rule }): ValidateFunction {
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
        properties: ruleProps,
        type: 'object'
      }
    },
    type: 'object'
  });
}

function normalizeLintOptions(options: LintOptions) {
  for (const key of Object.keys(options.rules)) {
    const rule = options.rules[key];

    if (!Array.isArray(rule)) {
      options.rules[key] = [rule];
    }
  }

  return options;
}
