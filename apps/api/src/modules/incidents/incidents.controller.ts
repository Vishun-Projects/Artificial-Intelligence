import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { IncidentsService } from './incidents.service'
import { JwtAuthGuard } from '../auth/jwt.guard'
import { Permissions } from '../../common/permissions.decorator'

class IncidentsListQuery { tenantId!: string }
class CreateIncidentDto { tenantId!: string; title!: string; severity?: number; status?: string }

@Controller('incidents')
@UseGuards(JwtAuthGuard)
export class IncidentsController {
	constructor(private readonly incidents: IncidentsService) {}

	@Get()
	@Permissions({ resource: 'incidents', action: 'read' })
	list(@Query() q: IncidentsListQuery) {
		return this.incidents.list(q.tenantId)
	}

	@Post()
	@Permissions({ resource: 'incidents', action: 'create' })
	create(@Body() body: CreateIncidentDto) {
		return this.incidents.create(body.tenantId, body.title, body.severity ?? 1, body.status ?? 'OPEN')
	}
}