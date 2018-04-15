import { ValidateFunction } from 'ajv';
import { buildValidator } from '../buildValidator';

let validate: ValidateFunction;
let rules: any;
let input: any;
let valid: any;

beforeEach(() => (validate = buildValidator(rules)));
beforeEach(() => (valid = validate(input)));

describe('without schema', () => {
  beforeAll(() => {
    rules = {
      foo: {}
    };
  });

  describe('"rules" is undefined', () => {
    beforeAll(() => {
      input = {};
    });

    it('should failed', () => expect(valid).toBeFalsy());
  });

  describe('input is [boolean]', () => {
    beforeAll(() => {
      input = {
        rules: {
          foo: [false]
        }
      };
    });

    it('should passed', () => expect(valid).toBeTruthy());
  });

  describe('undefined key in rules', () => {
    beforeAll(() => {
      input = {
        rules: {
          bar: [false]
        }
      };
    });

    it('should failed', () => expect(valid).toBeFalsy());
  });

  describe('input is []', () => {
    beforeAll(() => {
      input = {
        rules: {
          foo: []
        }
      };
    });

    it('should failed', () => expect(valid).toBeFalsy());
  });
});

describe('with schema', () => {
  beforeAll(() => {
    rules = {
      foo: {
        schema: {
          default: 'foo',
          type: 'string'
        }
      }
    };
  });

  describe('input is [boolean]', () => {
    beforeAll(() => {
      input = {
        rules: {
          foo: [true]
        }
      };
    });

    it('should passed', () => expect(valid).toBeTruthy());

    it('should set default value', () =>
      expect(input.rules.foo).toEqual([true, 'foo']));
  });

  describe('input is [boolean, string]', () => {
    beforeAll(() => {
      input = {
        rules: {
          foo: [true, 'bar']
        }
      };
    });

    it('should passed', () => expect(valid).toBeTruthy());

    it('check value', () => expect(input.rules.foo).toEqual([true, 'bar']));
  });

  describe('input is [boolean, number]', () => {
    beforeAll(() => {
      input = {
        rules: {
          foo: [true, 42]
        }
      };
    });

    it('should failed', () => expect(valid).toBeFalsy());
  });
});
