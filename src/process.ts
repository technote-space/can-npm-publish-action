import { Context } from '@actions/github/lib/context';
import { getInput, setOutput } from '@actions/core';
import { Octokit } from '@octokit/rest';
import { Utils, GitHelper, Logger } from '@technote-space/github-action-helper';
import { canNpmPublish } from 'can-npm-publish';
import { STATUS_CONTEXT } from './constant';

export const getHeadSha = (context: Context): string => context.payload.pull_request?.head.sha ?? '';

export const execute = async(logger: Logger, octokit: Octokit, context: Context): Promise<void> => {
	const verbose = Utils.getBoolValue(getInput('VERBOSE'));
	await octokit.repos.createStatus({
		...context.repo,
		sha: getHeadSha(context),
		state: 'pending',
		context: STATUS_CONTEXT,
	});
	await (new GitHelper(logger)).checkout(Utils.getWorkspace(), context);
	await canNpmPublish(getInput('PACKAGE_PATH') || undefined, {verbose}).then(async() => {
		await octokit.repos.createStatus({
			...context.repo,
			sha: getHeadSha(context),
			state: 'success',
			context: STATUS_CONTEXT,
		});
		logger.info('passed');
		setOutput('result', 'passed');
	}).catch(async error => {
		if (verbose) {
			logger.error(error.message);
		}

		await octokit.repos.createStatus({
			...context.repo,
			sha: getHeadSha(context),
			state: 'failure',
			description: error.message,
			context: STATUS_CONTEXT,
		});
		logger.info('failed');
		setOutput('result', 'failed');
	});
};
