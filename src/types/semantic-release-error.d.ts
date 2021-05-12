declare module '@semantic-release/error' {
  declare class SemanticReleaseError extends Error {
    constructor(message: string, code: string, details: string);
    name: 'SemanticReleaseError';
    code: string;
    details: string;
    semanticRelease: true;
  }

  export = SemanticReleaseError;
}
