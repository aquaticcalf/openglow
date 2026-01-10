import os from "node:os"
import path from "node:path"
import { Elysia } from "elysia"

const VITE_DIR = path.resolve(import.meta.dir, "./vite")
const VITE_DIST_DIR = path.resolve(import.meta.dir, "./vite/dist")

const viteBuildProcess = Bun.spawn({
	cmd: ["bun", "run", "build"],
	env: {
		...process.env,
		FORCE_COLOR: "1",
	},
	cwd: VITE_DIR,
	stdin: "inherit",
	stdout: "inherit",
	stderr: "inherit",
})

const viteBuildExitCode = await viteBuildProcess.exited
if (viteBuildExitCode !== 0) {
	process.exit(viteBuildExitCode)
}

const mimeTypes: Record<string, string> = {
	".html": "text/html",
	".js": "application/javascript",
	".css": "text/css",
	".json": "application/json",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".gif": "image/gif",
	".svg": "image/svg+xml",
	".ico": "image/x-icon",
	".woff": "font/woff",
	".woff2": "font/woff2",
	".ttf": "font/ttf",
	".eot": "application/vnd.ms-fontobject",
}

function getMimeType(filePath: string): string {
	const ext = path.extname(filePath).toLowerCase()
	return mimeTypes[ext] || "application/octet-stream"
}

async function serveFile(filePath: string, contentType?: string) {
	const file = Bun.file(filePath)
	const exists = await file.exists()
	if (!exists) return null
	return new Response(file, {
		headers: {
			"Content-Type": contentType || getMimeType(filePath),
		},
	})
}

async function serveIndex() {
	const indexPath = path.join(VITE_DIST_DIR, "index.html")
	return serveFile(indexPath, "text/html; charset=utf-8")
}

const wifiMode = process.argv.includes("--wifi")

function getLocalIP(): string | undefined {
	const interfaces = os.networkInterfaces()
	for (const name of Object.keys(interfaces)) {
		const iface = interfaces[name]
		if (!iface) continue
		for (const details of iface) {
			if (details.family === "IPv4" && !details.internal) {
				return details.address
			}
		}
	}
	return undefined
}

const localIP = wifiMode ? getLocalIP() : undefined

const app = new Elysia()
	.get("/", () => serveIndex())
	.get("/*", async ({ params }) => {
		const reqPath = params["*"]
		const filePath = path.join(VITE_DIST_DIR, reqPath)

		const response = await serveFile(filePath)
		if (response) return response

		// SPA fallback
		return serveIndex()
	})
	.listen({
		port: 54321,
		hostname: wifiMode && localIP ? localIP : "127.0.0.1",
	})

const host = wifiMode && localIP ? localIP : "127.0.0.1"
console.log(`Elysia is running at http://${host}:${app.server?.port}`)
