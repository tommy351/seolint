import { load } from 'cheerio';
import { readFile } from 'fs';
import getStream from 'get-stream';
import { Readable } from 'stream';
import { promisify } from 'util';
import defaultRules from './rules';
import { LintResult, Rule } from './types';

const readFileAsync = promisify(readFile);

export interface LinterOptions extends CheerioOptionsInterface {
  rules: {
    [key: string]: any;
  };
}

export class Linter {
  private readonly rules: { [key: string]: Rule } = {};

  constructor(private options: LinterOptions) {
    this.defineRules(defaultRules);
  }

  public lintString(input: string): LintResult {
    return this.runLint(input);
  }

  public async lintFile(path: string): Promise<LintResult> {
    return this.runLint(await readFileAsync(path, 'utf8'));
  }

  public async lintStream(input: Readable): Promise<LintResult> {
    return this.runLint(await getStream(input));
  }

  public defineRules(rules: { [key: string]: Rule }) {
    for (const key of Object.keys(rules)) {
      this.rules[key] = rules[key];
    }
  }

  private runLint(input: string): LintResult {
    const { rules, ...options } = this.options;
    const $ = load(input, options);
    const list: Rule[] = [];
    const initial: LintResult = {
      errors: []
    };

    for (const key of Object.keys(rules)) {
      const rule = this.rules[key];

      if (!rule) {
        throw new Error(`Rule "${key}" is not defined`);
      }

      const ruleOptions = this.options.rules[key];

      if (ruleOptions) {
        list.push(rule);
      }
    }

    return list.reduce((acc, rule) => {
      const result = rule.lint($);

      return {
        ...acc,
        errors: [...acc.errors, ...result.errors]
      };
    }, initial);
  }
}
