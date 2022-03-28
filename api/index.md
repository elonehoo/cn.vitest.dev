# API 参考

下面的变量中使用了以下类型

```ts
type DoneCallback = (error?: any) => void
type Awaitable<T> = T | PromiseLike<T>
type TestFunction = () => Awaitable<void> | (done: DoneCallback) => void
```

当一个测试函数返回一个 promise 时，Vitest 将等待直到它被解决以收集异步的期望值。 如果 promise 被拒绝，测试将失败。

为了兼容 Jest 的用法, `TestFunction` 也可以是 `(done: DoneCallback) => void` 类型。 如果使用这种形式, 则 `done` 在调用之前不会结束测试（无参数或参数为假值表示测试通过，而真值或错误值作为参数则测试不通过）。 我们不建议使用这种形式，因为你可以使用 `async` 函数实现相同的目的。

## test

- **类型:** `(name: string, fn: TestFunction, timeout?: number) => void`
- **别名:** `it`

  `test` 定义了一组关于测试期望的方法。它接收测试名称和一个含有测试期望的函数。

  同时，你也可以提供一个超时时限（以毫秒为单位）用于指定等待多长时间后终止测试，默认为 5 秒。也可以通过 [testTimeout](/config/#testtimeout) 选项进行全局配置。

  ```ts
  import { test, expect } from 'vitest'

  test('should work as expected', () => {
    expect(Math.sqrt(4)).toBe(2);
  })
  ```

### test.skip

- **类型:** `(name: string, fn: TestFunction, timeout?: number) => void`
- **别名:** `it.skip`

  如果你想跳过运行某些测试，但由于一些原因不想删除代码，你可以使用 `test.skip` 来避免运行它们。

  ```ts
  import { test, assert } from 'vitest'

  test.skip("skipped test", () => {
    // 跳过测试，没有错误
    assert.equal(Math.sqrt(4), 3);
  });
  ```

### test.only

- **类型:** `(name: string, fn: TestFunction, timeout?: number) => void`
- **别名:** `it.only`

  使用 `test.only` 可以仅在给定测试套件中运行某些测试。这在调试时会非常有用。

  同时，你也可以提供一个超时时限（以毫秒为单位）用于指定等待多长时间后终止测试，默认为 5 秒。也可以通过 [testTimeout](/config/#testtimeout) 选项进行全局配置。

  ```ts
  import { test, assert } from 'vitest'

  test.only("test", () => {
    // 仅运行此测试（以及仅标记有的其他测试）
    assert.equal(Math.sqrt(4), 2);
  });
  ```

### test.concurrent

- **类型:** `(name: string, fn: TestFunction, timeout?: number) => void`
- **别名:** `it.concurrent`

  `test.concurrent` 会将连续的多个测试并发运行。它将接收测试名称、带有要收集测试的异步函数以及可选的超时参数（以毫秒为单位）。

  ```ts
  import { describe, test } from 'vitest'

  // 标有并发的两个测试将并发运行
  describe("suite", () => {
    test("serial test", async() => { /* ... */ });
    test.concurrent("concurrent test 1", async() => { /* ... */ });
    test.concurrent("concurrent test 2", async() => { /* ... */ });
  });
  ```

  `test.skip`，`test.only` 和 `test.todo` 都适用于并发测试。以下所有组合均有效：

  ```ts
  test.concurrent(...)
  test.skip.concurrent(...), test.concurrent.skip(...)
  test.only.concurrent(...), test.concurrent.only(...)
  test.todo.concurrent(...), test.concurrent.todo(...)
  ```

### test.todo

- **类型:** `(name: string) => void`
- **别名:** `it.todo`

  使用 `test.todo` 将稍后实现的测试进行存档。测试报告中将显示一个记录，以便你知道还多少条未实现的测试。

  ```ts
  // 测试的报告中将显示一个记录
  test.todo("unimplemented test");
  ```

### test.fails

- **类型:** `(name: string, fn: TestFunction, timeout?: number) => void`
- **别名:** `it.fails`

  使用 `test.fails` 表示断言将显式失败。

  ```ts
  import { expect, test } from 'vitest'
  const myAsyncFunc = () => new Promise((resolve) => resolve(1))
  test.fails("fail test", () => {
    expect(myAsyncFunc()).rejects.toBe(1)
  })
  ```

### test.each
- **类型:** `(cases: ReadonlyArray<T>) => void`
- **别名:** `it.each`

  当你需要使用不同的变量运行相同的测试时，可以使用 `test.each`。

  你可以按照测试参数的顺序，在测试名称插入符合[printf格式](https://nodejs.org/api/util.html#util_util_format_format_args)的参数。

  - `%s`：字符串
  - `%d`：数值
  - `%i`：整数
  - `%f`：小数
  - `%j`：json格式
  - `$o`：对象
  - `%#`：对应的测试参数下标
  - `%%`：单个百分比符号 ('%')

  ```ts
  test.each([
    [1, 1, 2],
    [1, 2, 3],
    [2, 1, 3],
  ])('add(%i, %i) -> %i', (a, b, expected) => {
    expect(a + b).toBe(expected)
  })
  // this will return
  // √ add(1, 1) -> 2
  // √ add(1, 2) -> 3
  // √ add(2, 1) -> 3
  ```

## describe

当你在文件的顶层使用 `test` 时，它们将作为隐式测试套件的一部分被收集。你可以使用 `describe` 在当前上下文中定义一个新的测试套件，将其看作一组相关测试或者有别于其它的嵌套测试套件。测试套件可让你组织你的测试用例，使报告更清晰。

  ```ts
  import { describe, expect, test } from 'vitest'

  const person = {
    isActive: true,
    age: 32,
  };

  describe('person', () => {
    test('person is defined', () => {
      expect(person).toBeDefined()
    });

    test('is active', () => {
      expect(person.isActive).toBeTruthy();
    });

    test('age limit', () => {
      expect(person.age).toBeLessThanOrEqual(32);
    });
  });
  ```

  如果你需要有测试层次结构，你还可以嵌套描述块：

  ```ts
  import { describe, test, expect } from 'vitest'

  const numberToCurrency = (value) => {
    if (typeof value !== 'number') {
        throw new Error(`Value must be a number`);
    }

    return value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  describe('numberToCurrency', () => {
    describe('given an invalid number', () => {
      test('composed of non-numbers to throw error', () => {
        expect(() => numberToCurrency('abc')).toThrow();
      });
    });

    describe('given a valid number', () => {
      test('returns the correct currency format', () => {
        expect(numberToCurrency(10000)).toBe('10,000.00');
      });
    });
  });
  ```

### describe.skip

- **类型:** `(name: string, fn: TestFunction) => void`

  在测试套件中使用 `describe.skip` 避免运行特定的描述块。

  ```ts
  import { assert, describe, test } from 'vitest'

  describe.skip("skipped suite", () => {
    test("sqrt", () => {
      // 跳过测试套件，不会有错误
      assert.equal(Math.sqrt(4), 3);
    });
  });
  ```

### describe.only

- **类型:** `(name: string, fn: TestFunction) => void`

  使用 `describe.only` 仅运行指定的测试套件。

  ```ts
  // 仅运行此测试套件（以及仅标有的其他测试套件）
  describe.only("suite", () => {
    test("sqrt", () => {
      assert.equal(Math.sqrt(4), 3);
    });
  });

  describe('other suite', () => {
    // ... 这里的测试套件将会被跳过
  });
  ```

### describe.concurrent

- **类型:** `(name: string, fn: TestFunction, timeout?: number) => void`

  使用 `describe.concurrent` 在测试套件中将每个测试标记为并发。

  ```ts
  // 该测试套件中的所有测试都将并行运行
  describe.concurrent("suite", () => {
    test("concurrent test 1", async() => { /* ... */ });
    test("concurrent test 2", async() => { /* ... */ });
    test.concurrent("concurrent test 3", async() => { /* ... */ });
  });
  ```

  `.skip`，`.only` 和 `.todo` 可以与并发测试套件一起使用。 以下所有组合均有效：

  ```ts
  describe.concurrent(...)
  describe.skip.concurrent(...), describe.concurrent.skip(...)
  describe.only.concurrent(...), describe.concurrent.only(...)
  describe.todo.concurrent(...), describe.concurrent.todo(...)
  ```

### describe.todo

- **类型:** `(name: string) => void`

  使用 `describe.todo` 将稍后实现的测试套件进行存档。测试报告中将显示一个记录，以便你知道还多少条未实现的测试。

  ```ts
  // 测试套件的报告中将显示一个记录
  describe.todo("unimplemented suite");
  ```

### describe.each

- **类型:** `(cases: ReadonlyArray<T>): (name: string, fn: (...args: T[]) => void) => void`

  如果你有多个测试依赖相同的数据，可以使用 `describe.each`。

  ```ts
  describe.each([
    { a: 1, b: 1, expected: 2 },
    { a: 1, b: 2, expected: 3 },
    { a: 2, b: 1, expected: 3 },
  ])('describe object add(%i, %i)', ({ a, b, expected }) => {
    test(`returns ${expected}`, () => {
      expect(a + b).toBe(expected)
    })
    test(`returned value not be greater than ${expected}`, () => {
      expect(a + b).not.toBeGreaterThan(expected)
    })
    test(`returned value not be less than ${expected}`, () => {
      expect(a + b).not.toBeLessThan(expected)
    })
  })
  ```

## expect

- **类型:** `ExpectStatic & (actual: any) => Assertions`

  `expect` 用来创建断言。在当前上下文中，可以使用 `assertions` 方法来断言一个语句。 Vitest 默认提供 `chai` 进行断言，同时基于 `chai` 实现兼容 `Jest` 的断言语句。

  例如，这里会断言 `input` 的值是否等于 `2` ，如果它们不相等，断言则会抛出错误，并且测试失败。

  ```ts
  import { expect } from 'vitest'

  const input = Math.sqrt(4)

  expect(input).to.equal(2) // chai API
  expect(input).toBe(2) // jest API
  ```

  从技术上来说，这里并没有使用 [`test`](#test) 方法，所以我们在控制台会看到 Nodejs 的报错，而不是 Vitest 的报错。想要了解更多关于 `test` 的信息，请参阅 [test 章节](#test)。

  此外，`expect` 可用于静态访问匹配器功能，这个后面会介绍。

### not

  使用 `not` 将会否定断言。举例，此代码断言 `input` 的值不等于 `2`。如果它们相等，断言则会抛出错误，并且测试失败。

  ```ts
  import { expect, test } from 'vitest'

  const input = Math.sqrt(16)

  expect(input).not.to.equal(2) // chai API
  expect(input).not.toBe(2) // jest API
  ```

### toBe

- **类型:** `(value: any) => Awaitable<void>`

  `toBe` 可用于断言基础对象是否相等，或者对象是否共享相同的引用。它相当于调用了 `expect(Object.is(3, 3)).toBe(true)`。 如果对象不相同，但你想检查它们的结构是否相同，则可以使用 [`toEqual`](#toequal)。

  例如，下面的测试将会检查 stock 是否有13个苹果。

  ```ts
  import { test, expect } from 'vitest'

  const stock = {
    type: 'apples',
    count: 13
  }

  test('stock has 13 apples', () => {
    expect(stock.type).toBe('apples')
    expect(stock.count).toBe(13)
  })

  test('stocks are the same', () => {
    const refStock = stock // 相同的引用

    expect(stock).toBe(refStock)
  })
  ```

  尽量不要将 `toBe` 与浮点数一起使用。由于 JavaScript 会对它们进行四舍五入，例如 `0.1 + 0.2` 的结果严格来说并不是 `0.3` 。如果需要可靠地断言浮点数，请使用 `toBeCloseTo` 进行断言。

### toBeCloseTo

- **类型:** `(value: number, numDigits?: number) => Awaitable<void>`

  使用 `toBeCloseTo` 进行浮点数的比较。可以选择使用 `numDigits` 参数限制小数点后的检查位数。例如：

  ```ts
  import { test, expect } from 'vitest'

  test.fails('decimals are not equal in javascript', () => {
    expect(0.2 + 0.1).toBe(0.3); // 0.2 + 0.1 = 0.30000000000000004
  });

  test('decimals are rounded to 5 after the point', () => {
    // 0.2 + 0.1 = 0.30000 | 移除了 "000000000004"
    expect(0.2 + 0.1).toBeCloseTo(0.3, 5);
     // 0.30000000000000004 中的任何内容都不会被删除
    expect(0.2 + 0.1).not.toBeCloseTo(0.3, 50);
  });
  ```

### toBeDefined

- **类型:** `() => Awaitable<void>`

  `toBeDefined` 断言检查值是否不等于 `undefined` 。在检查函数是否有返回值时非常有用。

  ```ts
  import { test, expect } from 'vitest'

  const getApples = () => 3

  test('function returned something', () => {
    expect(getApples()).toBeDefined()
  })
  ```

### toBeUndefined

- **类型:** `() => Awaitable<void>`

  与 `toBeDefined` 相反，`toBeUndefined` 断言检查值是否等于 `undefined` 。在检查函数是否没有返回任何内容时非常有用。

  ```ts
  import { test, expect } from 'vitest'

  function getApplesFromStock(stock) {
    if(stock === 'Bill') return 13
  }

  test('mary doesn\'t have a stock', () => {
    expect(getApplesFromStock('Mary')).toBeUndefined()
  })
  ```

### toBeTruthy

- **类型:** `() => Awaitable<void>`

  `toBeTruthy` 会将检查值转换为布尔值，断言该值是否为 `true` 。该方法在当你不关心检查值的内容，而只想知道它是否可以转换为 `true` 时很有用。

  例如下面这段代码，我们就不需要关心 `stocks.getInfo` 的返回值，可能是复杂的对象、字符串或者是其他内容，代码仍然可以运行。

  ```ts
  import { Stocks } from './stocks'
  const stocks = new Stocks()
  stocks.sync('Bill')
  if(stocks.getInfo('Bill')) {
    stocks.sell('apples', 'Bill')
  }
  ```

  所以如果我们想测试 `stocks.getInfo` 是否为 true，我们可以这样写：

  ```ts
  import { test, expect } from 'vitest'
  import { Stocks } from './stocks'
  const stocks = new Stocks()

  test('if we know Bill stock, sell apples to him', () => {
    stocks.sync('Bill')
    expect(stocks.getInfo('Bill')).toBeTruthy()
  })
  ```

  JavaScript 中除了 `false` ，`0` ，`''` ，`null` ，`undefined` 和 `NaN`，其他一切都是为真。

### toBeFalsy

- **类型:** `() => Awaitable<void>`

  `toBeFalsy` 会将检测值转换为布尔值，断言该值是否为 `false`。该方法在当你不关心该检查值的内容，但只想知道它是否可以转换为 `false` 时很有用。

  例如下面这段代码，我们就不需要关心 `stocks.stockFailed` 的返回值，可能是复杂的对象、字符串或者是其他内容，代码仍然可以运行。

  ```ts
  import { Stocks } from './stocks'
  const stocks = new Stocks()
  stocks.sync('Bill')
  if(!stocks.stockFailed('Bill')) {
    stocks.sell('apples', 'Bill')
  }
  ```

  所以如果我们想测试 `stocks.stockFailed` 是否为 false，我们可以这样写：

  ```ts
  import { test, expect } from 'vitest'
  import { Stocks } from './stocks'
  const stocks = new Stocks()

  test('if Bill stock hasnt failed, sell apples to him', () => {
    stocks.syncStocks('Bill')
    expect(stocks.stockFailed('Bill')).toBeFalsy()
  })
  ```

  JavaScript 中除了 `false` ，`0` ，`''` ，`null` ，`undefined` 和 `NaN`，其他一切都是为真。

### toBeNull

- **类型:** `() => Awaitable<void>`

  `toBeNull` 将简单地断言检查值是否为 `null`。 是 `.toBe(null)` 的别名。

  ```ts
  import { test, expect } from 'vitest'

  function apples() {
    return null
  }

  test('we dont have apples', () => {
    expect(apples()).toBeNull()
  })
  ```

### toBeNaN

- **类型:** `() => Awaitable<void>`

  `toBeNaN` 将简单地断言是否为 `NaN`。 是 `.toBe(NaN)` 的别名，

  ```ts
  import { test, expect } from 'vitest'

  let i = 0

  function getApplesCount() {
    i++
    return i > 1 ? NaN : i
  }

  test('getApplesCount has some unusual side effects...', () => {
    expect(getApplesCount()).not.toBeNaN()
    expect(getApplesCount()).toBeNaN()
  })
  ```

### toBeTypeOf

- **类型:** `(c: 'bigint' | 'boolean' | 'function' | 'number' | 'object' | 'string' | 'symbol' | 'undefined') => Awaitable<void>`

  `toBeTypeOf` 用于断言检查值是否属于接收的类型。

  ```ts
  import { test, expect } from 'vitest'
  const actual = 'stock'
  test('stock is type of string', () => {
    expect(actual).toBeTypeOf('string')
  })
  ```

### toBeInstanceOf

- **类型:** `(c: any) => Awaitable<void>`

  `toBeInstanceOf` 用于断言检查值是否为接收的类的实例。

  ```ts
  import { test, expect } from 'vitest'
  import { Stocks } from './stocks'
  const stocks = new Stocks()

  test('stocks are instance of Stocks', () => {
    expect(stocks).toBeInstanceOf(Stocks)
  })
  ```

### toBeGreaterThan

- **类型:** `(n: number) => Awaitable<void>`

  `toBeGreaterThan` 用于断言检查值是否大于接收值，如果相等将无法通过测试。

  ```ts
  import { test, expect } from 'vitest'
  import { getApples } from './stock'

  test('have more then 10 apples', () => {
    expect(getApples()).toBeGreaterThan(10)
  })
  ```

### toBeGreaterThanOrEqual

- **类型:** `(n: number) => Awaitable<void>`

  `toBeGreaterThanOrEqual` 用于断言检查值是否大于等于接收值。

  ```ts
  import { test, expect } from 'vitest'
  import { getApples } from './stock'

  test('have 11 apples or more', () => {
    expect(getApples()).toBeGreaterThanOrEqual(11)
  })
  ```

### toBeLessThan

- **类型:** `(n: number) => Awaitable<void>`

  `toBeLessThan` 用于断言检查值是否小于接收值，如果相等将无法通过测试。

  ```ts
  import { test, expect } from 'vitest'
  import { getApples } from './stock'

  test('have less then 20 apples', () => {
    expect(getApples()).toBeLessThan(20)
  })
  ```

### toBeLessThanOrEqual

- **类型:** `(n: number) => Awaitable<void>`

  `toBeLessThanOrEqual` 用于断言检查值是否小于等于接收值。

  ```ts
  import { test, expect } from 'vitest'
  import { getApples } from './stock'

  test('have 11 apples or less', () => {
    expect(getApples()).toBeLessThanOrEqual(11)
  })
  ```

### toEqual

- **类型:** `(received: any) => Awaitable<void>`

  `toEqual` 断言检查值是否等于接收值，或者是同样的结构，如果是对象类型（将会使用递归的方法进行比较）。

  在本例中，你可以看到 `toEqual` 和 `toBe` 之间的区别：

  ```ts
  import { test, expect } from 'vitest'

  const stockBill = {
    type: 'apples',
    count: 13
  }

  const stockMary = {
    type: 'apples',
    count: 13
  }

  test('stocks have the same properties', () => {
    expect(stockBill).toEqual(stockMary)
  })

  test('stocks are not the same', () => {
    expect(stockBill).not.toBe(stockMary)
  })
  ```

  :::warning 警告
  该方法不会对 `Error` 对象执行深度相同比较。如果要测试是否抛出了某个内容，建议使用 [`toThrow`](#tothrow) 断言。
  :::

### toStrictEqual

- **类型:** `(received: any) => Awaitable<void>`

  `toStrictEqual` 断言检查值是否等于接收值或者同样的结构，如果是对象类型（将会使用递归的方法进行比较），并且会比较它们是否是相同的类型。

  与 [`.toEqual`](#toequal) 之间的区别：

  -  检查属性值为 `undefined` 的键。例如使用 `.toStrictEqual` 时， `{a: undefined, b: 2}` 与 `{b: 2}` 不会匹配。
  -  检查数组的稀疏性。 例如使用 `.toStrictEqual` 时，`[, 1]` 与 `[undefined, 1]` 不会匹配。
  -  检查对象类型是否相等。例如具有字段 `a` 和 `b` 的实例对象不等于具有字段 `a` 和`b` 的字面量对象。

  ```ts
  import { test, expect } from 'vitest'

  class Stock {
    constructor(type) {
      this.type = type
    }
  }

  test('structurally the same, but semantically different', () => {
    expect(new Stock('apples')).toEqual({ type: 'apples' })
    expect(new Stock('apples')).not.toStrictEqual({ type: 'apples' })
  })
  ```

### toContain

- **类型:** `(received: string) => Awaitable<void>`

  `toContain` 用于断言检查值是否在数组中。还可以检查一个字符串是否为另一个字符串的子串。

  ```ts
  import { expect, test } from 'vitest'
  import { getAllFruits } from './stock'

  test('the fruit list contains orange', () => {
    expect(getAllFruits()).toContain('orange');
  })
  ```

### toContainEqual

- **类型:** `(received: any) => Awaitable<void>`

  `toContainEqual` 用于断言在数组中是否包含具有特定结构和值的元素。它就像对每个元素进行 [`toEqual`](#toequal) 操作。

  ```ts
  import { test, expect } from 'vitest'
  import { getFruitStock } from './stock'

  test("apple available", () => {
    expect(getFruitStock()).toContainEqual({ fruit: 'apple', count: 5 })
  })
  ```

### toHaveLength

- **类型:** `(received: number) => Awaitable<void>`

  `toHaveLength` 用于断言一个对象是否具有 `.length` 属性，并且它被设置为某个数值。

  ```ts
  import { test, expect } from 'vitest'

  test('toHaveLength', () => {
    expect('abc').toHaveLength(3);
    expect([1, 2, 3]).toHaveLength(3);

    expect('').not.toHaveLength(3); // .length 的值并不是3
    expect({ length: 3 }).toHaveLength(3)
  })
  ```

### toHaveProperty

- **类型:** `(key: any, received?: any) => Awaitable<void>`

  `toHaveProperty` 用于断言对象上是否存在指定 `key` 的属性。

  同时该方法还提供了一个可选参数，用于进行深度对比，就像使用 `toEqual` 匹配器来比较接收到的属性值。

  ```ts
  import { test, expect } from 'vitest'

  const invoice = {
    isActive: true,
    customer: {
      first_name: 'John',
      last_name: 'Doe',
      location: 'China',
    },
    total_amount: 5000,
    items: [
      {
        type: 'apples',
        quantity: 10,
      },
      {
        type: 'oranges',
        quantity: 5,
      },
    ]
  }

  test('John Doe Invoice', () => {
    expect(invoice).toHaveProperty('isActive') // 断言密钥存在
    expect(invoice).toHaveProperty('total_amount', 5000) //断言 key 存在且值相等

    expect(invoice).not.toHaveProperty('account') //断言这个 key 不存在

    // 使用 . 进行深度引用
    expect(invoice).toHaveProperty('customer.first_name')
    expect(invoice).toHaveProperty('customer.last_name', 'Doe')
    expect(invoice).not.toHaveProperty('customer.location', 'India')

    // 使用包含 key 的数组进行深度引用
    expect(invoice).toHaveProperty('items[0].type', 'apples')
    expect(invoice).toHaveProperty('items.0.type', 'apples') // .也有效

  })
  ```

### toMatch

- **类型:** `(received: string | regexp) => Awaitable<void>`

  `toMatch` 用于断言字符串是否匹配指定的正则表达式或字符串。

  ```ts
  import { expect, test } from 'vitest'

  test('top fruits', () => {
    expect('top fruits include apple, orange and grape').toMatch(/apple/)
    expect('applefruits').toMatch('fruit') // toMatch 也可以是一个字符串
  })
  ```

### toMatchObject

- **类型:** `(received: object | array) => Awaitable<void>`

  `toMatchObject` 用于断言对象是否匹配指定的对象属性的子集。

  我们还可以传递对象数组。如果我们只想检查两个数组的元素数量是否匹配，该方法就会很有用，它不同于 `arrayContaining` ，它允许接收数组中的额外元素。

  ```ts
  import { test, expect } from 'vitest'

  const johnInvoice = {
    isActive: true,
    customer: {
      first_name: 'John',
      last_name: 'Doe',
      location: 'China',
    },
    total_amount: 5000,
    items: [
      {
        type: 'apples',
        quantity: 10,
      },
      {
        type: 'oranges',
        quantity: 5,
      }
    ]
  }

  const johnDetails = {
    customer: {
      first_name: 'John',
      last_name: 'Doe',
      location: 'China',
    }
  }

  test('invoice has john personal details', () => {
    expect(johnInvoice).toMatchObject(johnDetails)
  })

  test('the number of elements must match exactly', () => {
    // 断言对象数组是否匹配
    expect([{ foo: 'bar' }, { baz: 1 }]).toMatchObject([
      { foo: 'bar' },
      { baz: 1 },
    ])
  })
  ```

### toThrowError

- **类型:** `(received: any) => Awaitable<void>`

  `toThrowError` 用于断言函数在调用时是否抛出错误。

   例如，如果我们想测试 `getFruitStock('pineapples')` 是否会抛出异常，我们可以这样写：

  你可以提供一个可选参数来测试是否引发了指定的错误：

  - 正则表达式：错误信息通过正则表达式匹配
  - 字符串：错误消息包含指定子串

  :::tip 提示
    你必须将代码包装在一个函数中，否则将无法捕获错误并且断言将会失败。
  :::

  ```ts
  import { test, expect } from 'vitest'

  function getFruitStock(type) {
    if (type === 'pineapples') {
      throw new DiabetesError('Pineapples is not good for people with diabetes')
    }
    // 可以做一些其他的事情
  }

  test('throws on pineapples', () => {
    // 测试错误消息是否在某处显示 "diabetes" ：这些是等效的
    expect(() => getFruitStock('pineapples')).toThrowError(/diabetes/)
    expect(() => getFruitStock('pineapples')).toThrowError('diabetes')

    // 测试确切的错误信息
    expect(() => getFruitStock('pineapples')).toThrowError(
      /^Pineapples is not good for people with diabetes$/,
    )
  })
  ```

// snapshots

### toMatchSnapshot
### toMatchInlineSnapshot
### toThrowErrorMatchingSnapshot
### toThrowErrorMatchingInlineSnapshot

### toHaveBeenCalled

- **类型:** `() => Awaitable<void>`

  这个断言可以测试一个函数是否被调用过。需要给 `expect` 传递一个监听函数。

  ```ts
  import { expect, test, vi } from 'vitest'

  const market = {
    buy(subject: string, amount: number) {
      // ...
    },
  }

  test('spy function', () => {
    const buySpy = vi.spyOn(market, 'buy')

    expect(buySpy).not.toHaveBeenCalled()

    market.buy('apples', 10)

    expect(buySpy).toHaveBeenCalled()
  })
  ```

### toHaveBeenCalledTimes

- **类型:** `(amount: number) => Awaitable<void>`

  这个断言将会检查一个函数是否被调用了一定的次数。需要给 `expect` 传递一个监听函数。

  ```ts
  import { expect, test, vi } from 'vitest'

  const market = {
    buy(subject: string, amount: number) {
      // ...
    },
  }

  test('spy function called two times', () => {
    const buySpy = vi.spyOn(market, 'buy')

    market.buy('apples', 10)
    market.buy('apples', 20)

    expect(buySpy).toHaveBeenCalledTimes(2)
  })
  ```

### toHaveBeenCalledWith
### toHaveBeenLastCalledWith
### toHaveBeenNthCalledWith
### toHaveReturned
### toHaveReturnedTimes
### toHaveReturnedWith
### toHaveLastReturnedWith
### toHaveNthReturnedWith

### resolves

- **类型:** `Promisify<Assertions>`

  `resolves` 可以在断言异步代码时有意地删除样板语法。使用它可以从待处理的 `Promise` 中去展开它的值，并使用通常的断言语句来断言它的值。如果 `Promise` 被拒绝，则断言将会失败。

  它返回相同的 `Assertions` 对象，但所有匹配器现在都是返回 `Promise`，因此你需要使用 `await` 去阻塞它。同样也适用于 `chai` 断言。

  例如，如果我们有一个函数，它调用 API 并返回一些数据，你可以使用下列代码来断言它的返回值：

  ```ts
  import { test, expect } from 'vitest'

  function buyApples() {
    return fetch('/buy/apples').then(r => r.json())
  }

  test('buyApples returns new stock id', async () => {
    // toEqual 现在返回一个 Promise ，所以我们必须等待它
    await expect(buyApples()).resolves.toEqual({ id: 1 })
  })
  ```

  :::warning 警告
  如果没有等待断言，那么我们将有一个每次都会通过的误报测试。为了确保断言确实发生，我们可以使用 [`expect.assertions(number)`](#expect-assertions) .
  :::

### rejects

- **类型:** `Promisify<Assertions>`

  `rejects` 可以在断言异步代码时有意地删除样板语法。使用它可以来展开 `Promise` 被拒绝的原因，并使用通常的断言语句来断言它的值。如果 `Promise` 成功解决，则断言将失败。

  它返回相同的 `Assertions` 对象，但所有匹配器现在都返回 `Promise`，因此你需要使用 `await` 去阻塞它。同样也适用于 `chai` 断言。

  例如，如果我们有一个调用失败的函数，我们可以使用此代码来断言原因：

  ```ts
  import { test, expect } from 'vitest'

  function buyApples(id) {
    if(!id) {
      throw new Error('no id')
    }
  }

  test('buyApples throws an error when no id provided', async () => {
    // toThrow 现在返回一个 Promise ，所以你必须等待它
    await expect(buyApples()).rejects.toThrow('no id')
  })
  ```

  :::warning 警告
  如果不等待断言，那么我们将有一个每次都会通过的误报测试。 为确保断言确实发生，我们可以使用 [`expect.assertions(number)`](#expect-assertions)。
  :::

### expect.assertions

- **类型:** `(count: number) => void`

  在测试通过或失败后，它将会验证在测试期间调用了多少次断言。它常用于检查异步代码是否被调用了。

  例如，如果我们有一个异步调用两个匹配器的函数，我们可以断言它们实际上是被调用的。

  ```ts
  import { test, expect } from 'vitest'

  async function doAsync(...cbs) {
    await Promise.all(
      cbs.map((cb, index) => cb({ index }))
    )
  }

  test('all assertions are called', async () => {
    expect.assertions(2);
    function callback1(data) {
      expect(data).toBeTruthy();
    }
    function callback2(data) {
      expect(data).toBeTruthy();
    }

    await doAsync(callback1, callback2);
  })
  ```

### expect.hasAssertions

- **类型:** `(count: number) => void`

  在测试通过或失败后，它将会验证在测试期间是否至少调用了一个断言。它常用于检查是否调用了异步代码。

  例如，如果我们有一个调用回调的代码，我们可以在回调中进行断言，但如果我们不检查是否调用了断言，测试将始终通过。

  ```ts
  import { test, expect } from 'vitest'
  import { db } from './db'

  const cbs = []

  function onSelect(cb) {
    cbs.push(cb)
  }

  // 从 db 中选择后，我们调用所有的回调
  function select(id) {
    return db.select({ id }).then(data => {
      return Promise.all(
        cbs.map(cb => cb(data))
      )
    })
  }

  test('callback was called', async () => {
    expect.hasAssertions()
    onSelect((data) => {
      // 在选择时调用
      expect(data).toBeTruthy();
    })
    // 如果不等待，测试将失败
    // 如果你没有 expect.hasAssertions()，测试将通过
    await select(3)
  })
  ```

// asymmetric matchers

### expect.anything
### expect.any
### expect.arrayContaining
### expect.not.arrayContaining
### expect.objectContaining
### expect.not.objectContaining
### expect.stringContaining
### expect.not.stringContaining
### expect.stringMatching
### expect.not.stringMatching

### expect.addSnapshotSerializer
### expect.extend

## Setup and Teardown

这些功能允许我们连接到测试的生命周期，以避免重复设置和拆卸代码。 它们适用于当前上下文：如果它们在顶层使用，则适用于文件；如果它们在 `describe` 块内，则适用于当前测试套件。

### beforeEach

- **类型:** `beforeEach(fn: () => Awaitable<void>, timeout?: number)`

  注册一个回调,在当前上下文中的每个测试运行之前被调用。
  如果函数返回一个 `Promise`，`Vitest` 会等到 `Promise` 解决后再运行测试。

  或者，我们可以传递一个超时（以毫秒为单位），定义在终止之前等待多长时间。 默认值为 5 秒。

  ```ts
  import { beforeEach } from 'vitest'

  beforeEach(async () => {
    // 在每次测试运行之前清除模拟并添加一些测试数据
    await stopMocking()
    await addUser({ name: 'John'})
  })
  ```

  `beforeEach` 确保为每个测试都添加用户。

### afterEach

- **类型:** `afterEach(fn: () => Awaitable<void>, timeout?: number)`

  注册一个回调,在当前上下文中的每个测试运行之后被调用。
  如果函数返回一个 Promise ，Vitest 会等到 Promise 解决后再继续。

  或者，你可以设置超时（以毫秒为单位）以指定在终止前等待多长时间。 默认值为 5 秒。

  ```ts
  import { afterEach } from 'vitest'

  afterEach(async () => {
    await clearTestingData() // 每次测试运行后清除测试数据
  })
  ```
  `afterEach` 确保在每次测试运行后清除测试数据。

### beforeAll

- **类型:** `beforeAll(fn: () => Awaitable<void>, timeout?: number)`

  注册一个回调，在开始运行当前上下文中的所有测试之前被调用一次。
  如果函数返回一个 `Promise`，`Vitest` 会等到 `Promise` 解决后再运行测试。

  或者，你可以提供超时（以毫秒为单位）以指定在终止之前等待多长时间。 默认值为 5 秒。

  ```ts
  import { beforeAll } from 'vitest'

  beforeAll(async () => {
    await startMocking() // 在所有测试运行之前调用一次
  })
  ```

  `beforeAll` 确保在测试运行之前设置模拟数据

### afterAll

- **类型:** `afterAll(fn: () => Awaitable<void>, timeout?: number)`

  注册一个回调，在当前上下文中运行所有测试后被调用一次。
  如果函数返回一个 Promise，Vitest 会等到 Promise 解决后再继续。

  或者，你可以提供超时（以毫秒为单位）以指定在终止之前等待多长时间。 默认值为 5 秒。

  ```ts
  import { afterAll } from 'vitest'

  afterAll(async () => {
    await stopMocking() // 在所有测试运行后调用此方法
  })
  ```

  `afterAll` 确保在所有测试运行后调用 `stopMocking` 方法。

## Vi

Vitest 通过 **vi** 提供工具函数来帮助你。你可以 `import { vi } from 'vitest'` 或 **全局地** 访问它 (当 [globals configuration](/config/#globals) **启用** 时)。

### vi.advanceTimersByTime

- **类型:** `(ms: number) => Vitest`

  就像 `runAllTimers` 一样工作，但会在经过几毫秒后结束。例如，这将输出 `1, 2, 3` 并且不会抛出：

  ```ts
  let i = 0
  setInterval(() => console.log(++i), 50)

  vi.advanceTimersByTime(150)
  ```

### vi.advanceTimersToNextTimer

- **类型:** `() => Vitest`

  调用下一个可调用的计时器。这在每个计时器调用间隔内进行断言很有用。你可以链式调用它来自己管理计时器。

  ```ts
  let i = 0
  setInterval(() => console.log(++i), 50)

  vi.advanceTimersToNextTimer() // 输出 1
    .advanceTimersToNextTimer() // 输出 2
    .advanceTimersToNextTimer() // 输出 3
  ```

### vi.clearAllTimers

  删除所有计划运行的计时器。这些计时器后续将不会运行。

### vi.fn

- **类型:** `(fn: Function) => CallableMockInstance`

  为函数创建一个监听，但也可以在没有监听的情况下启动。每次调用函数时，存储其调用参数、返回值和实例。此外，你可以使用 [methods](#mockinstance-methods) 操纵它的行为。
  如果没有给出函数，mock 将在调用时返回 `undefined`。

  ```ts
  const getApples = vi.fn(() => 0)

  getApples()

  expect(getApples).toHaveBeenCalled()
  expect(getApples).toHaveReturnedWith(0)

  getApples.mockReturnValueOnce(5)

  const res = getApples()
  expect(res).toBe(5)
  expect(getApples).toHaveNthReturnedWith(2, 5)
  ```

### vi.getMockedSystemTime

- **类型**: `() => Date | null`

  返回使用 `setSystemTime` 设置的模拟的当前日期。如果日期没有被模拟，将返回 `null`。

### vi.getRealSystemTime

- **类型**: `() => number`

  使用 `vi.useFakeTimers` 时，会模拟 `Date.now` 调用。如果需要获取毫秒级的实时时间，你可以调用这个函数。

### vi.mock

  **类型**: `(path: string, factory?: () => unknown) => void`

  使传递的模块的所有 `imports`都被模拟。在 `path` 中，你可以使用配置好的 Vite 别名。

  - 如果定义了 `factory`，将返回其结果。工厂函数可以是异步的。你可以在内部调用 [`vi.importActual`](#vi-importactual) 来获取原始模块。对 `vi.mock` 的调用将被提升到文件的顶部，因此你无法访问在全局文件范围内声明的变量！

  ```ts
  vi.mock('path', () => {
    return {
      default: { myDefaultKey: vi.fn() },
      namedExport: vi.fn(),
      // etc...
    }
  })
  ```

  - 如果 `__mocks__` 文件夹下存在同名文件，则所有导入都将返回其导出。例如，带有 `<root>/__mocks__/axios.ts` 文件夹的 `vi.mock('axios')` 将返回从 `axios.ts` 中导出的所有内容。
  - 如果里面没有 `__mocks__` 文件夹或同名文件，将调用原始模块并对其进行模拟。(有关应用的规则，请参阅 [自动模拟算法](/guide/mocking#自动模拟算法)。)

### vi.setSystemTime

- **类型**: `(date: string | number | Date) => void`

  将当前日期设置为一个过去的日期。所有 `Date` 调用都将返回此日期。

  有助于你测试依赖当前日期的任何内容 —— 例如，你代码中的 [luxon](https://github.com/moment/luxon/) 调用。

  ```ts
  const date = new Date(1998, 11, 19)

  vi.useFakeTimers()
  vi.setSystemTime(date)

  expect(Date.now()).toBe(date.valueOf())

  vi.useRealTimers()
  ```

### vi.mocked

- **类型**: `<T>(obj: T, deep?: boolean) => MaybeMockedDeep<T>`

  TypeScript 的类型助手。实际上只是返回传递的对象。

  ```ts
  import example from './example'
  vi.mock('./example')

  test('1+1 equals 2', async() => {
    vi.mocked(example.calc).mockRestore()

    const res = example.calc(1, '+', 1)

    expect(res).toBe(2)
  })
  ```

### vi.importActual

- **类型**: `<T>(path: string) => Promise<T>`

  导入模块，如果它应该被模拟，则绕过所有检查。如果你想部分模拟模块，这可能会很有用。

  ```ts
  vi.mock('./example', async() => {
    const axios = await vi.importActual('./example')

    return { ...axios, get: vi.fn() }
  })
   ```

### vi.importMock

- **类型**: `<T>(path: string) => Promise<MaybeMockedDeep<T>>`

  导入一个被模拟的包含其所有属性 (包括嵌套属性) 的模块。遵循与 [`vi.mock`](#vi-mock) 相同的规则。有关应用的规则，请参阅 [自动模拟算法](/guide/mocking#自动模拟算法)。

### vi.restoreCurrentDate

- **类型**: `() => void`

  将 `Date` 恢复为系统时间。

### vi.runAllTicks

- **类型:** `() => Vitest`

  调用每个微任务。它们通常排列在 `proccess.nextTick` 中。它也将运行它们自己安排的所有微任务。

### vi.runAllTimers

- **类型:** `() => Vitest`

  此方法将调用每个被创建的计时器，直到计时器队列为空。这意味着在 `runAllTimers` 期间调用的每个计时器都将被触发。如果你有一个无限的区间，它会在 10000 次尝试后抛出。例如，这将输出 `1, 2, 3`：

  ```ts
  let i = 0
  setTimeout(() => console.log(++i))
  const interval = setInterval(() => {
    console.log(++i)
    if (i === 2)
      clearInterval(interval)

  }, 50)

  vi.runAllTimers()
  ```

### vi.runOnlyPendingTimers

- **类型:** `() => Vitest`

  此方法将调用在 `vi.useFakeTimers()` 调用之后创建的每个计时器。它不会触发在其调用期间创建的任何计时器。例如，这只会输出 `1`：

  ```ts
  let i = 0
  setInterval(() => console.log(++i), 50)

  vi.runOnlyPendingTimers()
  ```

### vi.spyOn

- **类型:** `<T, K extends keyof T>(object: T, method: K, accessType?: 'get' | 'set') => MockInstance`

  在对象的方法或 getter/setter 上创建一个监听。

  ```ts
  let apples = 0
  const obj = {
    getApples: () => 13,
  }

  const spy = vi.spyOn(obj, 'getApples').mockImplementation(() => apples)
  apples = 1

  expect(obj.getApples()).toBe(1)

  expect(spy).toHaveBeenCalled()
  expect(spy).toHaveReturnedWith(1)
  ```

### vi.unmock

**类型**: `(path: string) => void`

  从模拟注册表中删除模块 所有后续的 import 调用都将返回原始模块，即使它被模拟了。

### vi.useFakeTimers

- **类型:** `() => Vitest`

  要启用模拟计时器，你需要调用此方法。它将包装对计时器的所有进一步调用 (例如 `setTimeout`、`setInterval`、`clearTimeout`、`clearInterval`、`nextTick`、`setImmediate`、`clearImmediate` 和 `Date`)，直到 [`vi.useRealTimers()`](#vi-useRealTimers) 被调用。

  它的内部实现基于 [`@sinonjs/fake-timers`](https://github.com/sinonjs/fake-timers)。

### vi.useRealTimers

- **类型:** `() => Vitest`

  当计时器结束时，你可以调用此方法，将模拟计时器恢复其原始实现。之前运行的所有计时器将不会恢复。

## MockInstance Methods

### getMockName

- **类型:** `() => string`

  使用返回模拟名称的方法 `.mockName(name)`。

### mockClear

- **类型:** `() => MockInstance`

  清除有关每个模拟的所有信息。 调用后，[`spy.mock.calls`](#mockcalls)、[`spy.mock.returns`](#mockreturns) 将返回空数组。 如果我们需要清理不同断言之间的测试间谍，这会很有用。

  如果我们希望在每次测试之前自动调用此方法，我们可以在 `config.xml` 中启用 [`clearMocks`](/config/#clearMocks) 设置。


### mockName

- **类型:** `(name: string) => MockInstance`

  设置内部模拟名称。有助于查看哪些模拟导致断言失败。

### mockImplementation

- **类型:** `(fn: Function) => MockInstance`

  接受将用作模拟实现的函数。

  例如:

  ```ts
  const mockFn = vi.fn().mockImplementation(apples => apples + 1);
  // or: vi.fn(apples => apples + 1);

  const NelliesBucket = mockFn(0);
  const BobsBucket = mockFn(1);

  NelliesBucket === 1; // true
  BobsBucket === 2; // true

  mockFn.mock.calls[0][0] === 0; // true
  mockFn.mock.calls[1][0] === 1; // true
  ```

### mockImplementationOnce

- **类型:** `(fn: Function) => MockInstance`

  接受一个函数，该函数将用作对模拟函数的一次调用的模拟实现。可以链接起来，以便多个函数调用产生不同的结果。

  ```ts
  const myMockFn = vi
    .fn()
    .mockImplementationOnce(() => true)
    .mockImplementationOnce(() => false);

  myMockFn(); // true
  myMockFn(); // false
  ```

   当模拟函数用完实现时，它将调用使用 `vi.fn(() => defaultValue)` 或 `.mockImplementation(() => defaultValue)` 如果它们被调用将会被设置的默认实现：

  ```ts
  const myMockFn = vi
    .fn(() => 'default')
    .mockImplementationOnce(() => 'first call')
    .mockImplementationOnce(() => 'second call');

  // 'first call', 'second call', 'default', 'default'
  console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn());
  ```

### mockRejectedValue

- **类型:** `(value: any) => MockInstance`

  当异步函数将被调用时，接受将被拒绝的错误。

  ```ts
  test('async test', async () => {
    const asyncMock = vi.fn().mockRejectedValue(new Error('Async error'));

    await asyncMock(); // throws "Async error"
  });
  ```

### mockRejectedValueOnce

- **类型:** `(value: any) => MockInstance`

  接受一个值，该值将在一次调用模拟函数时被拒绝。如果链接，每个连续调用都将拒绝传递的值。

  ```ts
  test('async test', async () => {
    const asyncMock = vi
      .fn()
      .mockResolvedValueOnce('first call')
      .mockRejectedValueOnce(new Error('Async error'));

    await asyncMock(); // first call
    await asyncMock(); // throws "Async error"
  });
  ```

### mockReset

- **类型:** `() => MockInstance`

  执行 `mockClear` 所做的会将内部实现作为空函数（调用时返回 `undefined`）。当我们想要将模拟完全重置回其初始状态时，这会很有用。

  如果我们希望在每次测试之前自动调用此方法，我们可以在 `config.xml` 中启用 [`mockReset`](/config/#mockReset) 设置。

### mockRestore

- **类型:** `() => MockInstance`

  执行 `mockRestore` 所做的并将内部实现恢复为原始功能。

  注意，从 `vi.fn()` 恢复模拟的话会将实现设置为返回 `undefined` 的空函数。 使用 `vi.fn(impl)` 恢复的话会将实现恢复为 `impl`。

  如果我们希望在每次测试之前自动调用此方法，我们可以在 `config.xml` 中启用 [`restoreMocks`](/config/#restoreMocks) 设置。

### mockResolvedValue

- **类型:** `(value: any) => MockInstance`

  接受将在调用异步函数时解析的值。

  ```ts
  test('async test', async () => {
    const asyncMock = vi.fn().mockResolvedValue(43);

    await asyncMock(); // 43
  });
  ```

### mockResolvedValueOnce

- **类型:** `(value: any) => MockInstance`

  接受一次调用模拟函数时解析的值。如果链接，每个连续调用都将解析传递的值。

  ```ts
  test('async test', async () => {
    const asyncMock = vi
      .fn()
      .mockResolvedValue('default')
      .mockResolvedValueOnce('first call')
      .mockResolvedValueOnce('second call');

    await asyncMock(); // first call
    await asyncMock(); // second call
    await asyncMock(); // default
    await asyncMock(); // default
  });
  ```

### mockReturnThis

- **类型:** `() => MockInstance`

  设置内部实现，将会返回 `this` 上下文。

### mockReturnValue

- **类型:** `(value: any) => MockInstance`

  接受调用模拟函数时将返回的值。

  ```ts
  const mock = vi.fn();
  mock.mockReturnValue(42);
  mock(); // 42
  mock.mockReturnValue(43);
  mock(); // 43
  ```

### mockReturnValueOnce

- **类型:** `(value: any) => MockInstance`

  接受调用模拟函数时返回的值。如果链接，每个连续调用都会返回传递的值。 当没有更多的 `mockReturnValueOnce` 值要使用时，调用由 `mockImplementation` 或其他 `mockReturn*` 方法去指定的函数。

  ```ts
  const myMockFn = vi
    .fn()
    .mockReturnValue('default')
    .mockReturnValueOnce('first call')
    .mockReturnValueOnce('second call');

  // 'first call', 'second call', 'default', 'default'
  console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn());
  ```

## MockInstance Properties

### mock.calls

  这是一个包含每个调用的所有参数的数组。数组的每一项都是该调用的参数。

  如果一个函数被调用两次，并依次使用以下参数 `fn(arg1, arg2)`、`fn(arg3, arg4)`，那么 `mock.calls` 将是：

```js
[
  ['arg1', 'arg2'],
  ['arg3', 'arg4'],
];
```

### mock.results

  这是一个包含所有值的数组，这些值是从函数 `returned` 的。 该数组的一项是具有 `type` 和 `value` 属性的对象。 可用类型有：

- `'return'` - 函数返回而不抛出。
- `'throw'` - 函数抛出了一个值。

  `value` 属性包含返回值或抛出的错误。

  如果函数返回 `result1` ，然后抛出错误，那么 `mock.results` 将是：

```js
[
  {
    type: 'return',
    value: 'result',
  },
  {
    type: 'throw',
    value: Error,
  },
];
```

### mock.instances

  还未实现。
