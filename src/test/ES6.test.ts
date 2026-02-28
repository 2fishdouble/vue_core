import {describe, test, expect} from "vitest";
import {plainToInstance} from "class-transformer";
import _ from "lodash";
import dayjs from "dayjs";
import validator from "validator";
import {v4 as uuidv4} from "uuid";
import {Snowflake} from "@/utils/SnowFlake.ts";
import {
    calculateFinalAmount,
    EnterpriseUserDiscountAdapter,
    EnterpriseUserDiscountBridge,
    type Order,
    UserType,
} from "@/strategy/DiscountStrategy.ts";
import {Singleton} from "@/strategy/Singleton.ts";
import axios from "axios";
import {sleep} from "@/utils/Utils.ts";
import {
    ModificationRestrictionCode, type ModificationRestrictionCodeType,
    ModificationRestrictionEnum, ModificationRestrictionRecord,
    ModificationRestrictionTitleMap, ModificationRestrictionTitleTupleArray
} from "@/enums/ModificationRestriction.ts";

describe("promise", () => {
    test("mr", () => {
        console.log(ModificationRestrictionCode.ADDRESS); // 0
        console.log(ModificationRestrictionCode.TIME); // 1
        console.log(ModificationRestrictionEnum[0]);
        ModificationRestrictionTitleMap.forEach((value, key) => {
            console.log(key, value);
        });
        console.log(ModificationRestrictionTitleTupleArray[0]);
        console.log(ModificationRestrictionRecord["0"]);

        // ?? ?
        console.log(ModificationRestrictionRecord["0"]?.[1] ?? "默认值")
        // !
        console.log(ModificationRestrictionRecord["0"]![2])
        const type1: ModificationRestrictionCodeType = ModificationRestrictionEnum[0].title
        const type2: ModificationRestrictionCodeType = ModificationRestrictionEnum[1].title
        console.log(typeof type1, typeof type2) // string string
        console.log(type1, type2) // 地址 时间
    })


    test("withResolvers", async () => {
        const a = null as any;
        const b = undefined as any;
        try {
            a!.toFixed(2);
        } catch (e) {
            console.log(e); // TypeError: Cannot read properties of null (reading 'toFixed')
        }
        b?.toFixed(2);
        // version conflict
        // const {promise, resolve, reject} = Promise.withResolvers<string>();
        await sleep(1000);
    });

    test("any", async () => {
        const p1 = Promise.reject("失败1");
        const p2 = Promise.resolve("成功");
        const p3 = Promise.resolve("另一个成功");

        Promise.any([p1, p2, p3]).then((value) => {
            console.log("第一个成功:", value); // 输出：第一个成功: 成功
        });
        await sleep(1000);
    });

    test("allSettled", async () => {
        const p1 = Promise.resolve("成功");
        const p2 = Promise.reject("失败");

        Promise.allSettled([p1, p2]).then((results) => {
            console.log(results);
        });
        await sleep(1000);
    });
    test("race", async () => {
        const slow = new Promise((resolve) =>
            setTimeout(() => resolve("慢"), 1000),
        );
        const fast = new Promise((resolve) => setTimeout(() => resolve("快"), 100));

        Promise.race([slow, fast]).then((res) => {
            console.log("最快完成的是:", res); // 输出：最快完成的是: 快
        });

        const fail = new Promise((_, reject) =>
            setTimeout(() => reject("失败"), 50),
        );

        Promise.race([fail, slow]).catch((err) => {
            console.error("最快失败的是:", err); // 输出：最快失败的是: 失败
        });
        await sleep(2000);
    });

    test("all", async () => {
        const p1 = Promise.resolve(1);
        const p2 = Promise.resolve(2);
        const p3 = Promise.resolve(3);

        const [result1, result2, result3] = await Promise.all([p1, p2, p3]);

        console.log(result1, result2, result3); // 1 2 3
        await sleep(1000);
    });

    test("reject", async () => {
        const p = Promise.reject("Error");

        p.catch((reason) => {
            console.log("失败:", reason);
        });

        await sleep(1000);
    });

    test("resolve", async () => {
        const p = Promise.resolve("OK");

        p.then((value) => {
            console.log("成功:", value);
        });

        await sleep(1000);
    });

    test("best practice", async () => {
        const promise = axios.get(
            "https://dog.ceo/api/breed/pembroke/images/random",
        );

        const result = await promise;
        console.log(result.data);
        await sleep(3000);
    });

    test("usually", async () => {
        const promise = axios.get(
            "https://dog.ceo/api/breed/pembroke/images/random",
        );

        promise
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error("请求失败:", error);
            })
            .finally(() => {
                console.log("请求完成");
            });

        const promise1 = new Promise((resolve, reject) => {
            axios
                .get("https://dog.ceo/api/breed/pembroke/images/random")
                .then((res: any) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        }).finally(() => {
            console.log("请求完成");
        });

        promise1
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.error("请求失败:", err);
            })
            .finally(() => {
                console.log("请求完成");
            });

        await sleep(3000);
    });
});

