import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'

@Injectable()
export class IncidentsService {
	constructor(private readonly prisma: PrismaService) {}

	list(tenantId: string) {
		return this.prisma.incident.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } })
	}

	create(tenantId: string, title: string, severity = 1, status = 'OPEN') {
		return this.prisma.incident.create({ data: { tenantId, title, severity, status } })
	}
}