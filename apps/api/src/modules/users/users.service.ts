import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	async listUsers(tenantId: string, skip = 0, take = 20) {
		const [items, total] = await Promise.all([
			this.prisma.user.findMany({ where: { tenantId }, skip, take, orderBy: { createdAt: 'desc' } }),
			this.prisma.user.count({ where: { tenantId } }),
		])
		return { items, total }
	}

	listRoles(tenantId: string) {
		return this.prisma.role.findMany({ where: { tenantId }, include: { permissions: true } })
	}

	async assignRole(tenantId: string, userId: string, roleKey: string) {
		const role = await this.prisma.role.findFirst({ where: { tenantId, key: roleKey } })
		if (!role) throw new NotFoundException('Role not found')
		await this.prisma.userRole.upsert({
			where: { userId_roleId: { userId, roleId: role.id } },
			update: {},
			create: { userId, roleId: role.id },
		})
		return { ok: true }
	}
}