describe("util", () => {
    test("revocable", () => {
        const target = {message: "Hello, world!"};

        const handler: ProxyHandler<typeof target> = {
            get(target, prop, receiver) {
                console.log(`访问属性: ${String(prop)}`);
                return Reflect.get(target, prop, receiver);
            },
        };

        const {proxy, revoke} = Proxy.revocable(target, handler);

        console.log(proxy.message); // 访问属性: message  输出: Hello, world!

        revoke();

        try {
            console.log(proxy.message); // 访问失败，抛异常
        } catch (e) {
            console.error("代理已撤销，访问失败:", e);
        }
    });
    test("lodash", () => {
        const even = _.filter([1, 2, 3, 4, 5, 6], (n: number) => n % 2 === 0);
        console.log(even); // [2, 4, 6]
    });

    test("dayjs", () => {
        const now = dayjs();
        console.log(now.format("YYYY-MM-DD HH:mm:ss"));
        console.log(now.add(1, "day"));
    });

    test("validator", () => {
        console.log(validator.isEmail("test@test.com")); // true
        console.log(validator.isMobilePhone("13812345678")); // true
    });

    test("uuid", () => {
        console.log(uuidv4());
        console.log(Snowflake.nextId());
        const orders: Order[] = [
            {userType: UserType.NORMAL, amount: 100},
            {userType: UserType.VIP, amount: 200},
            {userType: UserType.ENTERPRISE, amount: 15000},
        ];

        for (const order of orders) {
            console.log("===================");
            calculateFinalAmount(order);
            console.log("===================");
        }
        const adapter = new EnterpriseUserDiscountAdapter(
            new EnterpriseUserDiscountBridge(),
        );
        adapter.calculateDiscount({userType: UserType.NORMAL, amount: 15000});

        console.log(Singleton.getInstance());
    });
});

describe("es6", () => {
    test("__proto__", () => {
        console.log(typeof function () {
        }); // "function"

        const add = new Function("a", "b", "return a + b");
        console.log(add(2, 3)); // 5

        // 类得到本质也是函数
        // 函数上面有原型对象
        // 对象上面有__proto__属性指向原型对象
        class Foo {
        }

        // function Foo() {
        // }
        console.log(Foo.prototype); // {}
        const foo = new Foo();
        console.log(typeof Foo); //  function
        console.log(Foo.prototype === Object.getPrototypeOf(foo)); // true  对象foo的__proto__指向Foo.prototype

        // prototype 也是一个对象 , 对象就有__proto__属性
        console.log(Object.getPrototypeOf(Foo.prototype)); // [Object: null prototype] {}
        console.log(Object.getPrototypeOf(Foo.prototype) === Object.prototype); // true
        console.log(Object.getPrototypeOf(Object.getPrototypeOf(Foo.prototype))); // null

        // 类本质上是函数,为什么可以调用 bar.call() ...
        function bar() {
        }

        console.log(Object.getPrototypeOf(bar) === Function.prototype); // true
    });

    test("This chapter describes the most important features of ES6.", () => {
        interface AnimalConstructor {
            new(name: string): Animal;

            prototype: Animal;
        }

        interface Animal {
            name: string;

            speak(): void;
        }

        const Dog: AnimalConstructor = class DogImpl implements Animal {
            constructor(public name: string) {
            }

            speak() {
                console.log(`${this.name} barks.`);
            }
        };

        const dog = new Dog("旺财");
        dog.speak(); // 旺财 barks.
    });
});

