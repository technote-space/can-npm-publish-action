/* eslint-disable no-magic-numbers */
import { resolve } from 'path';
import nock from 'nock';
import { Logger } from '@technote-space/github-action-helper';
import {
	testEnv,
	testFs,
	disableNetConnect,
	getApiFixture,
	getOctokit,
	generateContext,
	spyOnStdout,
	stdoutCalledWith,
	spyOnExec,
	execCalledWith,
} from '@technote-space/github-action-test-helper';
import { getHeadSha, execute } from '../src/process';

const rootDir     = resolve(__dirname, '..');
const fixturesDir = resolve(__dirname, 'fixtures');
const context     = generateContext({owner: 'hello', repo: 'world', ref: 'refs/pull/123/merge', sha: '1234567890'}, {
	payload: {
		'pull_request': {
			head: {
				ref: 'release/v1.2.3',
				sha: '0987654321',
			},
		},
	},
});
const logger      = new Logger();

let canNpmPublishResult = (): Promise<void> => Promise.resolve();
jest.mock('can-npm-publish', () => ({
	canNpmPublish: jest.fn(() => canNpmPublishResult()),
}));

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

		await execute(logger, getOctokit(), context);

		stdoutCalledWith(mockStdout, [
			'::error::Please checkout before run this action.',
		]);
	});

	it('should be success', async() => {
		const fn         = jest.fn();
		const mockStdout = spyOnStdout();
		const mockExec   = spyOnExec();

		process.env.INPUT_GITHUB_TOKEN = 'test';
		canNpmPublishResult            = (): Promise<void> => Promise.resolve();

		nock('https://api.github.com')
			.persist()
			.post('/repos/hello/world/statuses/0987654321', body => {
				expect(body.state).toBe('success');
				fn();
				return body;
			})
			.reply(201, () => getApiFixture(fixturesDir, 'repos.status.create'));

		await execute(logger, getOctokit(), context);

		expect(fn).toBeCalledTimes(1);
		execCalledWith(mockExec, []);
		stdoutCalledWith(mockStdout, [
			'> passed',
			'::set-output name=result::passed',
		]);
	});

	it('should be failure', async() => {
		const fn         = jest.fn();
		const mockStdout = spyOnStdout();
		const mockExec   = spyOnExec();

		process.env.INPUT_GITHUB_TOKEN = 'test';
		canNpmPublishResult            = (): Promise<void> => Promise.reject(new Error('test error'));

		nock('https://api.github.com')
			.persist()
			.post('/repos/hello/world/statuses/0987654321', body => {
				expect(body.state).toBe('failure');
				expect(body.description).toBe('test error');
				fn();
				return body;
			})
			.reply(201, () => getApiFixture(fixturesDir, 'repos.status.create'));

		await execute(logger, getOctokit(), context);

		expect(fn).toBeCalledTimes(1);
		execCalledWith(mockExec, []);
		stdoutCalledWith(mockStdout, [
			'::error::test error',
			'> failed',
			'::set-output name=result::failed',
		]);
	});

	it('should be failure (without verbose)', async() => {
		const fn         = jest.fn();
		const mockStdout = spyOnStdout();
		const mockExec   = spyOnExec();

		process.env.INPUT_GITHUB_TOKEN = 'test';
		process.env.INPUT_VERBOSE      = '';
		canNpmPublishResult            = (): Promise<void> => Promise.reject(new Error('test error'));

		nock('https://api.github.com')
			.persist()
			.post('/repos/hello/world/statuses/0987654321', body => {
				expect(body.state).toBe('failure');
				expect(body.description).toBe('test error');
				fn();
				return body;
			})
			.reply(201, () => getApiFixture(fixturesDir, 'repos.status.create'));

		await execute(logger, getOctokit(), context);

		expect(fn).toBeCalledTimes(1);
		execCalledWith(mockExec, []);
		stdoutCalledWith(mockStdout, [
			'> failed',
			'::set-output name=result::failed',
		]);
	});
});
