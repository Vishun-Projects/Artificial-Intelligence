import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'

@Injectable()
export class RisksService {
	constructor(private readonly prisma: PrismaService) {}

	list(tenantId: string) {
		return this.prisma.risk.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } })
	}

	async create(tenantId: string, title: string, likelihood = 1, impact = 1, ownerId?: string) {
		const resolvedOwnerId = ownerId || (await this.prisma.user.findFirst({ where: { tenantId } }))?.id!
		return this.prisma.risk.create({
			data: {
				tenantId,
				title,
				likelihood,
				impact,
				rating: likelihood * impact,
				status: 'OPEN',
				ownerId: resolvedOwnerId,
			},
		})
	}
}