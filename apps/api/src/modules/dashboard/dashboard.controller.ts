import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { JwtAuthGuard } from '../auth/jwt.guard'
import { Permissions } from '../../common/permissions.decorator'

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
	constructor(private readonly dashboard: DashboardService) {}

	@Get('summary')
	@Permissions({ resource: 'dashboard', action: 'read' })
	summary(@Query('tenantId') tenantId: string) {
		return this.dashboard.summary(tenantId)
	}
}