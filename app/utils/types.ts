import type { JsonifyObject } from "type-fest/source/jsonify";

export interface Pagination {
  limit?: MaxInt<50>;
  offset?: number;
}

export type MaxInt<T extends number> = number extends T
  ? number
  : _Range<T, []>;

export type _Range<
  T extends number,
  R extends unknown[]
> = R["length"] extends T ? R[number] : _Range<T, [R["length"], ...R]>;

export type MaybeJsonified<T extends object> = T | JsonifyObject<T>;
