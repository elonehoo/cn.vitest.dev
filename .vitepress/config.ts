import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'
import { version } from '../package.json'

import {
  contributing,
  discord,
  font,
  github,
  mastodon,
  ogImage,
  ogUrl,
  releases,
  twitter,
  vitestDescription,
  vitestName,
} from './meta'
import { pwa } from './scripts/pwa'
import { transformHead } from './scripts/transformHead'
import { teamMembers } from './contributors'

export default withPwa(
  defineConfig({
    lang: 'en-US',
    title: vitestName,
    description: vitestDescription,
    locales:{
      root: {
        label: '简体中文',
        lang: 'zh'
      },
      en: {
        label: 'English',
        lang: 'en',
        link: 'https://vitest.dev/'
      }
    },
    head: [
      ['meta', { name: 'theme-color', content: '#729b1a' }],
      ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
      [
        'link',
        {
          rel: 'alternate icon',
          href: '/favicon.ico',
          type: 'image/png',
          sizes: '16x16',
        },
      ],
      [
        'meta',
        {
          name: 'author',
          content: `${teamMembers
            .map(c => c.name)
            .join(', ')} and ${vitestName} contributors`,
        },
      ],
      [
        'meta',
        {
          name: 'keywords',
          content:
            'vitest, vite, test, coverage, snapshot, react, vue, preact, svelte, solid, lit, ruby, cypress, puppeteer, jsdom, happy-dom, test-runner, jest, typescript, esm, tinypool, tinyspy, c8, node',
        },
      ],
      ['meta', { property: 'og:title', content: vitestName }],
      ['meta', { property: 'og:description', content: vitestDescription }],
      ['meta', { property: 'og:url', content: ogUrl }],
      ['meta', { property: 'og:image', content: ogImage }],
      ['meta', { name: 'twitter:title', content: vitestName }],
      ['meta', { name: 'twitter:description', content: vitestDescription }],
      ['meta', { name: 'twitter:image', content: ogImage }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      [
        'link',
        {
          rel: 'preload',
          as: 'style',
          onload: 'this.onload=null;this.rel=\'stylesheet\'',
          href: font,
        },
      ],
      [
        'noscript',
        {},
        `<link rel="stylesheet" crossorigin="anonymous" href="${font}" />`,
      ],
      ['link', { rel: 'mask-icon', href: '/logo.svg', color: '#ffffff' }],
      [
        'link',
        {
          rel: 'apple-touch-icon',
          href: '/apple-touch-icon.png',
          sizes: '180x180',
        },
      ],
    ],
    socialLinks: [
      { icon: 'mastodon', link: mastodon },
      { icon: 'twitter', link: twitter },
      { icon: 'discord', link: discord },
      { icon: 'github', link: github },
    ],
    lastUpdated: true,
    markdown: {
      theme: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      },
    },
    themeConfig: {
      logo: '/logo.svg',

      editLink: {
        pattern: 'https://github.com/vitest-dev/vitest/tree/main/docs/:path',
        text: '为此页提供修改建议',
      },

      // algolia: {
      //   appId: 'ZTF29HGJ69',
      //   apiKey: '9c3ced6fed60d2670bb36ab7e8bed8bc',
      //   indexName: 'vitest',
      //   // searchParameters: {
      //   //   facetFilters: ['tags:en'],
      //   // },
      // },

      localeLinks: {
        text: '简体中文',
        items: [{ text: 'English', link: 'https://vitest.dev' }],
      },

      socialLinks: [
        { icon: 'twitter', link: twitter },
        { icon: 'discord', link: discord },
        { icon: 'github', link: github },
      ],

      footer: {
        message: 'Released under the MIT License.',
        copyright:
          'Copyright © 2021-PRESENT Anthony Fu, Matías Capeletto and Vitest contributors',
      },

      nav: [
        { text: '指南', link: '/guide/' },
        { text: 'API', link: '/api/' },
        { text: '配置', link: '/config/' },
        { text: 'Advanced', link: '/advanced/api' },
        {
          text: `v${version}`,
          items: [
            {
              text: '版本发布',
              link: releases,
            },
            {
              text: '社区指南',
              link: contributing,
            },
          ],
        },
      ],

      sidebar: {
        // TODO: bring sidebar of apis and config back
        '/advanced': [
          {
            text: 'Advanced',
            items: [
              {
                text: 'Vitest Node API',
                link: '/advanced/api',
              },
              {
                text: 'Runner API',
                link: '/advanced/runner',
              },
            ],
          },
        ],
        '/': [
          {
            text: '指南',
            items: [
              {
                text: '简介',
                link: '/guide/why',
              },
              {
                text: '快速起步',
                link: '/guide/',
              },
              {
                text: '主要功能',
                link: '/guide/features',
              },
              {
                text: '命令行界面',
                link: '/guide/cli',
              },
              {
                text: '测试筛选',
                link: '/guide/filtering',
              },
              {
                text: '测试覆盖率',
                link: '/guide/coverage',
              },
              {
                text: '测试快照',
                link: '/guide/snapshot',
              },
              {
                text: '模拟对象',
                link: '/guide/mocking',
              },
              {
                text: '类型测试',
                link: '/guide/testing-types',
              },
              {
                text: 'Vitest UI',
                link: '/guide/ui',
              },
              {
                text: '源码内联测试',
                link: '/guide/in-source',
              },
              {
                text: '测试上下文',
                link: '/guide/test-context',
              },
              {
                text: '测试环境',
                link: '/guide/environment',
              },
              {
                text: '扩展匹配器',
                link: '/guide/extending-matchers',
              },
              {
                text: 'IDE 插件',
                link: '/guide/ide',
              },
              {
                text: '调试',
                link: '/guide/debugging',
              },
              {
                text: '与其他测试框架对比',
                link: '/guide/comparisons',
              },
              {
                text: '迁移指南',
                link: '/guide/migration',
              },
            ],
          },
          {
            text: 'API',
            items: [
              {
                text: 'API 索引',
                link: '/api/',
              },
              {
                text: 'Mock Functions',
                link: '/api/mock',
              },
              {
                text: 'Vi Utility',
                link: '/api/vi',
              },
              {
                text: 'Expect',
                link: '/api/expect',
              },
              {
                text: 'ExpectTypeOf',
                link: '/api/expect-typeof',
              },
              {
                text: 'assertType',
                link: '/api/assert-type',
              },
            ],
          },
          {
            text: '配置',
            items: [
              {
                text: '配置索引',
                link: '/config/',
              },
            ],
          },
        ],
      },
    },
    pwa,
    transformHead,
  }),
)
