import type SemanticReleaseError from '@semantic-release/error';
import type { WriteStream } from 'fs';
import type { Signale } from 'signale';

/** Context keys shared across all lifecycle methods */
export interface CommonContext {
  stdout: WriteStream;
  stderr: WriteStream;
  logger: Signale;
}

/** Context provided to the `verifyConditions` lifecycle method */
export interface VerifyConditionsContext extends CommonContext {
  /** Current working directory */
  cwd: string;
  /** Environment variables */
  env: NodeJS.ProcessEnv;
  /** Information about CI environment */
  envCi: EnvCi;
  /** Options passed to `semantic-release` via CLI, configuration files, etc. */
  options: OptionsBase;
  /** Information on the current branch */
  branch: Branch;
  /** Information on branches */
  branches: Branch[];
}

/** Context provided to the `analyzeCommits` lifecycle method */
export interface AnalyzeCommitsContext extends VerifyConditionsContext {
  /** List of commits taken into account when determining new version */
  commits: CommitDetail[];
  /** List of releases */
  releases: Release[];
  /** Most recent release */
  lastRelease: Release;
}

/** Context provided to the `verifyRelease` lifecycle method */
export interface VerifyReleaseContext extends AnalyzeCommitsContext {
  /** Next release */
  nextRelease: Release;
}

/** Context provided to the `generateNotes` lifecycle method */
export type GenerateNotesContext = VerifyReleaseContext;

/** Context provided to the `addChannel` lifecycle method */
export type AddChannelContext = VerifyReleaseContext;

/** Context provided to the `prepareContext` lifecycle method */
export type PrepareContext = VerifyReleaseContext;

/** Context provided to the `publish` lifecycle method */
export type PublishContext = VerifyReleaseContext;

/** Context provided to the `success` lifecycle method */
export type SuccessContext = VerifyReleaseContext;

/** Context provided to the `fail` lifecycle method */
export interface FailContext extends VerifyReleaseContext {
  errors: SemanticReleaseError[];
}

export interface EnvCi {
  /** True if the environment is a CI environment */
  isCi: boolean;
  /** Commit hash */
  commit: string;
  /** Current branch */
  branch: string;
}

export interface Branch {
  tags: Tag[];
  type: string;
  name: string;
  range?: string;
  accept?: string[];
  main?: boolean;
  channel?: string;
  prerelease?: boolean;
}

export interface Tag {
  gitTag: string;
  version: string;
  channels: Channel[];
}

export interface OptionsBase {
  branches: (Branch | string)[];
  repositoryUrl: string;
  tagFormat: string;
  plugins: string[];
  dryRun: boolean;
  [key: string]: any;
}

// export type CodeArtifactTool = 'npm' | 'nuget' | 'dotnet' | 'pip' | 'twine';

export interface PluginConfig extends OptionsBase {
  /** Tool to connect with the CodeArtifact repository */
  tool: string;
  /** Your CodeArtifact domain name */
  domain: string;
  /** The AWS Account ID that owns your CodeArtifact domain */
  domainOwner?: string;
  /** The time, in seconds, that the login information is valid */
  durationSeconds?: number;
  /** Your CodeArtifact repository name */
  repository: string;
}

export type Channel = null | string;

export interface Release {
  version: string;
  gitTag: string;
  channels: (Channel | null)[];
  gitHead: string;
  name: string;
}

export interface CommitDetail {
  commit: Commit;
  tree: Commit;
  author: Author;
  committer: Author;
  subject: string;
  body: string;
  hash: string;
  committerDate: string;
  message: string;
  gitTags: string;
}

export interface Author {
  name: string;
  email: string;
  date: string;
}

export interface Commit {
  long: string;
  short: string;
}
