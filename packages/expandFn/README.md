# @bemedev/expand-fn

Attach properties to a function without losing its signature.

<br/>

## Features

- Returns the original function reference, so parameters, return type and call
  context (`this`) are preserved
- Merges extensions into the function with `Object.assign`
- Keeps the existing own properties and lets extensions override them on conflict
- Types the merged extensions, or enforces an explicit signature with
  `expandFn.typed`
- No runtime dependency, no wrapper and no proxy

<br/>

## Installation

```bash
pnpm add @bemedev/expand-fn
```

```bash
npm install @bemedev/expand-fn
```

<br/>

## Usage

### expandFn

`expandFn(main, extensions?)` assigns `extensions` onto `main` and returns that
**same** function: `main` is mutated.

```ts
import { expandFn } from '@bemedev/expand-fn';

const add = (one: number, two: number) => one + two;
const double = (value: number) => value * 2;

const expanded = expandFn(add, { double });

expanded(1, 2); // 3
expanded.double(3); // 6
expanded === add; // true
```

Existing own properties are kept, and an extension that uses the same key overrides
them:

```ts
const versioned = Object.assign((one: number) => one, { version: 1 });
const result = expandFn(versioned, { version: 2 });

result.version; // 2
```

Because no wrapper is created, the call context is untouched:

```ts
const plus = function (this: { base: number }, value: number) {
  return this.base + value;
};

expandFn(plus).call({ base: 1 }, 2); // 3
```

### expandFn.typed

`expandFn.typed<T>(main)` reads the signature from `T` instead of inferring it from
the argument. The `extension` argument is required only when `T` declares own
properties:

```ts
type FnAddWithDouble = {
  (one: number, two: number): number;
  double: (value: number) => number;
};

const double = (value: number) => value * 2;

const add = Object.assign((one: number, two: number) => one + two, { double });

const typed = expandFn.typed<FnAddWithDouble>(add, { double });

typed(1, 2); // 3
typed.double(3); // 6
```

For a function without own properties, pass no extension:

```ts
type FnAdd = (one: number, two: number) => number;

const add = (one: number, two: number) => one + two;
const typed = expandFn.typed<FnAdd>(add);

typed(1, 2); // 3
```

<br/>

## API

### expandFn

```ts
type ExpandFn_F = {
  <const Main extends Fn, const Tr extends object = object>(
    main: Main,
    extensions?: Tr,
  ): Main & Tr;

  readonly typed: <const T extends Fn>(
    ...args: TypedArgs<T>
  ) => GetObject<T> & OnlyFn<T>;
};
```

### Exported types

| Type        | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| `Fn`        | Generic function type: `(...args: Args) => R`                  |
| `FnBasic`   | Intersection of an extension object and a function             |
| `OnlyFn`    | Call signature of a function, without its own properties       |
| `GetObject` | Object built from the own properties of a function type        |
| `TypedArgs` | Arguments of `expandFn.typed`: `[main]` or `[main, extension]` |
| `Equals`    | Compile-time equality check between two types                  |
| `EmptyO`    | Empty object type used by `TypedArgs`                          |

<br/>

## Licence

MIT

## CHANGE_LOG

Read [CHANGELOG.md](CHANGELOG.md) for more details about the changes.

<br/>

## Author

chlbri (bri_lvi@icloud.com)

[My github](https://github.com/chlbri?tab=repositories)

[<svg width="98" height="96" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#24292f"/></svg>](https://github.com/chlbri?tab=repositories)

<br/>

## Liens

- [Documentation](https://github.com/chlbri/ts-expandFn)
