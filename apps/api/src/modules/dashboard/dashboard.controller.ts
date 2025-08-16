import { Controller, Get, Query } from '@nestjs/common'
import { DashboardService } from './dashboard.service'

@Controller('dashboard')
export class DashboardController {
	constructor(private readonly dashboard: DashboardService) {}

	@Get('summary')
	summary(@Query('tenantId') tenantId: string) {
		return this.dashboard.summary(tenantId)
	}
}