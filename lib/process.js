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
const core_1 = require("@actions/core");
const github_action_helper_1 = require("@technote-space/github-action-helper");
const can_npm_publish_1 = require("can-npm-publish");
exports.execute = (octokit, context) => __awaiter(void 0, void 0, void 0, function* () {
    const verbose = github_action_helper_1.Utils.getBoolValue(core_1.getInput('VERBOSE'));
    yield can_npm_publish_1.canNpmPublish(core_1.getInput('PACKAGE_PATH'), { verbose }).then(() => __awaiter(void 0, void 0, void 0, function* () {
        yield octokit.repos.createStatus(Object.assign(Object.assign({}, context.repo), { sha: context.sha, state: 'success', context: 'can-npm-publish-action' }));
    })).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
        if (verbose) {
            console.error(error.message);
        }
        yield octokit.repos.createStatus(Object.assign(Object.assign({}, context.repo), { sha: context.sha, state: 'failure', description: error.message, context: 'can-npm-publish-action' }));
    }));
});
