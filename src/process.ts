import { Context } from '@actions/github/lib/context';
import { getInput, setOutput } from '@actions/core';
import { Octokit } from '@octokit/rest';
import { Utils, Logger } from '@technote-space/github-action-helper';
import { canNpmPublish } from 'can-npm-publish';

export const execute = async(logger: Logger, octokit: Octokit, context: Context): Promise<void> => {
	const verbose = Utils.getBoolValue(getInput('VERBOSE'));
	await canNpmPublish(getInput('PACKAGE_PATH'), {verbose}).then(async() => {
		await octokit.repos.createStatus({
			...context.repo,
			sha: context.sha,
			state: 'success',
			context: 'can-npm-publish-action',
		});
		logger.info('passed');
		setOutput('result', 'passed');
	}).catch(async error => {
		if (verbose) {
			logger.error(error.message);
		}

		await octokit.repos.createStatus({
			...context.repo,
			sha: context.sha,
			state: 'failure',
			description: error.message,
			context: 'can-npm-publish-action',
		});
		logger.info('failed');
		setOutput('result', 'failed');
	});
};
