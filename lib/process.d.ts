import type { Context } from '@actions/github/lib/context';
import type { Logger } from '@technote-space/github-action-log-helper';
export declare const getHeadSha: (context: Context) => string;
export declare const execute: (logger: Logger) => Promise<void>;
