import { Elysia } from "elysia"
import routes from "@/api/routes"

const api = new Elysia({ prefix: "/api" }).use(routes)

export default api
