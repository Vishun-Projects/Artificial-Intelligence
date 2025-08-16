import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { RisksService } from './risks.service'
import { JwtAuthGuard } from '../auth/jwt.guard'
import { Permissions } from '../../common/permissions.decorator'

class RisksListQuery { tenantId!: string }
class CreateRiskDto { tenantId!: string; title!: string; likelihood?: number; impact?: number }

@Controller('risks')
@UseGuards(JwtAuthGuard)
export class RisksController {
	constructor(private readonly risks: RisksService) {}

	@Get()
	@Permissions({ resource: 'risks', action: 'read' })
	list(@Query() q: RisksListQuery) {
		return this.risks.list(q.tenantId)
	}

	@Post()
	@Permissions({ resource: 'risks', action: 'create' })
	create(@Body() body: CreateRiskDto) {
		return this.risks.create(body.tenantId, body.title, body.likelihood ?? 1, body.impact ?? 1)
	}
}