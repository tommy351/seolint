import { Linter } from '../Linter';
import defaultRules from '../rules';

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
  //
});

describe('lintFile', () => {
  //
});

describe('lintStream', () => {
  //
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
