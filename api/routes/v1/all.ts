import type { Elysia } from "elysia"

interface openglowSession {
	id: string
	name: string
	project: string
	lastWorkedOn: string
	isPRActive: boolean
}

interface getAllSessionsResponse {
	sessions: openglowSession[]
	total: number
	page: number
	perPage: number
}

export default (app: Elysia) =>
	app.get(
		"/v1/all",
		({ query }): getAllSessionsResponse => ({
			sessions: [],
			total: 0,
			page: Number(query.page) || 1,
			perPage: Number(query.perPage) || 10,
		}),
	)
