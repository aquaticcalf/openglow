import { FileSystemRouter } from "file-system-router"
import type { ComponentType } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { ThemeProvider } from "@/components/theme/provider"
import { ThemeToggle } from "@/components/theme/toggle"

const pages: Record<string, { default: ComponentType<unknown> }> =
	import.meta.glob("./pages/**/*.tsx", { eager: true })

export default function App() {
	return (
		<ThemeProvider>
			<ThemeToggle className="fixed top-4 right-4 z-9999" />
			<Router>
				<FileSystemRouter pages={pages} />
			</Router>
		</ThemeProvider>
	)
}
