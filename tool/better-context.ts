import { tool } from "@opencode-ai/plugin"

export default tool({
	description:
		"Ask a question using btca ask command with specified technology stack. To get available technologies, first use the btca-repo-list tool to see configured repositories.",
	args: {
		tech: tool.schema.string().describe("Technology stack to ask about"),
		question: tool.schema
			.string()
			.describe("The question to ask about the specified technology"),
	},
	async execute(args) {
		const { tech, question } = args

		const output = await Bun.$`btca ask -t ${tech} -q "${question}"`.text()
		return output
	},
})
