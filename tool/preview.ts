import { tool } from "@opencode-ai/plugin"

export default tool({
	description:
		"preview changes before applying irreversible cli commands. useful for safely testing operations like sed, awk, tr, etc. that would normally modify files. shows exactly what would change without touching the original file.",
	args: {
		file: tool.schema.string().describe("path to the file to preview"),
		operation: tool.schema
			.string()
			.describe(
				"complete shell command that reads from stdin and writes to stdout. can be any cli tool: sed, awk, tr, perl, python, custom scripts, etc. good examples: 'sed \"s/foo/bar/g\"', 'awk \"{print NF}\"', 'grep -v \"^#\"', 'tr \"a-z\" \"A-Z\"', 'perl -pe \"s/old/new/g\"'. the command will receive file content via stdin and output goes to stdout. bad examples: 's/foo/bar/g' (missing sed), 'foo -> bar' (not a real command).",
			),
	},
	async execute({ file, operation }) {
		try {
			const fileContent = await Bun.file(file).text()

			const transformProc = Bun.spawn(["bash", "-c", operation], {
				stdin: "pipe",
				stdout: "pipe",
				stderr: "pipe",
			})

			transformProc.stdin.write(fileContent)
			transformProc.stdin.end()

			const transformed = await new Response(transformProc.stdout).text()
			const transformErr = await new Response(transformProc.stderr).text()

			await transformProc.exited

			if (transformProc.exitCode !== 0) {
				return `error running transform : ${transformErr || "transform command failed"}`
			}

			const diffProc = Bun.spawn(["diff", "-u", file, "-"], {
				stdin: "pipe",
				stdout: "pipe",
				stderr: "pipe",
			})

			diffProc.stdin.write(transformed)
			diffProc.stdin.end()

			await diffProc.exited

			const diffOut = await new Response(diffProc.stdout).text()
			const diffErr = await new Response(diffProc.stderr).text()

			if (diffProc.exitCode > 1) {
				return `error running diff : ${diffErr || "diff failed"}`
			}

			if (diffProc.exitCode === 1) {
				return `changes detected :\n${diffOut}`
			} else {
				return "no changes detected."
			}
		} catch (e) {
			return `error : ${e instanceof Error ? e.message : String(e)}`
		}
	},
})
