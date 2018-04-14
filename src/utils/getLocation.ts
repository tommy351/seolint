import { Location } from '../types';

export function getLocation(elem: any): Location | undefined {
  if (!elem) {
    return;
  }

  const { __location: loc } = elem;

  if (!loc) {
    return;
  }

  return loc.startTag || loc;
}
