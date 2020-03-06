import { Context } from '@actions/github/lib/context';
import { getInput, setOutput } from '@actions/core';
import { Octokit } from '@octokit/rest';
import { Utils } from '@technote-space/github-action-helper';
import { canNpmPublish } from 'can-npm-publish';

export const execute = async(octokit: Octokit, context: Context): Promise<void> => {
	const verbose = Utils.getBoolValue(getInput('VERBOSE'));
	await canNpmPublish(getInput('PACKAGE_PATH'), {verbose}).then(async() => {
		await octokit.repos.createStatus({
			...context.repo,
			sha: context.sha,
			state: 'success',
			context: 'can-npm-publish-action',
		});
		setOutput('result', 'passed');
	}).catch(async error => {
		if (verbose) {
			console.error(error.message);
		}

		await octokit.repos.createStatus({
			...context.repo,
			sha: context.sha,
			state: 'failure',
			description: error.message,
			context: 'can-npm-publish-action',
		});
		setOutput('result', 'failed');
	});
};
