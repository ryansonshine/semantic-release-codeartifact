/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { ErrorDefinitions } from '../src/types';
import { mockClient } from 'aws-sdk-client-mock';
import {
  CodeartifactClient,
  GetAuthorizationTokenCommand,
  GetRepositoryEndpointCommand,
} from '@aws-sdk/client-codeartifact';
import { makePluginConfig } from './helpers/dummies';
import { getMockContext } from './mocks/mock-context';
import { getCodeArtifactConfig } from '../src/get-ca-config';

const mockCaClient = mockClient(CodeartifactClient);

const config = makePluginConfig();
const context = getMockContext();

const authorizationToken =
  '16b1690f-4a51-4e2f-a9d6-ff5b0ec1189f-test-auth-token';
const repositoryEndpoint =
  'https://my-domain-123456789012.d.codeartifact.us-east-1.amazonaws.com/npm/my-repo/';

describe('get-ca-config', () => {
  describe('getCodeArtifactConfig', () => {
    beforeEach(() => {
      mockCaClient.reset();
      mockCaClient
        .on(GetAuthorizationTokenCommand)
        .resolves({
          authorizationToken,
        })
        .on(GetRepositoryEndpointCommand)
        .resolves({
          repositoryEndpoint,
        });
    });

    it('should return an object containing the auth token and repository endpoint', async () => {
      const result = await getCodeArtifactConfig(config, context);

      expect(result).toEqual({ authorizationToken, repositoryEndpoint });
    });

    it('should throw an AggregateError containing a SemanticRelease error if no auth token is returned', async () => {
      expect.assertions(3);
      mockCaClient.on(GetAuthorizationTokenCommand).resolves({});

      try {
        await getCodeArtifactConfig(config, context);
      } catch (errors) {
        const [error, ...otherErrors] = errors as any[];
        expect(error?.code).toEqual<keyof ErrorDefinitions>('ENOAUTHTOKEN');
        expect(error?.name).toEqual('SemanticReleaseError');
        expect(otherErrors).toHaveLength(0);
      }
    });

    it('should throw an AggregateError containing a SemanticRelease error if no repository is returned', async () => {
      expect.assertions(3);
      mockCaClient.on(GetRepositoryEndpointCommand).resolves({});

      try {
        await getCodeArtifactConfig(config, context);
      } catch (errors) {
        const [error, ...otherErrors] = errors as any[];
        expect(error?.code).toEqual<keyof ErrorDefinitions>('ENOREPOENDPOINT');
        expect(error?.name).toEqual('SemanticReleaseError');
        expect(otherErrors).toHaveLength(0);
      }
    });

    it('should throw an AggregateError containing a SemanticRelease error when an aws error is thrown', async () => {
      expect.hasAssertions();
      mockCaClient.on(GetAuthorizationTokenCommand).rejects({
        $metadata: {},
        message: 'Failed to get auth token',
        name: 'TestAWSError',
      });

      try {
        await getCodeArtifactConfig(config, context);
      } catch (errors) {
        const [error, ...otherErrors] = errors as any[];
        expect(error?.code).toEqual<keyof ErrorDefinitions>('EAWSSDK');
        expect(error?.name).toEqual('SemanticReleaseError');
        expect(error?.details).toMatch('TestAWSError');
        expect(otherErrors).toHaveLength(0);
      }
    });

    it('should throw an AggregateError containing a SemanticRelease error when a generic error is thrown', async () => {
      expect.hasAssertions();
      mockCaClient
        .on(GetAuthorizationTokenCommand)
        .rejects(new Error('Generic error'));

      try {
        await getCodeArtifactConfig(config, context);
      } catch (errors) {
        const [error, ...otherErrors] = errors as any[];
        expect(error?.code).toEqual<keyof ErrorDefinitions>('EAWSSDK');
        expect(error?.name).toEqual('SemanticReleaseError');
        expect(error?.details).toMatch('UnknownException');
        expect(otherErrors).toHaveLength(0);
      }
    });
  });
});
