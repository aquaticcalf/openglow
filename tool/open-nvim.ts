import { tool } from "@opencode-ai/plugin"

export default tool({
	description: "open nvim in a new terminal",
	args: {
		directory: tool.schema.string().describe("Directory to open nvim in"),
		file: tool.schema.string().optional().describe("File to open in nvim"),
	},
	async execute({ directory, file }) {
		try {
			let cmd = "nvim"
			if (file) cmd += ` "${file}"`
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
			return "opened nvim in new terminal"
		} catch (error) {
			return `failed to open nvim: ${error instanceof Error ? error.message : String(error)}`
		}
	},
})