// proxy.test.js
describe("Proxy ES2015 behavior", () => {
    test("date", () => {
        const date = new Date("2020-05-01 00:00:00");
        const dateStr = Date.parse("2020-05-01 00:00:00");
        console.log(date);
        console.log(dateStr);
        console.log(Date.now());

        class Person {
            name?: string;
            age?: number;
            city?: string;
        }

        const person = plainToInstance(
            Person,
            JSON.parse('{"name":"John", "age":30, "city":"New York"}'),
        );
        console.log(person);

        const obj = JSON.parse('{"name":"John", "age":30, "city":"New York"}');
        console.log(obj);
        const myJSON = JSON.stringify({name: "John", age: 30, city: "New York"});
        console.log(myJSON);

        type Emits = {
            (e: "submit", value: string): void;
            (e: "cancel"): void;
        };

        const mockEmit: Emits = (event: string, ...args: any[]) => {
            console.log("emit", event, ...args);
        };

        mockEmit("submit", "data"); // ✅
        mockEmit("cancel"); // ✅
    });

    test("this", () => {
        function sayHello(this: any, greeting: string) {
            console.log(`${greeting}, my name is ${this.name}`);
        }

        const person = {name: "Alice"};
        sayHello.call(person, "Hello");
        sayHello.apply(person, ["Hi"]);

        const boundHello = sayHello.bind(person, "Hey");
        boundHello();

        const alice = {
            name: "Alice",
            sayHello: function () {
                console.log("function this:", this.name);
            },
            sayHelloArrow: () => {
                // console.log('arrow this:', this.name); // undefined
                // 箭头函数中的 this 不可修改
            },
        };

        alice.sayHello(); // Alice（this 指向 person）
        alice.sayHelloArrow(); // undefined（this 指向 window / global）
    });

    test("proto_type_chain", () => {
        class Animal {
            name: string;

            constructor(name: string) {
                this.name = name;
            }

            sayHello(): void {
                console.log(`Hello, I'm ${this.name}`);
            }
        }

        class Dog extends Animal {
            breed: string;

            constructor(name: string, breed: string) {
                super(name);
                this.breed = breed;
            }

            bark(): void {
                console.log("Woof! Woof!");
            }
        }

        const husky = new Dog("Lucky", "Husky");

        husky.sayHello(); // Hello, I'm Lucky
        husky.bark(); // Woof! Woof!

        console.log(Dog.prototype.isPrototypeOf(husky)); // true
        console.log(Animal.prototype.isPrototypeOf(husky)); // true

        console.log(husky.sayHello === Dog.prototype.sayHello); // true
        console.log(husky.hasOwnProperty("sayHello")); // false
        console.log(husky.hasOwnProperty("name")); // true
    });

    test("create_promise", () => {
        function createPromise(promiseCtor: PromiseConstructor): Promise<string> {
            return new promiseCtor((resolve) => {
                setTimeout(() => {
                    resolve("Hello from PromiseConstructor!");
                }, 1000);
            });
        }

        createPromise(Promise).then(console.log);
    });

    test("should intercept property access using get trap", () => {
        const target = {message: "hello"};
        const handler = {
            get: (obj: any, prop: any) => {
                if (prop === "message") return obj[prop].toUpperCase();
                return Reflect.get(obj, prop);
            },
        };
        const proxy = new Proxy(target, handler);
        expect(proxy.message).toBe("HELLO");
    });

    test("should intercept property setting using set trap", () => {
        const target = {};
        const handler = {
            set: (obj: any, prop: any, value: any) => {
                obj[prop] = value + " world";
                return true;
            },
        };
        const proxy = new Proxy(target, handler);
        proxy.greeting = "hello";
        expect(proxy.greeting).toBe("hello world");
    });

    test("should be instance of ProxyConstructor", () => {
        const target = {};
        const handler = {};
        expect(typeof Proxy).toBe("function"); // ProxyConstructor
        expect(() => new Proxy(target, handler)).not.toThrow();
    });

    test("should reflect original behavior when handler is empty", () => {
        const target = {foo: "bar"};
        const proxy = new Proxy(target, {});
        expect(proxy.foo).toBe("bar");
    });

    test("interface proxy", () => {
        // 定义一个接口
        interface IUser {
            name: string;
            age: number;

            greet(): string;
        }

        abstract class AbstractUser implements IUser {
            name: string;
            age: number;

            protected constructor(name: string, age: number) {
                this.name = name;
                this.age = age;
            }

            abstract greet(): string; // 子类实现
        }

        // 实现该接口的类
        class User implements IUser {
            constructor(
                public name: string,
                public age: number,
            ) {
            }

            greet(): string {
                return `Hello, my name is ${this.name}`;
            }
        }

        // 定义一个 Proxy handler
        const handler: ProxyHandler<IUser> = {
            get(target, prop, receiver) {
                if (prop === "greet") {
                    return () => `[Proxy]: ${target.greet()}`;
                }
                return Reflect.get(target, prop, receiver);
            },
            set(target, prop, value, receiver) {
                if (prop === "age" && typeof value === "number" && value < 0) {
                    throw new Error("Age must be non-negative");
                }
                return Reflect.set(target, prop, value, receiver);
            },
        };

        // 使用 ProxyConstructor 创建代理实例
        const user = new User("Alice", 30);
        const proxyUser = new Proxy<IUser>(user, handler);

        // 使用
        console.log(proxyUser.greet()); // 输出：[Proxy]: Hello, my name is Alice
        proxyUser.age = 25;
        console.log(proxyUser.age); // 输出：25

        // proxyUser.age = -5; // 会抛出错误
    });
});
