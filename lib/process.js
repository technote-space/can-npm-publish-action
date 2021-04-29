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
exports.execute = exports.getHeadSha = void 0;
const core_1 = require("@actions/core");
const github_action_helper_1 = require("@technote-space/github-action-helper");
const can_npm_publish_1 = require("can-npm-publish");
const getHeadSha = (context) => { var _a, _b; return (_b = (_a = context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.head.sha) !== null && _b !== void 0 ? _b : ''; };
exports.getHeadSha = getHeadSha;
const execute = (logger) => __awaiter(void 0, void 0, void 0, function* () {
    if (!github_action_helper_1.Utils.isCloned(github_action_helper_1.Utils.getWorkspace())) {
        logger.error('Please checkout before run this action.');
        return;
    }
    const verbose = github_action_helper_1.Utils.getBoolValue(core_1.getInput('VERBOSE'));
    yield can_npm_publish_1.canNpmPublish(core_1.getInput('PACKAGE_PATH') || undefined, { verbose }).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
        throw new Error(error.message);
    }));
});
exports.execute = execute;
