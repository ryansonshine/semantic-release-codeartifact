# semantic-release-codeartifact

[semantic-release](https://github.com/semantic-release/semantic-release) plugin
for publishing packages to [AWS CodeArtifact](https://aws.amazon.com/codeartifact/)

<!-- TODO: Add badges -->

<!-- TODO: Add  plugins/configuration -->

## Configuration

## Lifecycle Hooks

<!-- TODO: List out lifecycle hooks -->

| Step               | Required | Description                                                                                                                                                                                                          |
|--------------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `verifyConditions` | No       | Responsible for verifying conditions necessary to proceed with the release: configuration is correct, authentication token are valid, etc...                                                                         |
| `analyzeCommits`   | Yes      | Responsible for determining the type of the next release (`major`, `minor` or `patch`). If multiple plugins with a `analyzeCommits` step are defined, the release type will be the highest one among plugins output. |
| `verifyRelease`    | No       | Responsible for verifying the parameters (version, type, dist-tag etc...) of the release that is about to be published.                                                                                              |
| `generateNotes`    | No       | Responsible for generating the content of the release note. If multiple plugins with a `generateNotes` step are defined, the release notes will be the result of the concatenation of each plugin output.            |
| `prepare`          | No       | Responsible for preparing the release, for example creating or updating files such as `package.json`, `CHANGELOG.md`, documentation or compiled assets and pushing a commit.                                         |
| `publish`          | No       | Responsible for publishing the release.                                                                                                                                                                              |
| `addChannel`       | No       | Responsible for adding a release channel (e.g. adding an npm dist-tag to a release).                                                                                                                                 |
| `success`          | No       | Responsible for notifying of a new release.                                                                                                                                                                          |
| `fail`             | No       | Responsible for notifying of a failed release.                                                                                                                                                                       |                                                                                                                                                                     |

