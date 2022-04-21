/* eslint-disable no-magic-numbers */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {resolve} from 'path';
import nock from 'nock';
import canNpmPublish from 'can-npm-publish';
import {Logger} from '@technote-space/github-action-log-helper';
import {
  testEnv,
  testFs,
  disableNetConnect,
  generateContext,
  spyOnStdout,
  stdoutCalledWith,
} from '@technote-space/github-action-test-helper';
import {getHeadSha, execute} from '../src/process';

const rootDir = resolve(__dirname, '..');
const context = generateContext({owner: 'hello', repo: 'world', ref: 'refs/pull/123/merge', sha: '1234567890'}, {
  payload: {
    'pull_request': {
      head: {
        ref: 'release/v1.2.3',
        sha: '0987654321',
      },
    },
  },
});
const logger  = new Logger();

const setExists = testFs(true);
beforeEach(() => {
  Logger.resetForTesting();
});

describe('getHeadSha', () => {
  it('should return head sha', () => {
    expect(getHeadSha(context)).toBe('0987654321');
    expect(getHeadSha(generateContext({}))).toBe('');
  });
});

describe('execute', () => {
  testEnv(rootDir);
  disableNetConnect(nock);

  it('should do nothing', async() => {
    const mockStdout = spyOnStdout();
    setExists(false);

    await execute(logger);

    stdoutCalledWith(mockStdout, [
      '::error::Please checkout before run this action.',
    ]);
  });

  it('should be success', async() => {
    vi.spyOn(canNpmPublish, 'canNpmPublish').mockResolvedValueOnce(undefined);

    await expect(execute(logger)).resolves.toBeUndefined();
  });

  it('should be failure', async() => {
    vi.spyOn(canNpmPublish, 'canNpmPublish').mockRejectedValueOnce(new Error('test error'));

    await expect(execute(logger)).rejects.toThrow('test error');
  });
});
