# Can npm publish action

[![CI Status](https://github.com/technote-space/can-npm-publish-action/workflows/CI/badge.svg)](https://github.com/technote-space/can-npm-publish-action/actions)
[![codecov](https://codecov.io/gh/technote-space/can-npm-publish-action/branch/master/graph/badge.svg)](https://codecov.io/gh/technote-space/can-npm-publish-action)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/can-npm-publish-action/badge)](https://www.codefactor.io/repository/github/technote-space/can-npm-publish-action)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/can-npm-publish-action/blob/master/LICENSE)

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

npm に公開可能かチェックする`GitHub Actions`です。

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [使用方法](#%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95)
- [スクリーンショット](#%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88)
- [オプション](#%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3)
- [Outputs](#outputs)
- [Author](#author)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 使用方法
例：`.github/workflows/check-publish.yml`
```yaml
on: pull_request

name: Check npm publish

jobs:
  checkPublish:
    name: Check npm publish
    runs-on: ubuntu-latest
    if: startsWith(github.head_ref, 'release/')
    steps:
      - uses: actions/checkout@v2
      - uses: technote-space/can-npm-publish-action@v1
```

## スクリーンショット
### Passed
![Checks](https://raw.githubusercontent.com/technote-space/can-npm-publish-action/images/screenshot-1.png)

### Failed
![Error1](https://raw.githubusercontent.com/technote-space/can-npm-publish-action/images/screenshot-2.png)

![Error2](https://raw.githubusercontent.com/technote-space/can-npm-publish-action/images/screenshot-3.png)

## オプション
| name | description | default | required | e.g. |
|:---:|:---|:---:|:---:|:---:|
| PACKAGE_PATH | ディレクトリ または package.json へのパス | | | `assets/package.json` |
| VERBOSE | エラーの詳細を表示するかどうか | `true` | | `false` |
| GITHUB_TOKEN | アクセストークン | `${{github.token}}` | true | `${{secrets.ACCESS_TOKEN}}` |

## Outputs
| name | description | e.g. |
|:---:|:---|:---:|
| result | action result (passed or failed) | `passed` |

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
