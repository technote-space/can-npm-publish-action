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

testFs(true);
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

	it('should be success', async() => {
		const fn1        = jest.fn();
		const fn2        = jest.fn();
		const mockStdout = spyOnStdout();
		const mockExec   = spyOnExec();

		process.env.INPUT_GITHUB_TOKEN = 'test';
		canNpmPublishResult            = (): Promise<void> => Promise.resolve();

		nock('https://api.github.com')
			.persist()
			.post('/repos/hello/world/statuses/0987654321', body => {
				if (body.state === 'pending') {
					fn1();
				}
				if (body.state === 'success') {
					fn2();
				}
				return body;
			})
			.reply(201, () => getApiFixture(fixturesDir, 'repos.status.create'));

		await execute(logger, getOctokit(), context);

		expect(fn1).toBeCalledTimes(1);
		expect(fn2).toBeCalledTimes(1);
		execCalledWith(mockExec, [
			'git remote add origin \'https://octocat:test@github.com/hello/world.git\' > /dev/null 2>&1 || :',
			'git fetch --no-tags origin \'refs/pull/123/merge:refs/pull/123/merge\' || :',
			'git checkout -qf 1234567890',
		]);
		stdoutCalledWith(mockStdout, [
			'[command]git remote add origin',
			'[command]git fetch --no-tags origin \'refs/pull/123/merge:refs/pull/123/merge\'',
			'  >> stdout',
			'[command]git checkout -qf 1234567890',
			'  >> stdout',
			'> passed',
			'::set-output name=result::passed',
		]);
	});

	it('should be failure', async() => {
		const fn1        = jest.fn();
		const fn2        = jest.fn();
		const mockStdout = spyOnStdout();
		const mockExec   = spyOnExec();

		process.env.INPUT_GITHUB_TOKEN = 'test';
		canNpmPublishResult            = (): Promise<void> => Promise.reject(new Error('test error'));

		nock('https://api.github.com')
			.persist()
			.post('/repos/hello/world/statuses/0987654321', body => {
				if (body.state === 'pending') {
					fn1();
				}
				if (body.state === 'failure') {
					expect(body.description).toBe('test error');
					fn2();
				}
				return body;
			})
			.reply(201, () => getApiFixture(fixturesDir, 'repos.status.create'));

		await execute(logger, getOctokit(), context);

		expect(fn1).toBeCalledTimes(1);
		expect(fn2).toBeCalledTimes(1);
		execCalledWith(mockExec, [
			'git remote add origin \'https://octocat:test@github.com/hello/world.git\' > /dev/null 2>&1 || :',
			'git fetch --no-tags origin \'refs/pull/123/merge:refs/pull/123/merge\' || :',
			'git checkout -qf 1234567890',
		]);
		stdoutCalledWith(mockStdout, [
			'[command]git remote add origin',
			'[command]git fetch --no-tags origin \'refs/pull/123/merge:refs/pull/123/merge\'',
			'  >> stdout',
			'[command]git checkout -qf 1234567890',
			'  >> stdout',
			'::error::test error',
			'> failed',
			'::set-output name=result::failed',
		]);
	});

	it('should be failure (without verbose)', async() => {
		const fn1        = jest.fn();
		const fn2        = jest.fn();
		const mockStdout = spyOnStdout();
		const mockExec   = spyOnExec();

		process.env.INPUT_GITHUB_TOKEN = 'test';
		process.env.INPUT_VERBOSE      = '';
		canNpmPublishResult            = (): Promise<void> => Promise.reject(new Error('test error'));

		nock('https://api.github.com')
			.persist()
			.post('/repos/hello/world/statuses/0987654321', body => {
				if (body.state === 'pending') {
					fn1();
				}
				if (body.state === 'failure') {
					expect(body.description).toBe('test error');
					fn2();
				}
				return body;
			})
			.reply(201, () => getApiFixture(fixturesDir, 'repos.status.create'));

		await execute(logger, getOctokit(), context);

		expect(fn1).toBeCalledTimes(1);
		expect(fn2).toBeCalledTimes(1);
		execCalledWith(mockExec, [
			'git remote add origin \'https://octocat:test@github.com/hello/world.git\' > /dev/null 2>&1 || :',
			'git fetch --no-tags origin \'refs/pull/123/merge:refs/pull/123/merge\' || :',
			'git checkout -qf 1234567890',
		]);
		stdoutCalledWith(mockStdout, [
			'[command]git remote add origin',
			'[command]git fetch --no-tags origin \'refs/pull/123/merge:refs/pull/123/merge\'',
			'  >> stdout',
			'[command]git checkout -qf 1234567890',
			'  >> stdout',
			'> failed',
			'::set-output name=result::failed',
		]);
	});
});
