/** omp-only: the session owner persists its journal before VS Code hands it to the TUI. */
interface HandoffContext {
    sessionManager: { ensureOnDisk(): Promise<void>; flush(): Promise<void> };
}

interface HandoffApi {
    registerCommand(name: string, options: {
        description: string;
        handler: (args: string, ctx: HandoffContext) => Promise<void>;
    }): void;
}

export default function sessionHandoff(pi: HandoffApi): void {
    pi.registerCommand('vscode-session-handoff', {
        description: 'Internal: persist the session before handing it to the TUI',
        handler: async (_args, ctx) => {
            await ctx.sessionManager.ensureOnDisk();
            await ctx.sessionManager.flush();
        },
    });
}
