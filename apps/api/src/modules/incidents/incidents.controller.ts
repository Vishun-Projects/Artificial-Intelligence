import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { IncidentsService } from './incidents.service'

class IncidentsListQuery { tenantId!: string }
class CreateIncidentDto { tenantId!: string; title!: string; severity?: number; status?: string }

@Controller('incidents')
export class IncidentsController {
	constructor(private readonly incidents: IncidentsService) {}

	@Get()
	list(@Query() q: IncidentsListQuery) {
		return this.incidents.list(q.tenantId)
	}

	@Post()
	create(@Body() body: CreateIncidentDto) {
		return this.incidents.create(body.tenantId, body.title, body.severity ?? 1, body.status ?? 'OPEN')
	}
}