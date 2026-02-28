// utils-types.test.ts
import { describe, test, expect } from "vitest";
import type { FirstParamType, ReturnTypeInfer } from "@/utils/Utils.ts";
// utils-types.test.ts

interface User {
  id: number;
  name?: string;
  readonly role: string;
}

describe("TypeScript Utility Types", () => {
  test("Return type infer", () => {
    type sum = (a: number, b: number) => number;
    class People {
      name: ReturnTypeInfer<sum>;
      promise: Promise<ReturnTypeInfer<sum>>;
      age: FirstParamType<(a: number, b: number) => void>;
      constructor() {
        this.name = 1 + 2;
        this.promise = new Promise<ReturnTypeInfer<sum>>((resolve) =>
          resolve(this.promise),
        );
        this.age = 1;
      }

      run() {
        console.log(this.name);
      }
    }
    const people = new People();
    console.log(people);
  });

  test("Partial<T> makes all properties optional", () => {
    const partialUser: Partial<User> = {};
    expect(partialUser).toBeDefined();
  });

  test("Required<T> makes all properties required", () => {
    // const user: Required<User> = { id: 1, role: 'admin' }; // Should error if uncommented

    const user: Required<User> = { id: 1, name: "Alice", role: "admin" };
    expect(user).toBeDefined();
  });

  test("Readonly<T> makes properties readonly", () => {
    const user: Readonly<User> = { id: 1, name: "Bob", role: "user" };
    // user.id = 2; // TS error, cannot assign to readonly property
    expect(user.id).toBe(1);
  });

  test("Pick<T, K> selects subset properties", () => {
    type UserName = Pick<User, "name">;
    const userName: UserName = { name: "Alice" };
    expect(userName.name).toBe("Alice");
  });

  test("Record<K, T> creates type with specified keys and value type", () => {
    type Map = Record<"a" | "b", number>;
    const map: Map = { a: 1, b: 2 };
    expect(map.a).toBe(1);
  });

  test("Exclude<T, U> excludes types assignable to U from T", () => {
    type T = Exclude<"a" | "b" | "c", "a" | "b">;
    const value: T = "c";
    expect(value).toBe("c");
  });

  test("Extract<T, U> extracts types assignable to U from T", () => {
    type T = Extract<"a" | "b" | "c", "a" | "b">;
    const value: T = "a";
    expect(value).toBe("a");
  });

  test("Omit<T, K> omits specified keys from T", () => {
    type UserWithoutRole = Omit<User, "role">;
    const user: UserWithoutRole = { id: 1, name: "test" };
    expect(user.id).toBe(1);
  });

  test("NonNullable<T> removes null and undefined from T", () => {
    type T = NonNullable<string | null | undefined>;
    const value: T = "hello";
    expect(value).toBe("hello");
  });

  test("Parameters<T> extracts parameters of function type", () => {
    function fn(a: number, b: string): void {
      console.log(a, b);
    }
    type Params = Parameters<typeof fn>;
    const args: Params = [1, "x"];
    expect(args[0]).toBe(1);
  });
  test("ConstructorParameters<T> extracts parameters of constructor function", () => {
    class Person {
      constructor(
        public name: string,
        public age: number,
      ) {}
    }
    type Params = ConstructorParameters<typeof Person>;
    const args: Params = ["Alice", 25];
    expect(args[0]).toBe("Alice");
  });

  test("ReturnType<T> extracts return type of function", () => {
    function fn() {
      return 123;
    }
    type R = ReturnType<typeof fn>;
    const result: R = 123;
    expect(result).toBe(123);
  });
  test("InstanceType<T> extracts instance type of class constructor", () => {
    class Person {
      name: string;
      age: number;
      constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
      }
    }
    type Instance = InstanceType<typeof Person>;
    const person: Instance = new Person("Alice", 25);
    expect(person.name).toBe("Alice");
    expect(person.age).toBe(25);
  });

  test("Uppercase<T> converts string literal type to uppercase", () => {
    type T = Uppercase<"foo" | "bar">;
    const value: T = "FOO";
    expect(value).toBe("FOO");
  });

  test("Capitalize<T> converts first character of string literal type to uppercase", () => {
    type T = Capitalize<"foo" | "bar">;
    const value: T = "Foo";
    expect(value).toBe("Foo");
  });

  test("NoInfer<T> marks type as not inferred", () => {
    type T = NoInfer<string>;
    const value: T = "hello";
    expect(value).toBe("hello");
  });

  test("ThisType<T> allows to specify this type in a function", () => {
    function makeComponent<Data, Methods>(options: {
      data: () => Data;
      methods: Methods & ThisType<Data & Methods>;
    }) {
      return Object.assign({}, options.data(), options.methods);
    }

    const comp = makeComponent({
      data() {
        return {
          count: 0,
        };
      },
      methods: {
        increment() {
          this.count++; // ✅ this 被正确推断为 { count: number; increment: () => void }
        },
      },
    });
    comp.increment(); // ✅ 调用正确
    expect(comp.count).toBe(1);
  });
});
