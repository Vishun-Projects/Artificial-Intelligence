import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'

@Injectable()
export class DocumentsService {
	constructor(private readonly prisma: PrismaService) {}

	list(tenantId: string) {
		return this.prisma.document.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } })
	}

	async create(tenantId: string, title: string, contentUrl: string, ownerId?: string) {
		const creatorId = ownerId || (await this.prisma.user.findFirst({ where: { tenantId } }))?.id!
		return this.prisma.document.create({
			data: {
				tenantId,
				title,
				status: 'DRAFT',
				createdById: creatorId,
				ownerId: creatorId,
				versions: {
					create: { version: 1, contentUrl, createdById: creatorId },
				},
			},
		})
	}
}