import { load } from 'cheerio';
import { LintResult } from '../../types';
import rule from '../only-one-h1';

let input: string;
let $: CheerioStatic;
let result: LintResult;

beforeEach(() => ($ = load(input)));
beforeEach(() => (result = rule.lint($)));

describe('no <h1> tag', () => {
  beforeAll(() => {
    input = `<body></body>`;
  });

  it('should have no errors', () => expect(result.errors).toHaveLength(0));
});

describe('only one <h1> tag', () => {
  beforeAll(() => {
    input = `<body>
      <h1>foo</h1>
    </body>`;
  });

  it('should have no errors', () => expect(result.errors).toHaveLength(0));
});

describe('multiple <h1> tags', () => {
  beforeAll(() => {
    input = `<body>
      <h1>foo</h1>
      <h1>bar</h1>
      <h1>baz</h1>
    </body>`;
  });

  it('should have an error', () => expect(result.errors).toHaveLength(2));

  it('check message', () =>
    expect(result.errors[0]).toHaveProperty(
      'message',
      'More than one <h1> tags exist'
    ));

  it('check element', () => {
    for (let i = 0; i < result.errors.length; i++) {
      expect(result.errors[i]).toHaveProperty('element', $('h1')[i + 1]);
    }
  });
});
