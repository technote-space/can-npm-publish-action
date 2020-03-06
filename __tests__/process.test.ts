/* eslint-disable no-magic-numbers */
import { resolve } from 'path';
import nock from 'nock';
import { testEnv, disableNetConnect, getApiFixture, getOctokit, generateContext, spyOnStdout, stdoutCalledWith } from '@technote-space/github-action-test-helper';
import { execute } from '../src/process';

const rootDir     = resolve(__dirname, '..');
const fixturesDir = resolve(__dirname, 'fixtures');
const context     = generateContext({owner: 'hello', repo: 'world', sha: '1234567890'});

let canNpmPublishResult = Promise.resolve();
jest.mock('can-npm-publish', () => ({
	canNpmPublish: jest.fn(() => canNpmPublishResult),
}));

describe('execute', () => {
	testEnv(rootDir);
	disableNetConnect(nock);

	it('should be success', async() => {
		const fn = jest.fn();

		nock('https://api.github.com')
			.persist()
			.post('/repos/hello/world/statuses/1234567890', body => {
				expect(body.state).toBe('success');
				fn();
				return body;
			})
			.reply(201, () => getApiFixture(fixturesDir, 'repos.status.create'));

		await execute(getOctokit(), context);

		expect(fn).toBeCalledTimes(1);
	});

	it('should be failure', async() => {
		const fn         = jest.fn();
		const mockStdout = spyOnStdout();

		canNpmPublishResult = Promise.reject({message: 'test'});

		nock('https://api.github.com')
			.persist()
			.post('/repos/hello/world/statuses/1234567890', body => {
				expect(body.state).toBe('failure');
				expect(body.description).toBe('test');
				fn();
				return body;
			})
			.reply(201, () => getApiFixture(fixturesDir, 'repos.status.create'));

		await execute(getOctokit(), context);

		expect(fn).toBeCalledTimes(1);
		stdoutCalledWith(mockStdout, [
			'__error__"test"',
		]);
	});

	it('should be failure (without verbose)', async() => {
		const fn         = jest.fn();
		const mockStdout = spyOnStdout();

		process.env.INPUT_VERBOSE = '';
		canNpmPublishResult       = Promise.reject({message: 'test'});

		nock('https://api.github.com')
			.persist()
			.post('/repos/hello/world/statuses/1234567890', body => {
				expect(body.state).toBe('failure');
				expect(body.description).toBe('test');
				fn();
				return body;
			})
			.reply(201, () => getApiFixture(fixturesDir, 'repos.status.create'));

		await execute(getOctokit(), context);

		expect(fn).toBeCalledTimes(1);
		stdoutCalledWith(mockStdout, []);
	});
});
