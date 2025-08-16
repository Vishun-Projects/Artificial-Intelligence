import { Controller, Get, Query } from '@nestjs/common'
import { TenantsService } from './tenants.service'

@Controller('tenants')
export class TenantsController {
	constructor(private readonly tenants: TenantsService) {}

	@Get('by-slug')
	bySlug(@Query('slug') slug: string) {
		return this.tenants.getBySlug(slug)
	}
}