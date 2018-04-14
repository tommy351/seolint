import { getLocation } from '../getLocation';

it('should return undefined when input is undefined', () => {
  expect(getLocation(undefined)).toBeUndefined();
});

it('should return undefined if __location is undefined', () => {
  expect(getLocation({})).toBeUndefined();
});

it('should return location if __location exists', () => {
  expect(getLocation({ __location: 'foo' })).toEqual('foo');
});

it('should return location if __location.startTag exists', () => {
  expect(getLocation({ __location: { startTag: 'foo' } })).toEqual('foo');
});
