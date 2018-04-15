import { load } from 'cheerio';
import { LintResult } from '../../types';
import rule from '../a-rel';

let input: string;
let $: CheerioStatic;
let result: LintResult;

beforeEach(() => ($ = load(input)));
beforeEach(() => (result = rule.lint($)));

describe('when no <a> tag in HTML', () => {
  beforeAll(() => {
    input = `<body>
        <div>foo</div>
      </body>`;
  });

  it('should have no errors', () => expect(result.errors).toHaveLength(0));
});

describe('<a> tag without rel attribute', () => {
  beforeAll(() => {
    input = `<body>
        <a href='https://example.com'>foo</a>
      </body>`;
  });

  it('should have an error', () => expect(result.errors).toHaveLength(1));

  it('check message', () =>
    expect(result.errors[0]).toHaveProperty(
      'message',
      '<a> tag requires rel attribute'
    ));

  it('check element', () =>
    expect(result.errors[0]).toHaveProperty('element', $('a')[0]));
});

describe('<a> tag with rel attribute', () => {
  beforeAll(() => {
    input = `<body>
        <a href='https://example.com' rel='external'>foo</a>
      </body>`;
  });

  it('should have no errors', () => expect(result.errors).toHaveLength(0));
});

describe('multiple <a> tags', () => {
  beforeAll(() => {
    input = `<body>
        <a href='https://example.com'>foo</a>
        <a href='https://example.com' rel='external'>bar</a>
        <a href='https://example.com'>baz</a>
      </body>`;
  });

  it('should have two errors', () => expect(result.errors).toHaveLength(2));

  it('check first element', () =>
    expect(result.errors[0]).toHaveProperty('element', $('a')[0]));

  it('check second element', () =>
    expect(result.errors[1]).toHaveProperty('element', $('a')[2]));
});
