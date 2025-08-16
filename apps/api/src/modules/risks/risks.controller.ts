import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { RisksService } from './risks.service'

class RisksListQuery { tenantId!: string }
class CreateRiskDto { tenantId!: string; title!: string; likelihood?: number; impact?: number }

@Controller('risks')
export class RisksController {
	constructor(private readonly risks: RisksService) {}

	@Get()
	list(@Query() q: RisksListQuery) {
		return this.risks.list(q.tenantId)
	}

	@Post()
	create(@Body() body: CreateRiskDto) {
		return this.risks.create(body.tenantId, body.title, body.likelihood ?? 1, body.impact ?? 1)
	}
}