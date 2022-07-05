# 开始

## 总览

Vitest 是一个由 Vite 提供支持的极速单元测试框架。

你可以在 [为什么是 Vitest](./why) 中了解有关该项目背后的基本原理的更多信息。

## 在线试用 Vitest

你可以在 [StackBlitz](https://vitest.new) 上在线尝试 Vitest 。它直接在浏览器中运行 Vitest，它几乎与本地设置相同，但不需要在你的计算机上安装任何东西。

## 将 Vitest 安装到项目

```bash
# 使用 npm
npm install -D vitest
# 使用 yarn
yarn add -D vitest
# 使用 pnpm
pnpm add -D vitest
```

:::tip 提示
Vitest 需要 Vite >=v2.7.10 和 Node >=v14
:::

## 配置 Vitest

Vitest 的主要优势之一是它与 Vite 的统一配置。如果存在，`vitest` 将读取您的根目录 `vite.config.ts` 以匹配插件并设置为您的 Vite 应用程序。例如，你的 Vite 有 [resolve.alias](https://vitejs.dev/config/#resolve-alias) 和 [plugins](https://vitejs.dev/guide/using-plugins.html) 的配置将会在 Vitest 中起作用。如果你想在测试期间想要不同的配置，你可以:

- 创建 `vitest.config.ts`，优先级将会最高。
- 将 `--config` 选项传递给 CLI，例如 `vitest --config ./path/to/vitest.config.ts`。
- 在 `defineConfig` 上使用 `process.env.VITEST` 或 `mode` 属性（如果没有被覆盖，将设置为 `test`）有条件地在 `vite.config.ts` 中应用不同的配置。

如果要配置 `vitest` 本身，请在你的 Vite 配置中添加 `test` 属性。 你还需要使用 [三斜线命令](https://www.tslang.cn/docs/handbook/triple-slash-directives.html) ，同时如果是从 `vite` 本身导入 `defineConfig`，请在配置文件的顶部加上三斜线命令。

```ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    // ...
  },
})
```

可以参阅 [配置参考](../config/) 中的配置选项列表

## 命令行

在安装了 Vitest 的项目中，你可以在 npm 脚本中使用 `vitest` 脚本，或者直接使用 `npx vitest` 运行它。 以下是脚手架 Vitest 项目中的默认 npm 脚本：

<!-- prettier-ignore -->
```json
{
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
}
```

要在不监视文件更改的情况下运行一次测试，请使用 `vitest run`。
你还可以指定其他 CLI 选项，例如 `--port` 或 `--https`。 有关 CLI 选项的完整列表，可以在你的项目中运行 `npx vitest --help`。

了解更多有关 [命令行](./cli.md) 的更多信息

## IDE 集成

我们还提供了 Visual Studio Code 的官方扩展，以增强你使用 Vitest 的测试体验。

[从 VS Code 插件市场进行安装](https://marketplace.visualstudio.com/items?itemName=ZixuanChen.vitest-explorer)

了解更多有关 [IDE 集成](./ide.md) 的更多信息

## 示例

| 示例 | 源代码 | 演练场 |
|---|---|---|
| `basic` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/basic) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/basic?initialPath=__vitest__) |
| `graphql` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/graphql) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/graphql?initialPath=__vitest__) |
| `lit` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/lit) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/lit?initialPath=__vitest__) |
| `mocks` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/mocks) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/mocks?initialPath=__vitest__) |
| `nextjs` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/nextjs) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/nextjs?initialPath=__vitest__) |
| `puppeteer` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/puppeteer) | |
| `react-enzyme` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/react-enzyme) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/react-enzyme?initialPath=__vitest__) |
| `react-mui` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/react-mui) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/react-mui?initialPath=__vitest__) |
| `react-storybook` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/react-storybook) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/react-storybook?initialPath=__vitest__) |
| `react-testing-lib-msw` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/react-testing-lib-msw) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/react-testing-lib-msw?initialPath=__vitest__) |
| `react-testing-lib` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/react-testing-lib) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/react-testing-lib?initialPath=__vitest__) |
| `react` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/react) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/react?initialPath=__vitest__) |
| `ruby` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/ruby) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/ruby?initialPath=__vitest__) |
| `solid` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/solid) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/solid?initialPath=__vitest__) |
| `svelte` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/svelte) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/svelte?initialPath=__vitest__) |
| `vitesse` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/vitesse) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/vitesse?initialPath=__vitest__) |
| `vue-jsx` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/vue-jsx) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/vue-jsx?initialPath=__vitest__) |
| `vue` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/vue) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/vue?initialPath=__vitest__) |
| `vue2` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/vue2) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/vue2?initialPath=__vitest__) |

## 使用 Vitest 的项目

- [unocss](https://github.com/antfu/unocss)
- [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import)
- [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)
- [vitesse](https://github.com/antfu/vitesse)
- [vitesse-lite](https://github.com/antfu/vitesse-lite)
- [fluent-vue](https://github.com/demivan/fluent-vue)
- [vueuse](https://github.com/vueuse/vueuse)
- [milkdown](https://github.com/Saul-Mirone/milkdown)
- [gridjs-svelte](https://github.com/iamyuu/gridjs-svelte)
- [spring-easing](https://github.com/okikio/spring-easing)
- [bytemd](https://github.com/bytedance/bytemd)
- [faker](https://github.com/faker-js/faker)
- [million](https://github.com/aidenybai/million)
- [Vitamin](https://github.com/wtchnm/Vitamin)
- [neodrag](https://github.com/PuruVJ/neodrag)
- [svelte-multiselect](https://github.com/janosh/svelte-multiselect)
- [iconify](https://github.com/iconify/iconify)
- [tdesign-vue-next](https://github.com/Tencent/tdesign-vue-next)
- [cz-git](https://github.com/Zhengqbbb/cz-git)

<!--
For contributors:
We no longer accept new entries to this list a this moment.
Thanks for choosing Vitest!
-->

## 使用未发布的功能

如果你迫不及待想要体验最新的功能，可以自行克隆 [vitest 仓库](https://github.com/vitest-dev/vitest) 到本地机器上然后自行将其链接（将需要 [pnpm](https://pnpm.io/zh/)）：

```bash
git clone https://github.com/vitest-dev/vitest.git
cd vitest
pnpm install
cd packages/vitest
pnpm run build
pnpm link --global # 你可以使用你喜爱的任何包管理工具来设置这个步骤
```

然后，回到你的 Vitest 项目并运行 `pnpm link --global vitest`（或者使用你的其他包管理工具来全局链接 `Vitest`）。

## 社区

如果你有疑问或者需要帮助，可以到 [Discord](https://chat.vitest.dev) 和 [GitHub Discussions](https://github.com/vitest-dev/vitest/discussions) 社区来寻求帮助。

[cac's dot notation]: https://github.com/cacjs/cac#dot-nested-options
