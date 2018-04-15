import { load } from 'cheerio';
import { LintResult } from '../../types';
import rule from '../head';

let input: string;
let $: CheerioStatic;
let result: LintResult;
let options: any;

beforeEach(() => ($ = load(input)));
beforeEach(() => (result = rule.lint($, options)));

describe('title', () => {
  beforeAll(() => {
    options = {
      meta: [],
      title: true
    };
  });

  describe('no <title> tag', () => {
    beforeAll(() => {
      input = `<head></head>`;
    });

    it('should have an error', () => expect(result.errors).toHaveLength(1));

    it('check message', () =>
      expect(result.errors[0]).toHaveProperty(
        'message',
        '<title> tag is required in <head>'
      ));

    it('check element', () =>
      expect(result.errors[0]).toHaveProperty('element', $('head')[0]));
  });

  describe('with <title> tag', () => {
    beforeAll(() => {
      input = `<head>
        <title>foo</title>
      </head>`;
    });

    it('should have no errors', () => expect(result.errors).toHaveLength(0));
  });
});

describe('meta', () => {
  beforeAll(() => {
    options = {
      meta: ['description', 'keywords'],
      title: false
    };
  });

  describe('no <meta> tag', () => {
    beforeAll(() => {
      input = `<head></head>`;
    });

    it('should have two errors', () => expect(result.errors).toHaveLength(2));

    it('check the first message', () =>
      expect(result.errors[0]).toHaveProperty(
        'message',
        `<meta name="description"> is required in <head>`
      ));

    it('check the first element', () =>
      expect(result.errors[0]).toHaveProperty('element', $('head')[0]));

    it('check the second message', () =>
      expect(result.errors[1]).toHaveProperty(
        'message',
        `<meta name="keywords"> is required in <head>`
      ));

    it('check the second element', () =>
      expect(result.errors[1]).toHaveProperty('element', $('head')[0]));
  });

  describe('with <meta> tag except keywords', () => {
    beforeAll(() => {
      input = `<head>
        <meta name="description">
        <meta name="author">
      </head>`;
    });

    it('should have an error', () => expect(result.errors).toHaveLength(1));
  });

  describe('with all <meta> tags', () => {
    beforeAll(() => {
      input = `<head>
        <meta name="description">
        <meta name="author">
        <meta name="keywords">
      </head>`;
    });

    it('should have no errors', () => expect(result.errors).toHaveLength(0));
  });
});
