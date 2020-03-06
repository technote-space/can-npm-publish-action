# Can npm publish action

[![CI Status](https://github.com/technote-space/can-npm-publish-action/workflows/CI/badge.svg)](https://github.com/technote-space/can-npm-publish-action/actions)
[![codecov](https://codecov.io/gh/technote-space/can-npm-publish-action/branch/master/graph/badge.svg)](https://codecov.io/gh/technote-space/can-npm-publish-action)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/can-npm-publish-action/badge)](https://www.codefactor.io/repository/github/technote-space/can-npm-publish-action)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/can-npm-publish-action/blob/master/LICENSE)

GitHub Actions to check if it can be published to npm.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [Setup](#setup)
  - [yarn](#yarn)
  - [npm](#npm)
- [Author](#author)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage
e.g. `.github/workflows/check-publish.yml`
```yaml
on: pull_request

name: Check npm publish

jobs:
  checkPublish:
    name: Check npm publish
    runs-on: ubuntu-latest
    if: startsWith(github.head_ref, 'release/')
    steps:
      - uses: technote-space/can-npm-publish-action@v1
```

## Screenshots

## Options
| name | description | default | required | e.g. |
|:---:|:---|:---:|:---:|:---:|
| PACKAGE_PATH | Directory or package.json path | | | `assets/package.json` |
| VERBOSE | Whether to show detail of errors | `true` | | `false` |
| GITHUB_TOKEN | Access token | `${{github.token}}` | true | `${{secrets.ACCESS_TOKEN}}` |

## Outputs
| name | description | e.g. |
|:---:|:---|:---:|
| result | action result (passed or failed) | `passed` |

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
