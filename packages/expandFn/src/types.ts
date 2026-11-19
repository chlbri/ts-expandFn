export type Fn<Args extends any[] = any[], R = any> = (...args: Args) => R;

export type FnBasic<Main extends Fn, Tr extends object = object> = Tr & Main;

export type GetObject<T extends Fn> = { [K in keyof T]: T[K] };

// oxlint-disable-next-line typescript/no-empty-object-type
export type EmptyO = {};

export type Equals<T, U> = T extends U ? (U extends T ? true : false) : false;

export type OnlyFn<T extends Fn> = { (...args: Parameters<T>): ReturnType<T> };

export type TypedArgs<
  T extends Fn,
  G extends GetObject<T> = GetObject<T>,
  F extends OnlyFn<T> = OnlyFn<T>,
> = Equals<G, EmptyO> extends true ? [main: F] : [main: F, extension: G];
