import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'

@Injectable()
export class TenantsService {
	constructor(private readonly prisma: PrismaService) {}

	async getBySlug(slug: string) {
		const tenant = await this.prisma.tenant.findUnique({ where: { slug } })
		if (!tenant) throw new NotFoundException('Tenant not found')
		return tenant
	}
}