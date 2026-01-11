import type { Elysia } from "elysia"
import allRoute from "@/api/routes/v1/all"
import statusRoute from "@/api/routes/v1/status"

export default (app: Elysia) =>
	app
		.get("/", () => ({ message: "api is running" }))
		.use(allRoute)
		.use(statusRoute)
