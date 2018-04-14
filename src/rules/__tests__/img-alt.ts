import { load } from 'cheerio';
import { LintResult } from '../../types';
import rule from '../img-alt';

let input: string;
let $: CheerioStatic;
let result: LintResult;

beforeEach(() => ($ = load(input)));
beforeEach(() => (result = rule.lint($)));

describe('when no <img> tag in HTML', () => {
  beforeAll(() => {
    input = `<body>
        <div>foo</div>
      </body>`;
  });

  it('should have no errors', () => expect(result.errors).toHaveLength(0));
});

describe('<img> tag without alt attribute', () => {
  beforeAll(() => {
    input = `<body>
        <img src="foo.jpg">
      </body>`;
  });

  it('should have an error', () => expect(result.errors).toHaveLength(1));

  it('check message', () =>
    expect(result.errors[0]).toHaveProperty(
      'message',
      '<img> tag requires alt attribute'
    ));

  it('check element', () =>
    expect(result.errors[0]).toHaveProperty('element', $('img')[0]));
});

describe('<img> tag with alt attribute', () => {
  beforeAll(() => {
    input = `<body>
        <img src="foo.jpg" alt="bar">
      </body>`;
  });

  it('should have no errors', () => expect(result.errors).toHaveLength(0));
});
