# Semantic Release CodeArtifact

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

A [semantic-release](https://github.com/semantic-release/semantic-release) plugin
for publishing packages to [AWS CodeArtifact](https://aws.amazon.com/codeartifact/)

| Step               | Description                                                                                                                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `verifyConditions` | Verify the presence and the validity of the authentication (set via [configuration](#configuration)), and provide authentication values to the semantic-release plugin related to the CodeArtifact tool being used |

## Install

```bash
npm install --save-dev semantic-release-codeartifact
```

## Usage

The plugin can be configured in the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ["semantic-release-codeartifact", {
      "tool": "npm",
      "domain": "<YOUR_DOMAIN>",
      "repository": "<YOUR_REPOSITORY>"
    }],
    "@semantic-release/npm",
    "@semantic-release/github"
  ]
}
```

Check out [the example repo](https://github.com/ryansonshine/semantic-release-codeartifact-example) to see it in action.

See [Additional Usage](#additional-usage) for details on using other tools with this plugin.

## Configuration

### AWS Environment variables

The AWS configuration is **required** for the AWS SDK which is used for getting
an auth token for CodeArtifact.

| Variable                | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| `AWS_REGION`            | **Required.** The AWS region to be used with the AWS SDK |
| `AWS_ACCESS_KEY_ID`     | **Required.** Your AWS Access Key                        |
| `AWS_SECRET_ACCESS_KEY` | **Required.**  Your AWS Secret Access Key                |
| `AWS_SESSION_TOKEN`     | Session token if you have/need it                        |

### Plugin environment variables

The following environment variables can be set to configure the plugin. [Options](#options)
specified by plugin config will take precedence over these environment variables.

| Variable             | Description                                                            |
| -------------------- | ---------------------------------------------------------------------- |
| `SR_CA_TOOL`         | Tool to connect with the CodeArtifact repository                       |
| `SR_CA_DOMAIN`       | Your CodeArtifact domain name                                          |
| `SR_CA_REPOSITORY`   | Your CodeArtifact repository name                                      |
| `SR_CA_DOMAIN_OWNER` | The AWS Account ID that owns your CodeArtifact domain                  |
| `SR_CA_DURATION_SEC` | The time, in seconds, that login information for CodeArtifact is valid |

### Options

| Option             | Description                                                            | Default                                   |
| ------------------ | ---------------------------------------------------------------------- | ----------------------------------------- |
| `tool`             | **Required.** Tool to connect with the CodeArtifact repository         | `SR_CA_TOOL` environment variable.        |
| `domain`           | **Required.** Your CodeArtifact domain name                            | `SR_CA_DOMAIN` environment variable.      |
| `repository`       | **Required.** Your CodeArtifact repository name                        | `SR_CA_REPOSITORY` environment variable   |
| `domainOwner`      | The AWS Account ID that owns your CodeArtifact domain                  | `SR_CA_DOMAIN_OWNER` environment variable |
| `durationSections` | The time, in seconds, that login information for CodeArtifact is valid | `7200` (2 hours)                          |

## Recipes

### CI Configurations

- Github Actions ([coming soon](https://github.com/ryansonshine/semantic-release-codeartifact/issues/5))
- GitLab ([coming soon](https://github.com/ryansonshine/semantic-release-codeartifact/issues/6))
- CircleCI ([coming soon](https://github.com/ryansonshine/semantic-release-codeartifact/issues/7))

## Additional Usage

CodeArtifact supports multiple tools including npm (JavaScript), Maven and Gradle
(Java), and pip (Python). Each contain different dependencies and are listed below.

### JavaScript - npm

Required dependencies:

- [`@semantic-release/npm`](https://www.npmjs.com/package/@semantic-release/npm)

```bash
npm install --save-dev semantic-release semantic-release-codeartifact
```

#### Plugin Configuration with npm

*semantic-release includes the other plugins listed below:*

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ["semantic-release-codeartifact", {
      "tool": "npm",
      "domain": "<YOUR_DOMAIN>",
      "repository": "<YOUR_REPOSITORY>"
    }],
    "@semantic-release/npm",
    "@semantic-release/github"
  ]
}
```

**Note:** `semantic-release-codeartifact` must be listed before `@semantic-release/npm`

### pip - Python

[Support for pip coming soon](https://github.com/ryansonshine/semantic-release-codeartifact/issues/8)

### Maven - Java

[Support for Maven coming soon](https://github.com/ryansonshine/semantic-release-codeartifact/issues/9)

### Gradle - Java

[Support for Gradle coming soon](https://github.com/ryansonshine/semantic-release-codeartifact/issues/10)

[build-img]:https://travis-ci.com/ryansonshine/semantic-release-codeartifact.svg?branch=master
[build-url]:https://travis-ci.com/ryansonshine/semantic-release-codeartifact
[downloads-img]:https://img.shields.io/npm/dt/semantic-release-codeartifact
[downloads-url]:https://www.npmtrends.com/semantic-release-codeartifact
[npm-img]:https://img.shields.io/npm/v/semantic-release-codeartifact
[npm-url]:https://www.npmjs.com/package/semantic-release-codeartifact
[issues-img]:https://img.shields.io/github/issues/ryansonshine/semantic-release-codeartifact
[issues-url]:https://github.com/ryansonshine/semantic-release-codeartifact/issues
[codecov-img]:https://codecov.io/gh/ryansonshine/semantic-release-codeartifact/branch/master/graph/badge.svg
[codecov-url]:https://codecov.io/gh/ryansonshine/semantic-release-codeartifact
[semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]:https://github.com/semantic-release/semantic-release
[commitizen-img]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]:http://commitizen.github.io/cz-cli/
