# Can npm publish action

[![CI Status](https://github.com/technote-space/can-npm-publish-action/workflows/CI/badge.svg)](https://github.com/technote-space/can-npm-publish-action/actions)
[![codecov](https://codecov.io/gh/technote-space/can-npm-publish-action/branch/master/graph/badge.svg)](https://codecov.io/gh/technote-space/can-npm-publish-action)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/can-npm-publish-action/badge)](https://www.codefactor.io/repository/github/technote-space/can-npm-publish-action)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/can-npm-publish-action/blob/master/LICENSE)

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

GitHub Actions to check if it can be published to npm.  
This action uses [can-npm-publish](https://github.com/azu/can-npm-publish).

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [Usage](#usage)
- [Screenshots](#screenshots)
  - [Passed](#passed)
  - [Failed](#failed)
- [Options](#options)
- [Outputs](#outputs)
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
    steps:
      - uses: actions/checkout@v2
      - uses: technote-space/can-npm-publish-action@v1
```

## Screenshots
### Passed
![Checks](https://raw.githubusercontent.com/technote-space/can-npm-publish-action/images/screenshot-1.png)

### Failed
![Error1](https://raw.githubusercontent.com/technote-space/can-npm-publish-action/images/screenshot-2.png)

![Error2](https://raw.githubusercontent.com/technote-space/can-npm-publish-action/images/screenshot-3.png)

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

## Action event details
### Target events
| eventName | action |
|:---:|:---:|
|pull_request, pull_request_target|opened, reopened, synchronize|

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
