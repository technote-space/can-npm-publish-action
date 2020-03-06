"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const core_1 = require("@actions/core");
const github_action_helper_1 = require("@technote-space/github-action-helper");
const can_npm_publish_1 = require("can-npm-publish");
const constant_1 = require("./constant");
exports.getHeadSha = (context) => { var _a, _b; return (_b = (_a = context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.head.sha) !== null && _b !== void 0 ? _b : ''; };
exports.execute = (logger, octokit, context) => __awaiter(void 0, void 0, void 0, function* () {
    const verbose = github_action_helper_1.Utils.getBoolValue(core_1.getInput('VERBOSE'));
    yield octokit.repos.createStatus(Object.assign(Object.assign({}, context.repo), { sha: exports.getHeadSha(context), state: 'pending', context: constant_1.STATUS_CONTEXT }));
    yield (new github_action_helper_1.GitHelper(logger)).checkout(github_action_helper_1.Utils.getWorkspace(), context);
    yield (new github_action_helper_1.Command(logger)).execAsync({
        command: 'pwd',
    });
    yield (new github_action_helper_1.Command(logger)).execAsync({
        command: 'ls -la',
    });
    logger.info(path_1.resolve(github_action_helper_1.Utils.getWorkspace(), core_1.getInput('PACKAGE_PATH')));
    yield can_npm_publish_1.canNpmPublish(path_1.resolve(github_action_helper_1.Utils.getWorkspace(), core_1.getInput('PACKAGE_PATH')), { verbose }).then(() => __awaiter(void 0, void 0, void 0, function* () {
        yield octokit.repos.createStatus(Object.assign(Object.assign({}, context.repo), { sha: exports.getHeadSha(context), state: 'success', context: constant_1.STATUS_CONTEXT }));
        logger.info('passed');
        core_1.setOutput('result', 'passed');
    })).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
        if (verbose) {
            logger.error(error.message);
        }
        yield octokit.repos.createStatus(Object.assign(Object.assign({}, context.repo), { sha: exports.getHeadSha(context), state: 'failure', description: error.message, context: constant_1.STATUS_CONTEXT }));
        logger.info('failed');
        core_1.setOutput('result', 'failed');
    }));
});
