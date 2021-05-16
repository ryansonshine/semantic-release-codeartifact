declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** Tool to connect with the CodeArtifact repository */
      SR_CA_TOOL?: string;
      /** Your CodeArtifact domain name */
      SR_CA_DOMAIN?: string;
      /** The AWS Account ID that owns your CodeArtifact domain */
      SR_CA_DOMAIN_OWNER?: string;
      /** The time, in seconds, that the login information is valid */
      SR_CA_DURATION_SEC?: string;
      /** Your CodeArtifact repository name */
      SR_CA_REPOSITORY?: string;
      AWS_REGION?: string;
      AWS_ACCESS_KEY_ID?: string;
      AWS_SECRET_ACCESS_KEY?: string;
    }
  }
}

export {};
