<!-- omit in toc -->
# Semantic Release CodeArtifact

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

>A [semantic-release](https://github.com/semantic-release/semantic-release) plugin
>for publishing packages to [AWS CodeArtifact](https://aws.amazon.com/codeartifact/).

Automate your entire package release workflow including: determining the next
version number, generating release notes, and publishing packages to
CodeArtifact using this plugin with semantic-release.

<!-- omit in toc -->
## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Demo](#demo)
- [Requirements](#requirements)
  - [IAM Policy for Publishing](#iam-policy-for-publishing)
- [Configuration](#configuration)
  - [AWS Environment variables](#aws-environment-variables)
  - [Plugin environment variables](#plugin-environment-variables)
  - [Options](#options)
- [Lifecycle Hooks](#lifecycle-hooks)
- [Recipes](#recipes)
  - [CI Configurations](#ci-configurations)
- [Additional Usage](#additional-usage)
  - [JavaScript - npm](#javascript---npm)
    - [Plugin Configuration with npm](#plugin-configuration-with-npm)
  - [Python - pip](#python---pip)
  - [Java - Maven](#java---maven)
  - [Java - Gradle](#java---gradle)
- [Contributors ✨](#contributors-)

## Install

```bash
npm install -D semantic-release semantic-release-codeartifact
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

See [Additional Usage](#additional-usage) for details on using other tools with this plugin.

## Demo

Check out [this example repo](https://github.com/ryansonshine/semantic-release-codeartifact-example) to see it in action.

## Requirements

In order to use **semantic-release** you need:

- To host your code in a [Git repository](https://git-scm.com)
- Use a Continuous Integration service that allows you to [securely set up credentials](docs/usage/ci-configuration.md#authentication)
- A Git CLI version that meets [semantic-release's version requirement][sr-git-version] installed in your Continuous Integration environment
- A [Node.js](https://nodejs.org) version that meets [semantic-release's version requirement][sr-node-version] installed in your Continuous Integration environment

In order to use **semantic-release-codeartifact** you need:

- An [AWS Account](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/)
- An [AWS CodeArtifact](https://aws.amazon.com/codeartifact/) repository
- A role your CI environment can assume with sufficient [IAM permissions to publish packages](#iam-policy-for-publishing) with CodeArtifact

### IAM Policy for Publishing

The IAM role used by your CI environment will need the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "codeartifact:GetAuthorizationToken",
        "codeartifact:GetRepositoryEndpoint",
        "codeartifact:PublishPackageVersion"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "sts:GetServiceBearerToken",
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "sts:AWSServiceName": "codeartifact.amazonaws.com"
        }
      }
    }
  ]
}
```

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

**Note:** Proxy configurations are supported and will be used if HTTP_PROXY or HTTPS_PROXY
is found on the environment using [aws-sdk-v3-proxy](https://github.com/awslabs/aws-sdk-v3-js-proxy).

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

| Option             | Description                                                                                                             | Default                                    |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `tool`             | **Required.** Tool to connect with the CodeArtifact repository                                                          | `SR_CA_TOOL` environment variable.         |
| `domain`           | **Required.** Your CodeArtifact domain name                                                                             | `SR_CA_DOMAIN` environment variable.       |
| `repository`       | **Required.** Your CodeArtifact repository name                                                                         | `SR_CA_REPOSITORY` environment variable.   |
| `domainOwner`      | The AWS Account ID that owns your CodeArtifact domain                                                                   | `SR_CA_DOMAIN_OWNER` environment variable. |
| `durationSections` | The time, in seconds, that login information for CodeArtifact is valid                                                  | `7200` (2 hours)                           |
| `skipPluginCheck`  | Skips the check for required plugins, this can be used if you are using your own custom plugins for your specified tool | `false`                                    |

## Lifecycle Hooks

| Step               | Description                                                                                                                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `verifyConditions` | Verify the presence and the validity of the authentication (set via [configuration](#configuration)), and provide authentication values to the semantic-release plugin related to the CodeArtifact tool being used |

## Recipes

### CI Configurations

- [Github Actions](https://github.com/ryansonshine/semantic-release-codeartifact-example/blob/main/.github/workflows/release.yml)
- GitLab (coming soon - PRs welcome)
- CircleCI (coming soon - PRs welcome)

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

### Python - pip

Support for pip coming soon

### Java - Maven

Support for Maven coming soon

### Java - Gradle

Support for Gradle coming soon

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://ryansonshine.com"><img src="https://avatars.githubusercontent.com/u/9534477?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ryan Sonshine</b></sub></a><br /><a href="https://github.com/ryansonshine/semantic-release-codeartifact/commits?author=ryansonshine" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

[build-img]:https://github.com/ryansonshine/semantic-release-codeartifact/actions/workflows/release.yml/badge.svg
[build-url]:https://github.com/ryansonshine/semantic-release-codeartifact/actions/workflows/release.yml
[downloads-img]:https://img.shields.io/npm/dt/semantic-release-codeartifact
[downloads-url]:https://www.npmtrends.com/semantic-release-codeartifact
[npm-img]:https://img.shields.io/npm/v/semantic-release-codeartifact
[npm-url]:https://www.npmjs.com/package/semantic-release-codeartifact
[issues-img]:https://img.shields.io/github/issues/ryansonshine/semantic-release-codeartifact
[issues-url]:https://github.com/ryansonshine/semantic-release-codeartifact/issues
[codecov-img]:https://codecov.io/gh/ryansonshine/semantic-release-codeartifact/branch/main/graph/badge.svg
[codecov-url]:https://codecov.io/gh/ryansonshine/semantic-release-codeartifact
[semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]:https://github.com/semantic-release/semantic-release
[commitizen-img]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]:http://commitizen.github.io/cz-cli/
[sr-node-version]:https://github.com/semantic-release/semantic-release/blob/master/docs/support/node-version.md
[sr-git-version]:https://github.com/semantic-release/semantic-release/blob/master/docs/support/git-version.md
