import { expandFn } from '@bemedev/expand-fn';
import { createTests } from '@bemedev/dev-utils/vitest-extended';

type FnAdd = (one: number, two: number) => number;

type FnAddWithExponent = {
  (one: number, two: number): number;
  fnExponent: (one: number) => number;
};

describe('TESTS', () => {
  const createFnAdd = (): FnAdd => (one, two) => one + two;
  const fnDouble = (one: number) => one * 2;
  const fnExponent = (one: number) => Math.pow(one, one);
  const fnWithProps = Object.assign((one: number) => one * 2, { tag: 'double' });

  const createFnAddWithExponent = (): FnAddWithExponent =>
    Object.assign(createFnAdd(), { fnExponent });

  describe('#00 => Acceptations', () => {
    describe('#01 => expandFn', () => {
      const { acceptation } = createTests(expandFn);
      describe('#00 => Acceptation', acceptation);
    });

    describe('#02 => expandFn.typed', () => {
      const { acceptation } = createTests(expandFn.typed);
      describe('#00 => Acceptation', acceptation);
    });
  });

  describe('#01 => expandFn', () => {
    describe('#01 => without extensions', () => {
      const fn = createFnAdd();
      const result = expandFn(fn);

      test('#00 => fn has no own properties', () =>
        expect(Object.keys(fn)).toEqual([]));

      test('#01 => result is the given function', () => expect(result).toBe(fn));
      test('#02 => result is callable', () => expect(result(1, 2)).toBe(3));
      test('#03 => result keeps the arity', () => expect(result.length).toBe(2));

      test('#04 => result has no own properties', () =>
        expect(Object.keys(result)).toEqual([]));
    });

    describe('#02 => with extensions', () => {
      const fn = createFnAdd();
      const result = expandFn(fn, { fnExponent });

      test('#01 => result is the given function', () => expect(result).toBe(fn));
      test('#02 => result is callable', () => expect(result(4, 5)).toBe(9));

      test('#03 => result exposes the extension', () =>
        expect(result.fnExponent).toBe(fnExponent));

      test('#04 => extension is callable', () =>
        expect(result.fnExponent(3)).toBe(27));

      test('#05 => result lists the extension', () =>
        expect(Object.keys(result)).toEqual(['fnExponent']));

      test('#06 => fn is mutated with the extension', () =>
        expect(Object.keys(fn)).toEqual(['fnExponent']));
    });

    describe('#03 => with an existing property', () => {
      const fn = Object.assign(createFnAdd(), { version: 1 });
      const result = expandFn(fn, { fnExponent });

      test('#01 => keeps the existing property', () =>
        expect(result.version).toBe(1));

      test('#02 => adds the extension', () =>
        expect(result.fnExponent).toBe(fnExponent));

      test('#03 => lists both own properties', () =>
        expect(Object.keys(result)).toEqual(['version', 'fnExponent']));
    });

    describe('#04 => overriding an existing property', () => {
      const fn = Object.assign(createFnAdd(), { version: 1 });
      const result = expandFn(fn, { version: 2 });

      test('#01 => result is the given function', () => expect(result).toBe(fn));
      test('#02 => overrides the property', () => expect(result.version).toBe(2));
    });

    describe('#05 => preserving the call context', () => {
      const fn = function (this: { base: number }, value: number) {
        return this.base + value;
      };
      const result = expandFn(fn);

      test('#01 => uses the first context', () =>
        expect(result.call({ base: 1 }, 2)).toBe(3));

      test('#02 => uses another context', () =>
        expect(result.call({ base: 10 }, 2)).toBe(12));
    });
  });

  describe('#02 => expandFn.typed', () => {
    describe('#01 => without extensions', () => {
      const fn = createFnAdd();
      const result = expandFn.typed<FnAdd>(fn);

      test('#01 => result is the given function', () => expect(result).toBe(fn));
      test('#02 => result is callable', () => expect(result(1, 2)).toBe(3));

      test('#03 => result has no own properties', () =>
        expect(Object.keys(result)).toEqual([]));
    });

    describe('#02 => with extensions', () => {
      const fn = createFnAddWithExponent();
      const result = expandFn.typed<FnAddWithExponent>(fn, { fnExponent });

      test('#01 => result is the given function', () => expect(result).toBe(fn));
      test('#02 => result is callable', () => expect(result(4, 5)).toBe(9));

      test('#03 => result exposes the extension', () =>
        expect(result.fnExponent).toBe(fnExponent));

      test('#04 => extension is callable', () =>
        expect(result.fnExponent(3)).toBe(27));

      test('#05 => result lists the extension', () =>
        expect(Object.keys(result)).toEqual(['fnExponent']));

      test('#06 => fn is mutated with the extension', () =>
        expect(fn.fnExponent).toBe(fnExponent));
    });

    describe('#03 => overriding an existing extension', () => {
      const fn = createFnAddWithExponent();
      const result = expandFn.typed<FnAddWithExponent>(fn, { fnExponent: fnDouble });

      test('#01 => result is the given function', () => expect(result).toBe(fn));

      test('#02 => overrides the extension', () =>
        expect(result.fnExponent).toBe(fnDouble));

      test('#03 => keeps a single own property', () =>
        expect(Object.keys(result)).toEqual(['fnExponent']));
    });
  });

  describe('#03 => Types', () => {
    describe('#01 => expandFn', () => {
      const result = expandFn(createFnAdd());

      test('#01 => keeps the parameters', () => {
        expectTypeOf(result).parameters.toEqualTypeOf<[number, number]>();
      });

      test('#02 => keeps the return type', ({ annotate }) => {
        annotate('Gros minnet');
        expectTypeOf(result).returns.toEqualTypeOf<number>();
      });
    });

    describe('#02 => expandFn on a function with properties', () => {
      const result = expandFn(fnWithProps);

      test('#01 => keeps the parameters', () => {
        expectTypeOf(result).parameters.toEqualTypeOf<[number]>();
      });

      test('#02 => keeps the properties', () => {
        expectTypeOf(result.tag).toEqualTypeOf<string>();
      });
    });

    describe('#03 => expandFn with extensions', () => {
      const result = expandFn(createFnAdd(), { fnExponent });

      test('#01 => keeps the parameters', () => {
        expectTypeOf(result).parameters.toEqualTypeOf<[number, number]>();
      });

      test('#02 => types the extension', () => {
        expectTypeOf(result.fnExponent).toEqualTypeOf<typeof fnExponent>();
      });
    });

    describe('#04 => expandFn.typed on a pure function', () => {
      const result = expandFn.typed<FnAdd>(createFnAdd());

      test('#01 => keeps the parameters', () => {
        expectTypeOf(result).parameters.toEqualTypeOf<[number, number]>();
      });

      test('#02 => keeps the return type', () => {
        expectTypeOf(result).returns.toEqualTypeOf<number>();
      });

      test('#03 => has no properties', () => {
        expectTypeOf(result).not.toHaveProperty('tag');
      });
    });

    describe('#05 => expandFn.typed on a function with properties', () => {
      const result = expandFn.typed<FnAddWithExponent>(createFnAddWithExponent(), {
        fnExponent,
      });

      test('#01 => keeps the parameters', () => {
        expectTypeOf(result).parameters.toEqualTypeOf<[number, number]>();
      });

      test('#02 => keeps the return type', () => {
        expectTypeOf(result).returns.toEqualTypeOf<number>();
      });

      test('#03 => types the extension', () => {
        expectTypeOf(result.fnExponent).toEqualTypeOf<typeof fnExponent>();
      });
    });
  });
});
