import { tool } from "@opencode-ai/plugin"

export default tool({
	description: "restart opencode session",
	args: {
		directory: tool.schema
			.string()
			.optional()
			.describe("Directory to open opencode in"),
		model: tool.schema.string().optional().describe("Model to use"),
		prompt: tool.schema.string().optional().describe("Initial prompt"),
	},
	async execute({ directory, model, prompt }) {
		try {
			let cmd = "opencode"
			if (model) cmd += ` --model "${model}"`
			if (prompt) cmd += ` --prompt "${prompt}"`
			const command = directory
				? `cd "${directory}"; ${cmd}; exec bash`
				: `${cmd}; exec bash`
			const proc = Bun.spawn(["ghostty", "-e", "bash", "-lc", command], {
				env: {
					...process.env,
					GHOSTTY_SINGLE_INSTANCE: "0",
				},
				stdout: "ignore",
				stderr: "ignore",
				detached: true,
			})

			proc.unref()
			return "opened new opencode session"
		} catch (error) {
			return `failed to open new opencode session: ${error instanceof Error ? error.message : String(error)}`
		}
	},
})
