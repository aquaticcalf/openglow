import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Lists all configured repositories in btca",
  args: {},
  async execute(args) { 
    const output = await Bun.$`btca config repos list | grep -E '^\s+[a-zA-Z]' | grep -v 'URL:' | grep -v 'Branch:' | awk '{print $1}'`.text()
    const lines = output.split('\n')
    const repos = lines.filter(line => line.trim())
    return repos.join('\n')
  }
})
