---
outline: deep
---

# 配置 Vitest

## 配置

`vitest` 将读取你的项目根目录的 `vite.config.ts` 文件以匹配插件并设置为你的 Vite 应用程序。如果你想使用不同的配置进行测试，你可以：

- 创建 `vitest.config.ts`，优先级更高。
- 将 `--config` 选项传递给 CLI，例如 `vitest --config ./path/to/vitest.config.ts` 。
- 在 `defineConfig` 中使用 `process.env.VITEST` 或 `mode` 属性（默认值是 `test`）在 `vite.config.ts` 中有条件的应用不同的配置。

要配置 `vitest` 本身，请在你的 Vite 配置中添加 `test` 属性。如果你使用 `vite` 的 `defineConfig` 你还需要将 [三斜线指令](https://www.tslang.cn/docs/handbook/triple-slash-directives.html#-reference-types-) 写在配置文件的顶部。

使用 `vite` 的 `defineConfig` 可以参考下面的格式：

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    // ...
  },
})
```

使用 `vitest` 的 `defineConfig` 可以参考下面的格式：

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // ...
  },
})
```

如果有需要，你可以获取到 Vitest 的默认选项以扩展它们：

```ts
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, 'packages/template/*'],
  },
})
```

## 选项

:::tip 提醒
除了以下选项，你还可以使用 [Vite](https://vitejs.dev/config/) 中的任何配置选项。 例如，`define` 定义全局变量，或`resolve.alias` 定义别名。
:::

### include

- **类型:** `string[]`
- **默认值:** `['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']`

匹配包含测试文件的 glob 规则。

### exclude

- **Type:** `string[]`
- **Default:** `['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**']`

匹配排除测试文件的 glob 规则。

### deps

- **类型:** `{ external?, inline? }`

对依赖关系进行内联或外联的处理

#### deps.external

- **类型:** `(string | RegExp)[]`
- **默认值:** `['**/node_modules/**', '**/dist/**']`

Externalize 意味着 Vite 会绕过包到原生 Node.js 中。Vite 的转换器和解析器不会应用外部依赖项，因此不会支持重新加载时的热更新。通常，`node_modules` 下的包是外部依赖。

#### deps.inline

- **类型:** `(string | RegExp)[] | true`
- **默认值:** `[]`

Vite 将会处理的内联模块。这有助于处理以 ESM 格式（Node 无法处理）发布 `.js` 的包。

如果为 `true`，则每个依赖项都将被内联。 在 [`ssr.noExternal`](https://vitejs.dev/guide/ssr.html#ssr-externals) 中指定的所有依赖项将默认内联。

#### deps.fallbackCJS

- **类型** `boolean`
- **默认值:** `false`

当一个依赖项是有效的 ESM 包时，将会尝试根据路径猜测 cjs 版本。

如果包在 ESM 和 CJS 模式下具有不同的逻辑，可能会导致一些错误的产生。

#### deps.interopDefault

- **类型:** `boolean`
- **默认值:** `true`

将 CJS 模块的默认值视为命名导出。

### globals

- **类型:** `boolean`
- **默认值:** `false`

默认情况下，`vitest` 不显式提供全局 API。如果你更倾向于使用类似 jest 中的全局 API，可以将 `--globals` 选项传递给 CLI 或在配置中添加 `globals: true`。

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
  },
})
```

为了可以让全局 API 支持 Typescript，请将 `vitest/globals` 添加到 `tsconfig.json` 中的 `types` 选项中

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

如果你已经在项目中使用 [`unplugin-auto-import`](https://github.com/antfu/unplugin-vue-components)，你也可以直接用它来自动导入这些 API。

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: ['vitest'],
      dts: true, // generate TypeScript declaration
    }),
  ],
})
```

### environment

- **类型:** `'node' | 'jsdom' | 'happy-dom' | 'edge-runtime'`
- **默认值:** `'node'`

