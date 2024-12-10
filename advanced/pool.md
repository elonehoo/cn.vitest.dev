# Custom Pool

::: warning
<<<<<<< HEAD
这是高级 API。如果你只想要[运行测试](/guide/)，你可能不需要这个。它主要被库的作者使用。
=======
This is an advanced and very low-level API. If you just want to [run tests](/guide/), you probably don't need this. It is primarily used by library authors.
>>>>>>> 3158871632d11ca43bea7c2f8c72bc95feac15cb
:::

Vitest 在默认情况下以多种方式运行测试：

- `threads` 使用 `node:worker_threads` 运行测试（通过新的 worker 上下文提供隔离）
- `forks` 使用 `node:child_process` 运行测试（通过新的 `child_process.fork` 进程提供隔离）
- `vmThreads` 使用 `node:worker_threads` 运行测试（但是通过 `vm` 模块而不是新的 worker 上下文提供隔离）
- `browser` 使用浏览器提供程序运行测试
- `typescript` 在测试中运行类型检查

你可以通过指定文件路径来提供自己的池：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // 默认情况下，将使用自定义池运行每个文件
    pool: './my-custom-pool.ts',
    // 可以使用 `poolOptions` 对象提供选项
    poolOptions: {
      myCustomPool: {
        customProperty: true,
      },
    },
  },
})
```

如果我们在不同 pools 中运行测试，可以使用 [workspace](/guide/workspace) 功能:

```ts [vitest.config.ts]
export default defineConfig({
  test: {
    workspace: [
      {
        extends: true,
        test: {
          pool: 'threads',
        },
      },
    ],
  },
})
```

::: info
<<<<<<< HEAD
workspace`字段是在 Vitest 3 中引入的。在 [Vitest 3 之前的版本](https://v2.vitest.dev/)中定义工作区，需要创建一个单独的 `vitest.workspace.ts` 文件。
=======
The `workspace` field was introduced in Vitest 3. To define a workspace in [Vitest 2](https://v2.vitest.dev/), create a separate `vitest.workspace.ts` file.
>>>>>>> 3158871632d11ca43bea7c2f8c72bc95feac15cb
:::

## API

在 `pool` 选项中指定的文件应该导出一个函数（可以是异步的），该函数接受 `Vitest` 接口作为其第一个选项。这个函数需要返回一个与 `ProcessPool` 接口匹配的对象：

```ts
import type { ProcessPool, TestSpecification } from 'vitest/node'

export interface ProcessPool {
  name: string
  runTests: (files: TestSpecification[], invalidates?: string[]) => Promise<void>
  collectTests: (files: TestSpecification[], invalidates?: string[]) => Promise<void>
  close?: () => Promise<void>
}
```

这个函数只会被调用一次（除非服务器配置被更新），通常最好在这个函数内初始化测试所需的一切，并在调用 `runTests` 时重复使用它。

<<<<<<< HEAD
Vitest 在安排运行新测试时调用 `runTest`。如果 `files` 为空，将不会调用它。第一个参数是一个元组数组：第一个元素是对工作区项目的引用，第二个元素是测试文件的绝对路径。在调用 `runTests` 之前，文件将使用 [`sequencer`](/config/#sequence.sequencer) 进行排序。可能（但不太可能）会有相同的文件出现两次，但它们将始终属于不同的项目 - 这是通过 [`vitest.workspace.ts`](/guide/workspace) 配置实现的。

Vitest 会等到 `runTests` 执行完毕后才结束运行（即只有在 `runTests` 解决后才会触发 [`onFinished`](/guide/reporters)）。
=======
Vitest calls `runTest` when new tests are scheduled to run. It will not call it if `files` is empty. The first argument is an array of [TestSpecifications](/advanced/api/test-specification). Files are sorted using [`sequencer`](/config/#sequence-sequencer) before `runTests` is called. It's possible (but unlikely) to have the same file twice, but it will always have a different project - this is implemented via [`vitest.workspace.ts`](/guide/workspace) configuration.

Vitest will wait until `runTests` is executed before finishing a run (i.e., it will emit [`onFinished`](/advanced/reporters) only after `runTests` is resolved).
>>>>>>> 3158871632d11ca43bea7c2f8c72bc95feac15cb

如果你正在使用自定义池，需要自行提供测试文件及其结果 - 可以参考 [`vitest.state`](https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/node/state.ts)（最重要的是 `collectFiles` 和 `updateTasks`）。Vitest 使用 `@vitest/runner` 包中的 `startTests` 函数来执行这些操作。

如果通过 CLI 命令调用 `vitest.collect` 或 `vitest list`，则 Vitest 将调用 `collectTests`。它的工作方式与 `runTests` 相同，但你不必运行测试回调，只需通过调用 `vitest.state.collectFiles(files)` 来报告它们的任务。

要在不同的进程之间进行通信，可以使用 `vitest/node` 中的 `createMethodsRPC` 创建方法对象，并使用你喜欢的任何形式的通信。例如，要将 WebSockets 与 `birpc` 一起使用，你可以编写以下内容：

```ts
import { createBirpc } from 'birpc'
import { parse, stringify } from 'flatted'
import { TestProject, createMethodsRPC } from 'vitest/node'

function createRpc(project: TestProject, wss: WebSocketServer) {
  return createBirpc(
    createMethodsRPC(project),
    {
      post: msg => wss.send(msg),
      on: fn => wss.on('message', fn),
      serialize: stringify,
      deserialize: parse,
    },
  )
}
```

<<<<<<< HEAD
为了确保收集每个测试，你可以调用 `ctx.state.collectFiles` 并将其交给 Vitest 报告器：

```ts
async function runTests(project: TestProject, tests: string[]) {
  // ... running tests, put into "files" and "tasks"
  const methods = createMethodsRPC(project)
  await methods.onCollected(files)
  // 大多数报告都依赖于在 `onTaskUpdate` 中更新结果
  await methods.onTaskUpdate(tasks)
}
```

可以在 [pool/custom-pool.ts](https://github.com/vitest-dev/vitest/blob/main/test/run/pool-custom-fixtures/pool/custom-pool.ts) 中看到一个简单的示例。
=======
You can see a simple example of a pool made from scratch that doesn't run tests but marks them as collected in [pool/custom-pool.ts](https://github.com/vitest-dev/vitest/blob/main/test/cli/fixtures/custom-pool/pool/custom-pool.ts).
>>>>>>> 3158871632d11ca43bea7c2f8c72bc95feac15cb
