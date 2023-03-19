---
outline: deep
---

# 配置索引

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

当使用单独的 `vitest.config.js` 时，如果需要，你还可以从另一个配置文件扩展 Vite 的选项：

```ts
import { mergeConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      exclude: ['packages/template/*'],
    },
  })
)
```

:::tip 提醒
除了以下选项，你还可以使用 [Vite](https://vitejs.dev/config/) 中的任何配置选项。 例如，`define` 定义全局变量，或`resolve.alias` 定义别名。
:::

### include

- **类型:** `string[]`
- **默认值:** `['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']`

匹配包含测试文件的 glob 规则。

### exclude

- **类型:** `string[]`
- **默认值:** `['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**', '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*']`

匹配排除测试文件的 glob 规则。

### deps

- **类型:** `{ external?, inline?, ... }`

对依赖关系进行内联或外联的处理

#### deps.experimentalOptimizer

- **类型:** `DepOptimizationConfig & { enabled: boolean }`
- **版本:** Vitets 0.29.0
- **参考:** [Dep Optimization Options](https://vitejs.dev/config/dep-optimization-options.html)

启用依赖优化。如果你有很多测试，这可能会提高它们的性能。

对于 `jsdom` 和 `happy-dom` 环境，当 Vitest 遇到外部库时，它会使用 esbuild 打包成一个文件，并作为一个整体模块导入。这有几个原因：

- 导入大量导入的包很昂贵。通过将它们捆绑到一个文件中，我们可以节省大量时间
- 导入 UI 库很昂贵，因为它们并不意味着在 Node.js 中运行
- 你的 `alias` 配置现在在捆绑包中得到处理

你可以使用 `exclude` 选项为某些包选择退出此行为。你可以在 [Vite](https://vitejs.dev/config/dep-optimization-options.html) 文档中阅读有关可用选项的更多信息。

此选项还继承了你的 `optimizeDeps` 配置。如果你在 `deps.experimentalOptimizer` 中重新定义 `include`/`exclude`/`entries` 选项，它将在运行测试时覆盖你的 `optimizeDeps`。

::: tip 提醒
你将无法编辑用于调试的 `node_modules` 代码，因为该代码实际上位于你的 `cacheDir` 或 `test.cache.dir` 目录中。 如果你想使用 `console.log` 语句进行调试，请直接编辑它或使用 `deps.experimentalOptimizer.force` 选项强制重新绑定。
:::

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

#### deps.registerNodeLoader

- **类型:** `boolean`
- **默认值:** `false`

使用 [实验性 Node 加载器](https://nodejs.org/api/esm.html#loaders) 解析 `node_modules` 中的导入，使用 Vite 解析算法。

如果禁用，你的 `alias` 和 `<plugin>.resolveId` 不会影响 `node_modules` 或 `deps.external` 中的导入。

#### deps.interopDefault

- **类型:** `boolean`
- **默认值:** `true`

将 CJS 模块的默认值视为命名导出。某些依赖项仅捆绑 CJS 模块，不使用命名导出，Node.js 可以在使用 `import` 语法而不是 `require` 导入包时对其进行静态分析。使用命名导出在 Node 环境中导入此类依赖项时，你将看到此错误：

```
import { read } from 'fs-jetpack';
         ^^^^
SyntaxError: Named export 'read' not found. The requested module 'fs-jetpack' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export.
```

Vitest 不进行静态分析，并且不会在你运行代码之前失败，因此当该特性禁用时你在运行测试时很可能会看到此错误：

```
TypeError: createAsyncThunk is not a function
TypeError: default is not a function
```

如果你使用的是绕过此 Node.js 限制的捆绑器或转译器，则可以手动启用此选项。默认情况下，当 `environment` 为 `node` 时，Vitest 假定你使用的是 Node ESM 语法，并且不关心命名导出。

### runner

- **类型**: `VitestRunnerConstructor`
- **默认值**: `node`, when running tests, or `benchmark`, when running benchmarks

自定义测试运行程序的路径。这是一项高级功能，应与自定义库运行器一起使用。你可以在 [文档](/advanced/runner) 中阅读更多相关信息。

### benchmark

- **类型:** `{ include?, exclude?, ... }`

运行 `vitest bench` 时使用的选项。

#### benchmark.include

- **类型:** `string[]`
- **默认值:** `['**/*.{bench,benchmark}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']`

匹配包含基准测试文件的 glob 规则。

#### benchmark.exclude

- **类型:** `string[]`
- **默认值:** `['node_modules', 'dist', '.idea', '.git', '.cache']`

匹配排除基准测试文件的 glob 规则。

#### benchmark.includeSource

- **类型:** `string[]`
- **默认值:** `[]`

匹配包含内联基准测试文件的 glob 规则。此选项类似于 [`includeSource`](#includesource)。

定义后，Vitest 将运行所有匹配的文件，其中包含 `import.meta.vitest`。

#### benchmark.reporters

- **类型:** `Arrayable<BenchmarkBuiltinReporters | Reporter>`
- **默认值:** `'default'`

用于定义输出的自定义报告器。它可以包含一个或多个内置报告名称、报告实例和(或)自定义报告的路径。

#### benchmark.outputFile

- **类型:** `string | Record<string, string>`

当指定了 `--reporter=json` 选项时，可以将基准测试结果写入文件。
通过提供对象而不是字符串，您可以在使用多个报告器时定义单独的输出。

通过 CLI 命令提供对象，请使用以下语法: `--outputFile.json=./path --outputFile.junit=./other-path`.

### alias

- **类型:** `Record<string, string> | Array<{ find: string | RegExp, replacement: string, customResolver?: ResolverFunction | ResolverObject }>`

在测试内部运行时定义自定义别名。它们将与来自 `resolve.alias` 的别名合并。

### globals

- **类型:** `boolean`
- **默认值:** `false`
- **命令行终端:** `--globals`, `--globals=false`

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

如果你已经在项目中使用 [`unplugin-auto-import`](https://github.com/antfu/unplugin-auto-import)，你也可以直接用它来自动导入这些 API。

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

- **类型:** `'node' | 'jsdom' | 'happy-dom' | 'edge-runtime' | string`
- **默认值:** `'node'`
- **命令行终端:** `--environment=<env>`

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

如果你使用 [`--threads=false`](#threads) 标志运行 Vitest，你的测试将按以下顺序运行：`node`, `jsdom`, `happy-dom`, `edge-runtime`, `custom environments`。 这意味着，具有相同环境的每个测试都组合在一起，但仍按顺序运行。

从 0.23.0 开始，你还可以定义自定义环境。 当使用非内置环境时，Vitest 将尝试加载包 `vitest-environment-${name}`。 该包应导出一个具有 `Environment` 属性的对象：

```ts
import type { Environment } from 'vitest'

export default <Environment>{
  name: 'custom',
  setup() {
    // custom setup
    return {
      teardown() {
        // called after all tests with this env have been run
      },
    }
  },
}
```

Vitest 还通过 `vitest/environments` 入口导出 `builtinEnvironments`，以防你只想扩展它。 你可以在 [测试环境指南](/guide/environment) 中阅读有关扩展测试环境的更多信息。

### environmentOptions

- **类型:** `Record<'jsdom' | string, unknown>`
- **默认值:** `{}`

这些选项被传递给当前 [`environment`](/#environment) 的 `setup` 方法。 默认情况下，如果你将其用作测试环境，则只能配置 JSDOM 选项。

### environmentMatchGlobs

- **Type:** `[string, EnvironmentName][]`
- **Default:** `[]`

Automatically assign environment based on globs. The first match will be used.

For example:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environmentMatchGlobs: [
      // all tests in tests/dom will run in jsdom
      ['tests/dom/**', 'jsdom'],
      // all tests in tests/ with .edge.test.ts will run in edge-runtime
      ['**/*.edge.test.ts', 'edge-runtime'],
      // ...
    ],
  },
})
```

### poolMatchGlobs

- **Type:** `[string, 'threads' | 'child_process'][]`
- **Default:** `[]`
- **Version:** Since Vitest 0.29.4

Automatically assign pool in which tests will run based on globs. The first match will be used.

For example:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    poolMatchGlobs: [
      // all tests in "worker-specific" directory will run inside a worker as if you enabled `--threads` for them,
      ['**/tests/worker-specific/**', 'threads'],
      // all other tests will run based on "threads" option, if you didn't specify other globs
      // ...
    ]
  }
})
```

### update

- **类型:** `boolean`
- **默认值:** `false`
- **命令行终端:** `-u`, `--update`, `--update=false`

更新快照文件。这将更新所有更改的快照并删除过时的快照。

### watch

- **类型:** `boolean`
- **默认值:** `true`
- **命令行终端:** `-w`, `--watch`, `--watch=false`

启动监听模式

### root

- **类型:** `string`
- **命令行终端:** `-r <path>`, `--root=<path>`

项目的根目录

### reporters

- **类型:** `Reporter | Reporter[]`
- **默认值:** `'default'`
- **命令行终端:** `--reporter=<name>`, `--reporter=<name1> --reporter=<name2>`

用于输出的自定义 reporters 。 Reporters 可以是 [一个 Reporter 实例](https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/types/reporter.ts) 或选择内置的 reporters 字符串：

- `'default'` - 当他们经过测试套件
- `'verbose'` - 保持完整的任务树可见
- `'dot'` - 将每个任务显示为一个点
- `'junit'` - JUnit XML 报告器（你可以使用 `VITEST_JUNIT_SUITE_NAME` 环境变量配置 `test suites` 标签名称）
- `'json'` - 给出一个简单的 JSON 总结
- `'html'` - 根据 [`@vitest/ui`](/guide/ui) 输出 HTML 报告
- `'hanging-process'` - 如果 Vitest 无法安全退出进程，则显示挂起进程列表。 这可能是一个复杂的操作，只有在 Vitest 始终无法退出进程时才启用它
- 自定义报告的路径 (例如 `'./path/to/reporter.ts'`, `'@scope/reporter'`)

### outputTruncateLength

- **类型:** `number`
- **默认值:** `stdout.columns || 80`
- **命令行终端:** `--outputTruncateLength=<length>`, `--output-truncate-length=<length>`

设置截断输出差异的字符行数为 `stdout.columns` 或者最多 `80` 个字符。 你可能希望对此进行调整，取决于你的终端窗口宽度。为此，Vitest 包括 `+-` 字符和空格。例如，如果将其设置为 `6`，你可能会看到此差异：

```diff
// actual line: "Text that seems correct"
- Text...
+ Test...
```

### outputDiffLines

- **类型:** `number`
- **默认值:** `15`
- **命令行终端:** `--outputDiffLines=<lines>`, `--output-diff-lines=<lines>`

指定输出差线的数量，最多 `15` 个。当决定停止时，Vitest 统计所有 `+-` 行。例如，如果将其设置为 `3`，你可能会看到此差异：

```diff
- test: 1,
+ test: 2,
- obj: '1',
...
- test2: 1,
+ test2: 1,
- obj2: '2',
...
```

### outputDiffMaxLines

- **类型:** `number`
- **默认值:** `50`
- **命令行终端:** `--outputDiffMaxLines=<lines>`, `--output-diff-max-lines=<lines>`
- **版本:** 从 Vitest 0.26.0 开始支持

指定差异窗口中显示的最大行数。请注意，如果你有一个包含许多小差异的大对象，可能不会一次看到所有这些差异。

### outputDiffMaxSize

- **类型:** `number`
- **默认值:** `10000`
- **命令行终端:** `--outputDiffMaxSize=<length>`, `--output-diff-max-size=<length>`
- **版本:** 从 Vitest 0.26.0 开始支持

指定差异发生之前字符串化对象的最大长度。Vitest 尝试在执行差异之前将对象字符串化，但如果对象太大，它会减少对象的深度以适应此限制。 因此，如果对象太大或嵌套过多，你可能看不到差异。

增加此限制可以增加差异的持续时间。

### outputFile

- **类型:** `string | Record<string, string>`
- **命令行终端:** `--outputFile=<path>`, `--outputFile.json=./path`

当指定 `--reporter=json`、`--reporter=html` 或 `--reporter=junit` 时，将测试结果写入一个文件。通过提供对象而不是字符串，你可以在使用多个报告器时定义单独的输出。

### threads

- **类型:** `boolean`
- **默认值:** `true`
- **命令行终端:** `--threads`, `--threads=false`

通过使用 [tinypool](https://github.com/tinylibs/tinypool)（[Piscina](https://github.com/piscinajs/piscina) 的轻量级分支）可以启用多线程。在 Vitest 0.29.0 之前，Vitest 仍在工作线程内运行测试，即使禁用了此选项。从 0.29.0 开始，如果禁用此选项，Vitest 将使用 `child_process` 生成一个进程以在内部运行测试，这意味着你可以使用 `process.chdir` 和其他在 worker 中不可用的 API。如果你想恢复到以前的行为，请改用 `--single-thread` 选项。

禁用此选项也会禁用模块隔离，这意味着具有相同环境的所有测试都在单个子进程中运行。

### singleThread

- **类型:** `boolean`
- **默认值:** `false`
- **版本:** 从 Vitest 0.29.0 开始支持

在单个工作线程内使用相同环境运行所有测试。这将禁用内置模块隔离（你的源代码或 [inlined](#deps-inline) 代码仍将针对每个测试重新评估），但可以提高测试性能。在 Vitest 0.29.0 之前，这等同于使用 `--no-threads`。

:::warning
尽管此选项会强制测试一个接一个地运行，但此选项与 Jest 的 --runInBand 不同。Vitest 使用 worker 不仅可以并行运行测试，还可以提供隔离。通过禁用此选项，你的测试将按顺序运行，但在相同的全局上下文中，因此你必须自己提供隔离。

如果你依赖全局状态（前端框架通常这样做）或者你的代码依赖于为每个测试单独定义的环境，这可能会导致各种问题。但是可以提高你的测试速度（最多快 3 倍），它不一定依赖于全局状态或可以轻松绕过它。
:::

### maxThreads

- **类型:** `number`
- **默认值:** 可用的 CPU 数量

允许的最大线程数。你也可以使用 `VITEST_MAX_THREADS` 环境变量。

### minThreads

- **类型:** `number`
- **默认值:** 可用的 CPU 数量

允许的最小线程数。你也可以使用 `VITEST_MIN_THREADS` 环境变量。

### useAtomics

- **类型:** `boolean`
- **默认值:** `false`
- **版本:** 从 Vitest 0.28.3 开始支持

使用 Atomics 来同步线程。

这在某些情况下可以提高性能，但可能会在旧的 Node 版本中抛出错误。

### testTimeout

<<<<<<< HEAD
- **类型:** `number`
- **默认值:** `5000`
=======
- **Type:** `number`
- **Default:** `5000`
- **CLI:** `--test-timeout=5000`
>>>>>>> 3080d9e788fa2a318ae1b93129e16351b991a6f4

测试的默认超时时间（以毫秒为单位）。

### hookTimeout

- **类型:** `number`
- **默认值:** `10000`

钩子(hook)的默认超时时间（以毫秒为单位）。

### teardownTimeout

- **类型:** `number`
- **默认值:** `1000`

Vitest 关闭时等待关闭的默认超时时间，以毫秒为单位

### silent

- **类型:** `boolean`
- **默认值:** `false`
- **命令行终端:** `--silent`, `--silent=false`

静默模式下启动测试。

### setupFiles

- **类型:** `string | string[]`

setup 文件的路径。它们将运行在每个测试文件之前。

:::info
更改配置文件将触发所有测试的重新运行。
:::

你可以在内部使用 `process.env.VITEST_WORKER_ID` (类似整数的字符串）来区分线程（如果`threads: false`，那么这个值将永远会是`1`）。

:::tip 提醒
请注意，如果你正在运行 [`--threads=false`](#threads)，则此设置文件将在同一全局范围内多次运行。 这意味着，你在每次测试之前都在访问同一个全局对象，因此请确保你做的事情没有超出你的需要。
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
- **命令行终端:** `--isolate`, `--isolate=false`

是否为每个测试文件构建隔离环境。 如果你禁用 [`--threads`](#threads)，它将不会工作。

### coverage

- **类型:** `CoverageC8Options | CoverageIstanbulOptions`
- **默认值:** `undefined`

你可以使用 [`c8`](https://github.com/bcoe/c8), [`istanbul`](https://istanbul.js.org/) 或 [一个自定义覆盖率方案](/guide/coverage#custom-coverage-provider) 收集测试覆盖率。

你可以使用点符号向 CLI 提供覆盖选项：

```sh
npx vitest --coverage.enabled --coverage.provider=istanbul --coverage.all
```

::: warning
如果你使用带点符号的覆盖选项，请不要忘记指定 `--coverage.enabled`。 在这种情况下，不要提供单个 --coverage 选项。
:::

#### coverage.provider

- **类型:** `'c8' | 'istanbul' | 'custom'`
- **默认值:** `'c8'`
- **命令行终端:** `--coverage.provider=<provider>`

使用 `provider` 选择收集测试覆盖率的工具。

#### coverage.enabled

- **类型:** `boolean`
- **默认值:** `false`
- **可用的测试提供者:** `'c8' | 'istanbul'`
- **命令行终端:** `--coverage.enabled`, `--coverage.enabled=false`

是否启用收集测试覆盖率。可以使用 `--coverage` 覆盖 CLI 选项。

#### coverage.include

- **类型:** `string[]`
- **默认值:** `['**']`
- **可用的测试提供者:** `'c8' | 'istanbul'`
- **命令行终端:** `--coverage.include=<path>`, `--coverage.include=<path1> --coverage.include=<path2>`

匹配包含测试覆盖率的 glob 规则

#### coverage.extension

- **类型:** `string | string[]`
- **默认值:** `['.js', '.cjs', '.mjs', '.ts', '.mts', '.cts', '.tsx', '.jsx', '.vue', '.svelte']`
- **可用的测试提供者:** `'c8' | 'istanbul'`
- **命令行终端:** `--coverage.extension=<extension>`, `--coverage.extension=<extension1> --coverage.extension=<extension2>`

#### coverage.exclude

- **类型:** `string[]`
- **默认值:**

```js
[
  'coverage/**',
  'dist/**',
  'packages/*/test{,s}/**',
  '**/*.d.ts',
  'cypress/**',
  'test{,s}/**',
  'test{,-*}.{js,cjs,mjs,ts,tsx,jsx}',
  '**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx}',
  '**/*{.,-}spec.{js,cjs,mjs,ts,tsx,jsx}',
  '**/__tests__/**',
  '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
  '**/.{eslint,mocha,prettier}rc.{js,cjs,yml}',
]
```

- **可用的测试提供者:** `'c8' | 'istanbul'`
- **命令行终端:** `--coverage.exclude=<path>`, `--coverage.exclude=<path1> --coverage.exclude=<path2>`

使用全局模式排除在覆盖范围之外的文件列表。

#### coverage.all

- **类型:** `boolean`
- **默认值:** `false`
- **可用的测试提供者:** `'c8' | 'istanbul'`
- **命令行终端:** `--coverage.all`, --coverage.all=false`

是否将所有文件（包括未测试的文件）包括在报告中。

#### coverage.clean

- **类型:** `boolean`
- **默认值:** `true`
- **可用的测试提供者:** `'c8' | 'istanbul'`
- **命令行终端:** `--coverage.clean`, `--coverage.clean=false`

运行测试之前是否清除覆盖率结果

#### coverage.cleanOnRerun

- **类型:** `boolean`
- **默认值:** `true`
- **可用的测试提供者:** `'c8' | 'istanbul'`
- **命令行终端:** `--coverage.cleanOnRerun`, `--coverage.cleanOnRerun=false`

是否将所有文件（包括未测试的文件）包括在报告中。

#### clean

- **类型:** `boolean`
- **默认值:** `true`
- **可用的测试提供者:** `'c8' | 'istanbul'`

运行测试之前是否清除覆盖率结果

#### cleanOnRerun

- **类型:** `boolean`
- **默认值:** `false`
- **可用的测试提供者:** `'c8' | 'istanbul'`

监视重新运行时是否清除覆盖率报告

#### coverage.reportsDirectory

- **类型:** `string`
- **默认值:** `'./coverage'`
- **可用的测试提供者:** `'c8' | 'istanbul'`
- **命令行终端:** `--coverage.reportsDirectory=<path>`

配置测试覆盖率报告写入的目录。

#### coverage.reporter

- **类型:** `string | string[] | [string, {}][]`
- **默认值:** `['text', 'html', 'clover', 'json']`
- **可用的测试提供者:** `'c8' | 'istanbul'`
- **命令行终端:** `--coverage.reporter=<reporter>`, `--coverage.reporter=<reporter1> --coverage.reporter=<reporter2>`

配置要使用的测试覆盖率报告器。查看 [istanbul 文档](https://istanbul.js.org/docs/advanced/alternative-reporters/) 来了解报告详情。有关报告特定选项的详细信息，请参阅 [`@types/istanbul-reporter`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/276d95e4304b3670eaf6e8e5a7ea9e265a14e338/types/istanbul-reports/index.d.ts)。

该报告器支持三种不同的类型:

- 单个报告器: `{ reporter: 'html' }`
- 无配置的多个报告器: `{ reporter: ['html', 'json'] }`
- 有配置的单个或多个报告器:
  <!-- eslint-skip -->
  ```ts
  {
    reporter: [
      ["lcov", { projectRoot: "./src" }],
      ["json", { file: "coverage.json" }],
      ["text"],
    ];
  }
  ```

#### coverage.skipFull

- **类型:** `boolean`
- **默认值:** `false`
- **可用的测试提供者:** `'c8' | 'istanbul'`
- **命令行终端:** `--coverage.skipFull`, `--coverage.skipFull=false`

是否显示具有 100% 语句、分支和函数的测试覆盖率的文件。

#### coverage.perFile

- **类型:** `boolean`
- **默认值:** `false`
- **可用的测试提供者:** `'c8' | 'istanbul'`
- **命令行终端:** `--coverage.perFile`, `--coverage.perFile=false`

检查每个文件的阈值。
有关实际阈值，请参见 `lines`, `functions`, `branches` and `statements` 。

#### coverage.thresholdAutoUpdate

- **类型:** `boolean`
- **默认值:** `false`
- **可用的测试提供者:** `'c8' | 'istanbul'`
- **命令行终端:** `--coverage.thresholdAutoUpdate=<boolean>`

当前覆盖率高于配置的阈值时，将阈值 `lines`、 `functions`、`branches` 和 `statements` 更新到配置文件。
此选项有助于在提高覆盖率时维持阈值。

#### coverage.lines

- **类型:** `number`
- **可用的测试提供者:** `'c8' | 'istanbul'`
- **命令行终端:** `--coverage.lines=<number>`

行的阈值。
参考 [istanbul documentation](https://github.com/istanbuljs/nyc#coverage-thresholds) 来了解详情。

#### coverage.functions

- **类型:** `number`
- **可用的测试提供者:** `'c8' | 'istanbul'`
- **命令行终端:** `--coverage.functions=<number>`

函数的阈值。
参考 [istanbul documentation](https://github.com/istanbuljs/nyc#coverage-thresholds) 来了解详情。

#### coverage.branches

- **类型:** `number`
- **可用的测试提供者:** `'c8' | 'istanbul'`
- **命令行终端:** `--coverage.branches=<number>`

分支的阈值。
参考 [istanbul documentation](https://github.com/istanbuljs/nyc#coverage-thresholds) 来了解详情。

#### coverage.statements

- **类型:** `number`
- **可用的测试提供者:** `'c8' | 'istanbul'`
- **命令行终端:** `--coverage.statements=<number>`

语句的阈值。
参考 [istanbul documentation](https://github.com/istanbuljs/nyc#coverage-thresholds) 来了解详情。

#### coverage.allowExternal

- **类型:** `boolean`
- **默认值:** `false`
- **可用的测试提供者:** `'c8'`
- **命令行终端:** `--coverage.allowExternal`, `--coverage.allowExternal=false`

是否允许来自 cwd 外部的文件。

#### coverage.excludeNodeModules

- **类型:** `boolean`
- **默认值:** `true`
- **可用的测试提供者:** `'c8'`
- **命令行终端:** `--coverage.excludeNodeModules`, `--coverage.excludeNodeModules=false`

排除 `/node_modules/` 下的覆盖范围。

#### coverage.src

- **类型:** `string[]`
- **默认值:** `process.cwd()`
- **可用的测试提供者:** `'c8'`
- **命令行终端:** `--coverage.src=<path>`

指定启用 `--all` 时使用的目录。

#### coverage.100

- **类型:** `boolean`
- **默认值:** `false`
- **可用的测试提供者:** `'c8'`
- **命令行终端:** `--coverage.100`, `--coverage.100=false`

为 `--check-coverage --lines 100 --functions 100 --branches 100 --statements 100` 设置的快捷方式。

#### coverage.ignoreClassMethods

- **类型:** `string[]`
- **默认值:** `[]`
- **可用的测试提供者:** `'istanbul'`
- **命令行终端:** `--coverage.ignoreClassMethods=<method>`

设置为要忽略覆盖率的类方法名称数组。
参考 [istanbul documentation](https://github.com/istanbuljs/nyc#ignoring-methods) 来了解详情。

#### coverage.watermarks

- **类型:**
<!-- eslint-skip -->

```ts
{
  statements?: [number, number],
  functions?: [number, number],
  branches?: [number, number],
  lines?: [number, number]
}
```

- **默认值:**
<!-- eslint-skip -->

```ts
{
  statements: [50, 80],
  functions: [50, 80],
  branches: [50, 80],
  lines: [50, 80]
}
```

指定语句、行、分支和函数的水印位置。

##### all

- **类型:** `boolean`
- **默认值:** false
- **可用的测试提供者:** `'istanbul'`

指定语句、行、分支和函数的水印位置。参考 [istanbul documentation](https://github.com/istanbuljs/nyc#high-and-low-watermarks) 来了解详情。

#### coverage.customProviderModule

- **类型:** `string`
- **可用的测试提供者:** `'custom'`
- **命令行终端:** `--coverage.customProviderModule=<path or module name>`

指定自定义覆盖率提供者的模块名称或路径。有关详细信息，请参阅[指南 - 自定义覆盖率提供者](/guide/coverage#custom-coverage-provider)。

### testNamePattern

- **类型** `string | RegExp`
- **命令行终端:** `-t <pattern>`, `--testNamePattern=<pattern>`, `--test-name-pattern=<pattern>`

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
- **默认值:** `false`
- **命令行终端:** `--open`, `--open=false`

打开 Vitest UI (WIP: 赞助者计划可用)

### api

- **类型:** `boolean | number`
- **默认值:** `false`
- **命令行终端:** `--api`, `--api.port`, `--api.host`, `--api.strictPort`

提供 API 服务的端口。当设置为 true 时，默认端口为 51204

### clearMocks

- **类型:** `boolean`
- **默认值:** `false`

是否在每次测试前对所有监听(Spy)调用 [`.mockClear()`](/api/mock#mockclear)。这将清除模拟历史记录，但不会将其实现重置为默认值。

### mockReset

- **类型:** `boolean`
- **默认值:** `false`

是否在每次测试之前对所有监听(Spy)调用 [`.mockReset()`](/api/mock#mockreset)。 这将清除模拟历史并将其实现重置为空函数（将返回`undefined`）。

### restoreMocks

- **类型:** `boolean`
- **默认值:** `false`

是否在每次测试之前对所有监听(Spy)调用 [`.mockRestore()`](/api/#mockrestore)。 这将清除模拟历史并将其实现重置为原始历史。

### unstubEnvs

- **类型:** `boolean`
- **默认值:** `false`
- **版本:** 从 Vitest 0.26.0 开始支持

将在每次测试前调用 [`vi.unstubAllEnvs`](/api/#vi-unstuballenvs)。

### unstubGlobals

- **类型:** `boolean`
- **默认值:** `false`
- **版本:** 从 Vitest 0.26.0 开始支持

将在每次测试前调用 [`vi.unstubAllGlobals`](/api/#vi-unstuballglobals)。

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
- **默认值:** _除了 `transformMode.ssr` 以外的所有文件_

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
- **命令行终端:** `--allowOnly`, `--allowOnly=false`

允许标记为 only 的测试和套件。

### dangerouslyIgnoreUnhandledErrors

- **类型**: `boolean`
- **默认值**: `false`
- **命令行终端:** `--dangerouslyIgnoreUnhandledErrors` `--dangerouslyIgnoreUnhandledErrors=false`

忽略发生的任何未处理的错误。

### passWithNoTests

- **类型**: `boolean`
- **默认值**: `false`
- **命令行终端:** `--passWithNoTests`, `--passWithNoTests=false`

如果没有找到测试，Vitest 不会失败。

### logHeapUsage

- **类型**: `boolean`
- **默认值**: `false`
- **命令行终端:** `--logHeapUsage`, `--logHeapUsage=false`

每次测试后显示堆的使用情况。用于调试内存是否泄漏。

### css

- **类型**: `boolean | { include?, exclude?, modules? }`

配置是否应处理 CSS。 排除后，CSS 文件将被替换为空字符串以绕过后续处理。 CSS 模块将返回一个代理以不影响运行时。

#### css.include

- **类型**: `RegExp | RegExp[]`
- **默认值**: `[]`

将返回匹配正则表达式并将由 Vite 管道处理的实际 CSS 文件。

:::tip
如果需要处理所有 CSS 文件，请使用 `/.+/`。
:::

#### css.exclude

- **类型**: `RegExp | RegExp[]`
- **默认值**: `[]`

将返回匹配正则表达式的空 CSS 文件。

#### css.modules

- **类型**: `{ classNameStrategy? }`
- **默认值**: `{}`

#### css.modules.classNameStrategy

- **类型**: `'stable' | 'scoped' | 'non-scoped'`
- **默认值**: `'stable'`

如果你决定处理 CSS 文件，你可以配置 CSS 模块中的类名是否在限定范围内。 默认情况下，Vitest 会导出一个代理，绕过 CSS 模块处理。 你可以选择以下选项之一：

- `stable`: 类名将生成为`_${name}_${hashedFilename}`，这意味着如果 CSS 内容发生变化，生成的类将保持不变，但如果文件名被修改，或者文件名将发生变化 被移动到另一个文件夹。 如果你使用快照功能，此设置很有用。
- `scoped`: 类名将照常生成，遵照 `css.modules.generateScopeName` 方法，如果你有的话。 默认情况下，文件名将生成为`_${name}_${hash}`，其中 hash 包括文件名和文件内容。
- `non-scoped`: 类名将保留 CSS 中定义的名称。

::: warning
在默认的情况下，Vitest 导出代理会绕过 CSS 模块处理。 如果你依赖类的 CSS 属性，就必须使用 `include` 选项启用 CSS 处理。
:::

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

- **类型**: `{ sequencer?, shuffle?, seed?, hooks?, setupFiles? }`

配置测试运行顺序的选项。

你可以使用点符号向 CLI 提供序列选项：

```sh
npx vitest --sequence.shuffle --sequence.seed=1000
```

#### sequence.sequencer

- **类型**: `TestSequencerConstructor`
- **默认值**: `BaseSequencer`

定义分片和排序的自定义类。你可以从 `vitest/node` 扩展 `BaseSequencer`，如果你只需要重新定义 `sort` 和 `shard` 方法之一，但两者都应该存在。

分片是在排序之前进行的，并且只有提供了 `--shard` 选项的情况下才会生效。

#### sequence.shuffle

- **类型**: `boolean`
- **默认值**: `false`
- **命令行终端**: `--sequence.shuffle`, `--sequence.shuffle=false`

如果你希望测试随机运行，可以使用此选项或 CLI 参数 [`--sequence.shuffle`](/guide/cli) 启用它。

Vitest 通常使用缓存对测试进行排序，因此长时间运行的测试会更早开始 - 这会使测试运行得更快。 如果你的测试将以随机顺序运行，你将失去这种性能改进，但跟踪意外依赖于先前运行的测试可能很有用。

#### sequence.seed

- **类型**: `number`
- **默认值**: `Date.now()`
- **命令行终端**: `--sequence.seed=1000`

如果测试以随机顺序运行，则设置随机化种子。

#### sequence.hooks

- **类型**: `'stack' | 'list' | 'parallel'`
- **默认值**: `'parallel'`
- **命令行终端**: `--sequence.hooks=<value>`

更改钩子的执行顺序。

- `stack` 将以相反的顺序排列 "after" 钩子，"before" 钩子将按照它们定义的顺序运行
- `list` 将按照定义的顺序对所有钩子进行排序
- `parallel` 将并行运行单个组中的钩子（父套件中的钩子仍将在当前套件的钩子之前运行）

#### sequence.setupFiles

- **类型**: `'list' | 'parallel'`
- **默认值**: `'parallel'`
- **命令行终端**: `--sequence.setupFiles=<value>`
- **版本**: Since Vitest 0.29.3

更改安装文件的执行顺序。

- `list` 将按照定义的顺序运行安装文件
- `parallel` 将并行运行设置文件

### typecheck

用于配置 [typechecking](/guide/testing-types) 测试环境的选项。

#### typecheck.checker

- **类型**: `'tsc' | 'vue-tsc' | string`
- **默认值**: `tsc`

设置类型检查的检测器。Vitest 将根据类型生成具有某些参数的进程，以便于解析。 Checker 应该实现与 `tsc` 相同的输出格式。

你需要安装一个包才能使用 typecheker:

- `tsc` requires `typescript` package
- `vue-tsc` requires `vue-tsc` package

你还可以将路径传递到自定义二进制文件或命令名称，该路径会产生与 `tsc --noEmit --pretty false` 相同的输出。

#### typecheck.include

- **类型**: `string[]`
- **默认值**: `['**/*.{test,spec}-d.{ts,js}']`

匹配包含测试文件的 glob 规则。

#### typecheck.exclude

- **类型**: `string[]`
- **默认值**: `['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**']`

匹配排除测试文件的 glob 规则。

#### typecheck.allowJs

- **类型**: `boolean`
- **默认值**: `false`

检查有 `@ts-check` 注释的 JS 文件。 如果你在 tsconfig 中启用它，则不会覆盖它。

#### typecheck.ignoreSourceErrors

- **类型**: `boolean`
- **默认值**: `false`

如果 Vitest 在测试文件之外发现错误，不要失败。 这根本不会向你显示非测试错误。

默认情况下，如果 Vitest 发现源错误，它将测试套件中抛出失败。

#### typecheck.tsconfig

- **类型**: `string`
- **默认值**: _tries to find closest tsconfig.json_

自定义 tsconfig 的路径，相对于项目根目录。

### slowTestThreshold

- **类型**: `number`
- **默认值**: `300`

如果测试被认为是缓慢的，那么会在报告结果中显示毫秒值。
