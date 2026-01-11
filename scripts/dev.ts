import os from "node:os"
import { Elysia } from "elysia"
import api from "@/api/index"

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
	.use(api)
	.get("/", () => new Response("openglow"))
	.listen({
		port: 54321,
		hostname: wifiMode && localIP ? localIP : "127.0.0.1",
	})

const host = wifiMode && localIP ? localIP : "127.0.0.1"
console.log(`Elysia is running at http://${host}:${app.server?.port}`)
