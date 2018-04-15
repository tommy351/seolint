import { ValidationError } from 'ajv';
import { Readable } from 'stream';
import { Linter } from '../Linter';
import defaultRules from '../rules';
import { LintOptions, LintResult } from '../types';
import { getLocation } from '../utils/getLocation';

function fakeStream(input: string) {
  const stream = new Readable();
  stream.push(input);
  stream.push(null);
  return stream;
}

describe('constructor', () => {
  let linter: Linter;

  beforeEach(() => {
    linter = new Linter();
  });

  it('should define default rules', () => {
    expect(linter).toHaveProperty('rules', defaultRules);
  });
});

describe('lintString', () => {
  let linter: Linter;

  describe('when options are valid', () => {
    let input: string;
    let options: LintOptions;
    let result: LintResult;

    beforeEach(() => (linter = new Linter()));
    beforeEach(() => (result = linter.lintString(input, options)));

    describe('no errors', () => {
      beforeAll(() => {
        input = `<body></body>`;
      });

      beforeAll(() => {
        options = {
          rules: {
            'img-alt': true
          }
        };
      });

      it('should have no errors', () => expect(result.errors).toHaveLength(0));
    });

    describe('with errors', () => {
      beforeAll(() => {
        input = `<body>
          <img src="foo.jpg">
        </body>`;
      });

      beforeAll(() => {
        options = {
          rules: {
            'img-alt': true
          }
        };
      });

      it('should have an error', () => expect(result.errors).toHaveLength(1));

      it('should contain message', () =>
        expect(result.errors[0]).toHaveProperty('message'));

      it('should contain element', () =>
        expect(result.errors[0]).toHaveProperty('element'));

      it('should set rule name', () =>
        expect(result.errors[0]).toHaveProperty('name', 'img-alt'));

      it('should set location', () => {
        expect(result.errors[0]).toHaveProperty(
          'location',
          getLocation(result.errors[0].element)
        );
      });
    });

    describe('when rule is disabled', () => {
      beforeAll(() => {
        input = `<body>
          <img src="foo.jpg">
        </body>`;
      });

      beforeAll(() => {
        options = {
          rules: {
            'img-alt': false
          }
        };
      });

      it('should have no errors', () => expect(result.errors).toHaveLength(0));
    });

    describe('when rule options is given', () => {
      beforeAll(() => {
        input = `<body>
          <strong>foo</strong>
          <strong>bar</strong>
        </body>`;
      });

      beforeAll(() => {
        options = {
          rules: {
            'max-strong': [true, 1]
          }
        };
      });

      it('should have an error', () => expect(result.errors).toHaveLength(1));
    });
  });

  describe('when options are invalid', () => {
    it('should throw an error', () => {
      expect(() => {
        linter.lintString('', {} as any);
      }).toThrowError(ValidationError as any);
    });
  });
});

describe('lintFile', () => {
  //
});

describe('lintStream', () => {
  let linter: Linter;
  let input: string;
  let result: LintResult;

  beforeEach(() => (linter = new Linter()));

  beforeEach(async () => {
    const stream = fakeStream(input);
    result = await linter.lintStream(stream, {
      rules: {
        'img-alt': true
      }
    });
  });

  describe('with errors', () => {
    beforeAll(() => {
      input = `<body>
        <img src="foo.jpg">
      </body>`;
    });

    it('should have an error', () => expect(result.errors).toHaveLength(1));
  });
});

describe('getRule', () => {
  const mockRule = {
    lint: jest.fn()
  };
  let linter: Linter;

  beforeEach(() => {
    linter = new Linter();

    linter.defineRules({
      foo: mockRule
    });
  });

  it('should return rule if it exists', () => {
    expect(linter.getRule('foo')).toEqual(mockRule);
  });

  it('should return undefined if it does not exist', () => {
    expect(linter.getRule('bar')).toBeUndefined();
  });
});

describe('defineRules', () => {
  let linter: Linter;

  beforeEach(() => {
    linter = new Linter();
  });

  it('should set rule on the linter', () => {
    const mockRule = {
      lint: jest.fn()
    };

    linter.defineRules({
      foo: mockRule
    });

    expect(linter.getRule('foo')).toEqual(mockRule);
  });
});
