import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'

@Injectable()
export class DashboardService {
	constructor(private readonly prisma: PrismaService) {}

	async summary(tenantId: string) {
		const [riskCount, incidentOpen, docsCount] = await Promise.all([
			this.prisma.risk.count({ where: { tenantId } }),
			this.prisma.incident.count({ where: { tenantId, status: 'OPEN' } }),
			this.prisma.document.count({ where: { tenantId } }),
		])
		return {
			riskCount,
			incidentOpen,
			docsCount,
			riskHeatmap: { /* placeholder */ grid: [] },
		}
	}
}