Vitest 中的默认测试环境是一个 Node.js 环境。如果你正在构建 Web 端应用程序，你可以使用 [`jsdom`](https://github.com/jsdom/jsdom) 或 [`happy-dom`](https://github.com/capricorn86/happy-dom) 这种类似浏览器(browser-like)的环境来替代 Node.js。
如果你正在构建边缘计算函数，你可以使用 [`edge-runtime`](https://edge-runtime.vercel.app/packages/vm) 环境

你可以通过在文件顶部添加包含 `@vitest-environment` 的文档块或注释，为某个测试文件中的所有测试指定环境：

文档块格式:

```js
/**
 * @vitest-environment jsdom
 */

test('use jsdom in this test file', () => {
  const element = document.createElement('div')
  expect(element).not.toBeNull()
})
```

注释格式:

```js
// @vitest-environment happy-dom

test('use happy-dom in this test file', () => {
  const element = document.createElement('div')
  expect(element).not.toBeNull()
})
```

为了与 Jest 兼容，还存在一个配置 `@jest-environment`：

```js
/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', () => {
  const element = document.createElement('div')
  expect(element).not.toBeNull()
})
```

如果你使用 [`--no-threads`](#threads) 标志运行 Vitest，你的测试将按以下顺序运行：`node`、`jsdom`、`happy-dom`。 这意味着，具有相同环境的每个测试都组合在一起，但仍按顺序运行。

### update

- **类型:** `boolean`
- **默认值:** `false`

更新快照文件。这将更新所有更改的快照并删除过时的快照。

### watch

- **Type:** `boolean`
- **Default:** `true`

启动监听模式

### root

- **类型:** `string`

项目的根目录

### reporters

- **类型:** `Reporter | Reporter[]`
- **默认值:** `'default'`

用于输出的自定义 reporters 。 Reporters 可以是 [一个 Reporter 实例](https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/types/reporter.ts) 或选择内置的 reporters 字符串：

  - `'default'` - 当他们经过测试套件
  - `'verbose'` - 保持完整的任务树可见
  - `'dot'` - 将每个任务显示为一个点
  - `'junit'` - JUnit XML 报告器
  - `'json'` - 给出一个简单的 JSON 总结
  - 自定义报告的路径 (例如 `'./path/to/reporter.ts'`, `'@scope/reporter'`)

### outputTruncateLength

- **类型:** `number`
- **默认值:** `80`

指定截断输出差异的字符行数，最多 80 个字符。 你可能希望对此进行调整，取决于你的终端窗口宽度。

### outputDiffLines

- **类型:** `number`
- **默认值:** `15`

指定输出差线的数量，最多 `15` 个。

### outputFile

- **类型:** `string | Record<string, string>`

当指定 `--reporter=json` 或 `--reporter=junit` 时，将测试结果写入一个文件。通过提供对象而不是字符串，你可以在使用多个报告器时定义单独的输出。

要通过 CLI 命令提供对象，请使用以下语法：`--outputFile.json=./path --outputFile.junit=./other-path`。

### threads

- **类型:** `boolean`
- **默认值:** `true`

通过使用 [tinypool](https://github.com/Aslemammad/tinypool)（[Piscina](https://github.com/piscinajs/piscina) 的轻量级分支）可以启用多线程。

:::warning 警告
此选项与 Jest 的 `--runInBand` 不同。 Vitest 使用工作线程不仅可以并行运行测试，还可以提供隔离。 通过禁用此选项，你的测试将按顺序运行，但在相同的全局上下文中，因此你必须自己提供隔离。

如果你依赖全局状态（前端框架通常这样做）或者你的代码依赖于为每个测试单独定义的环境，这可能会导致各种问题。 但是可以提高你的测试速度（最多快 3 倍），这不一定依赖于全局状态或可以轻松绕过它。
:::

### maxThreads

- **类型:** `number`
- **默认值:** 可用的 CPU 数量

允许的最大线程数。你也可以使用 `VITEST_MAX_THREADS` 环境变量。

### minThreads

- **类型:** `number`
- **默认值:** 可用的 CPU 数量

允许的最小线程数。你也可以使用 `VITEST_MIN_THREADS` 环境变量。

### testTimeout

- **类型:** `number`
- **默认值:** `5000`

测试的默认超时时间（以毫秒为单位）。

### hookTimeout

- **类型:** `number`
- **默认值:** `10000`

钩子(hook)的默认超时时间（以毫秒为单位）。

### silent

- **类型:** `boolean`
- **默认值:** `false`

静默模式下启动测试。

### setupFiles

- **类型:** `string | string[]`

setup 文件的路径。它们将运行在每个测试文件之前。

你可以在内部使用 `process.env.VITEST_WORKER_ID` (类似整数的字符串）来区分线程（如果`threads: false`，那么这个值将永远会是`1`）。

:::tip 提醒
请注意，如果你正在运行 [`--no-threads`](#threads)，则此设置文件将在同一全局范围内多次运行。 这意味着，你在每次测试之前都在访问同一个全局对象，因此请确保你做的事情没有超出您的需要。
:::

比如，你可能依赖于一个全局变量：

```ts
import { config } from '@some-testing-lib'

if (!globalThis.defined) {
  config.plugins = [myCoolPlugin]
  computeHeavyThing()
  globalThis.defined = true
}

// hooks are reset before each suite
afterEach(() => {
  cleanup()
})

globalThis.resetBeforeEachTest = true
```

### globalSetup

- **类型:** `string | string[]`

全局的 setup 文件的路径，相对于项目的根目录。

全局的 setup 文件可以导出命名函数 `setup` 和 `teardown` 或返回拆卸函数的 `default` 函数（[示例](https://github.com/vitest-dev/vitest/blob/main/test/global-setup/vitest.config.ts))。

::: info 提示
可以存在多个 globalSetup。setup 和 teardown 依次执行，而 teardown 则以相反的顺序执行。
:::

::: warning 警告
请注意，全局设置在不同的全局范围内运行，因此你的测试无权访问此处定义的变量。
:::

### watchExclude

- **类型:** `string[]`
- **默认值:** `['**/node_modules/**', '**/dist/**']`

触发监视重新运行时要忽略的文件路径的全局 glob 模式。

### forceRerunTriggers

- **类型**: `string[]`
- **默认值:** `['**/package.json/**', '**/vitest.config.*/**', '**/vite.config.*/**']`

将触发整个套件重新运行的文件路径的全局 glob 模式。 如果在 git diff 中找到触发器，则与 --changed 参数配对时，将运行整个测试套件。

如果你正在测试调用 CLI 命令时很有用，因为 Vite 无法构建模块依赖图:

```ts
test('execute a script', async () => {
  // Vitest cannot rerun this test, if content of `dist/index.js` changes
  await execa('node', ['dist/index.js'])
})
```

:::tip 提醒
确保你的的文件未被 `watchExclude` 排除。
:::

### isolate

- **类型:** `boolean`
- **默认值:** `true`

是否为每个测试文件构建隔离环境。 如果你禁用 [`--threads`](#threads)，它将不会工作。

### coverage

- **类型:** `C8Options`
- **默认值:** `undefined`

使用 [C8](https://github.com/bcoe/c8) 设置测试覆盖率的配置选项

### testNamePattern

- **类型** `string | RegExp`

使用与模式匹配的全名运行测试。
如果你将 `OnlyRunThis` 添加到此属性，将跳过测试名称中不包含单词 `OnlyRunThis` 的测试。

```js
import { expect, test } from 'vitest'

// run
test('OnlyRunThis', () => {
  expect(true).toBe(true)
})

// skipped
test('doNotRun', () => {
  expect(true).toBe(true)
})
```

### open

- **类型:** `boolean`
- **默认值为:** `false`

打开 Vitest UI (WIP: 赞助者计划可用)

### api

- **类型:** `boolean | number`
- **默认值:** `false`

提供 API 服务的端口。当设置为 true 时，默认端口为 51204

### clearMocks

- **类型:** `boolean`
- **默认值:** `false`

是否在每次测试前对所有监听(Spy)调用 `.mockClear()`。这将清除模拟历史记录，但不会将其实现重置为默认值。

### mockReset

- **类型:** `boolean`
- **默认值:** `false`

是否在每次测试之前对所有监听(Spy)调用 [`.mockReset()`](/api/#mockreset)。 这将清除模拟历史并将其实现重置为空函数（将返回`undefined`）。

### restoreMocks

- **类型:** `boolean`
- **默认值:** `false`

是否在每次测试之前对所有监听(Spy)调用 [`.mockRestore()`](/api/#mockrestore)。 这将清除模拟历史并将其实现重置为原始历史。

### transformMode

- **类型:** `{ web?, ssr? }`

决定模块的转换方式。

#### transformMode.ssr

- **类型:** `RegExp[]`
- **默认值:** `[/\.([cm]?[jt]sx?|json)$/]`

对指定的文件使用 SSR 转换管道。<br>
Vite 插件在处理这些文件时会收到 `ssr: true` 标志。

#### transformMode&#46;web

- **类型:** `RegExp[]`
- **默认值:** *除了 `transformMode.ssr` 以外的所有文件*

首先会进行正常的转换管道（针对浏览器），然后进行 SSR 重写以在 Node 中运行代码。<br>
Vite 插件在处理这些文件时会收到 `ssr: false` 标志。

当你使用 JSX 作为 React 以外的组件模型（例如 Vue JSX 或 SolidJS）时，你可能需要进行如下配置以使 `.tsx` / `.jsx` 转换为客户端组件：

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    transformMode: {
      web: [/\.[jt]sx$/],
    },
  },
})
```

### snapshotFormat

- **类型:** `PrettyFormatOptions`

测试快照的格式选项。这些选项被传递给 [`pretty-format`](https://www.npmjs.com/package/pretty-format)。

### resolveSnapshotPath

- **类型**: `(testPath: string, snapExtension: string) => string`
- **默认值**: 存储快照文件在 `__snapshots__` 目录

覆盖快照的默认路径。例如，要在测试文件旁边存储一下快照：

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    resolveSnapshotPath: (testPath, snapExtension) => testPath + snapExtension,
  },
})
```

### allowOnly

- **类型**: `boolean`
- **默认值**: `false`

允许标记为 only 的测试和套件。

### passWithNoTests

- **类型**: `boolean`
- **默认值**: `false`

如果没有找到测试，Vitest 不会失败。

### logHeapUsage

- **Type**: `boolean`
- **Default**: `false`

每次测试后显示堆的使用情况。用于调试内存是否泄漏。

### css

- **类型**: `boolean | { include?, exclude? }`

配置是否处理 CSS。 排除后，CSS 文件将被替换为空字符串以绕过后续处理。

默认情况下，只处理 CSS 模块，因为它会影响运行时。 JSDOM 和 Happy DOM 不完全支持注入 CSS，因此禁用此设置可能有助于提高性能。

#### css.include

- **类型**: `RegExp | RegExp[]`
- **默认值**: `[/\.module\./]`

将返回匹配正则表达式并将由 Vite 管道处理的实际 CSS 文件。

#### css.exclude

- **类型**: `RegExp | RegExp[]`
- **默认值**: `[]`

将返回匹配正则表达式的空 CSS 文件。

### maxConcurrency

- **类型**: `number`
- **默认值**: `5`

使用 `test.concurrent` 标记允许同时运行的最大测试数量。

当出现可用插槽时，超过此限制的测试将排队运行。

### cache

- **类型**: `false | { dir? }`

配置 Vitest 缓存策略的选项。目前 Vitest 为测试结果存储缓存，以便先运行更长且失败的测试。

#### cache.dir

- **类型**: `string`
- **默认值**: `node_modules/.vitest`

缓存目录的路径。

### sequence

- **类型**: `{ sequencer?, shuffle?, seed? }`

配置测试运行顺序的选项。

#### sequence.sequencer

- **类型**: `TestSequencerConstructor`
- **默认值**: `BaseSequencer`

定义分片和排序的自定义类。你可以从 `vitest/node` 扩展 `BaseSequencer`，如果你只需要重新定义 `sort` 和 `shard` 方法之一，但两者都应该存在。

分片是在排序之前进行的，并且只有提供了 `--shard` 选项的情况下才会生效。

#### sequence.shuffle

- **类型**: `boolean`
- **默认值**: `false`

如果你希望测试随机运行，可以使用此选项或 CLI 参数 [`--sequence.shuffle`](/guide/cli) 启用它。

Vitest 通常使用缓存对测试进行排序，因此长时间运行的测试会更早开始 - 这会使测试运行得更快。 如果你的测试将以随机顺序运行，你将失去这种性能改进，但跟踪意外依赖于先前运行的测试可能很有用。

#### sequence.seed

- **类型**: `number`
- **默认值**: `Date.now()`

如果测试以随机顺序运行，则设置随机化种子。
