import { load } from 'cheerio';
import { LintResult } from '../../types';
import rule from '../max-strong';

let input: string;
let $: CheerioStatic;
let result: LintResult;

function fakeInput(size: number) {
  let s = '<body>';

  for (let i = 0; i < size; i++) {
    s += `<strong>${i}</strong>`;
  }

  return s + '</body>';
}

beforeEach(() => ($ = load(input)));
beforeEach(() => (result = rule.lint($, 2)));

describe('when the number of <strong> tag is larger than the maximum', () => {
  beforeAll(() => (input = fakeInput(4)));

  it('should have an error', () => expect(result.errors).toHaveLength(2));

  it('check message', () =>
    expect(result.errors[0]).toHaveProperty(
      'message',
      'The number of <strong> tag must not larger than 2'
    ));

  it('check element', () => {
    for (let i = 0; i < result.errors.length; i++) {
      expect(result.errors[i]).toHaveProperty('element', $('strong')[i + 2]);
    }
  });
});

describe('when the number of <strong> tag equals to the maximum', () => {
  beforeAll(() => (input = fakeInput(2)));

  it('should have an error', () => expect(result.errors).toHaveLength(0));
});

describe('when no <strong> tag exists', () => {
  beforeAll(() => (input = fakeInput(0)));

  it('should have an error', () => expect(result.errors).toHaveLength(0));
});
