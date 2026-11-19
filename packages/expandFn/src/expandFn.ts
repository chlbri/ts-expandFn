import type { Fn, FnBasic, GetObject, OnlyFn, TypedArgs } from './types';

// #region Cooking
type _ExpandFn_F = <const Main extends Fn, const Tr extends object = object>(
  main: Main,
  extensions?: Tr,
) => FnBasic<Main, Tr>;

type _ExpandFnTyped_F = <const T extends Fn>(
  ...args: TypedArgs<T>
) => FnBasic<OnlyFn<T>, GetObject<T>>;

const _expandFn: _ExpandFn_F = (main, extensions) => {
  const out: any = main;
  if (extensions) Object.assign(out, extensions);
  return out;
};
// #endregion

export type ExpandFn_F = FnBasic<_ExpandFn_F, { readonly typed: _ExpandFnTyped_F }>;

export const expandFn: ExpandFn_F = _expandFn(_expandFn, {
  typed: _expandFn as _ExpandFnTyped_F,
});
