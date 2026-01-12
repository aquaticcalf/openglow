import type { Elysia } from "elysia"

interface openglowsession {
	id: string
	name: string
	project: string
	lastworkedon: string
	ispractive: boolean
}

interface getallsessionsresponse {
	sessions: openglowSession[]
	total: number
	page: number
	perpage: number
}

export default (app: Elysia) =>
	app.get(
		"/v1/all",
		({ query }): getallsessionsresponse => ({
			sessions: [],
			total: 0,
			page: Number(query.page) || 1,
			perpage: Number(query.perPage) || 10,
		}),
	)
