export declare function processCompletions(): Promise<void>;
export declare function startCompletionCron(): void;
/**
 * Gracefully stop the completion cron job
 * Waits for running jobs to complete (max 30 seconds)
 */
export declare function stopCompletionCron(): Promise<void>;
//# sourceMappingURL=completionCron.d.ts.map