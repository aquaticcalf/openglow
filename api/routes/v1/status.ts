import type { Elysia } from "elysia"

export default (app: Elysia) =>
	app.get("/v1/status", () => ({
		status: "healthy",
		timestamp: new Date().toISOString(),
	}))
