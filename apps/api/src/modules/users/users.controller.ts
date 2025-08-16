import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/jwt.guard'
import { Permissions } from '../../common/permissions.decorator'

class ListQuery { tenantId!: string; page?: number; pageSize?: number }
class AssignRoleDto { tenantId!: string; userId!: string; roleKey!: string }

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
	constructor(private readonly users: UsersService) {}

	@Get()
	@Permissions({ resource: 'users', action: 'read' })
	list(@Query() q: ListQuery) {
		const page = Number(q.page || 1)
		const pageSize = Number(q.pageSize || 20)
		return this.users.listUsers(q.tenantId, (page - 1) * pageSize, pageSize)
	}

	@Get('roles')
	@Permissions({ resource: 'users', action: 'read' })
	roles(@Query('tenantId') tenantId: string) {
		return this.users.listRoles(tenantId)
	}

	@Post('assign-role')
	@Permissions({ resource: 'users', action: 'manage' })
	assignRole(@Body() dto: AssignRoleDto) {
		return this.users.assignRole(dto.tenantId, dto.userId, dto.roleKey)
	}
}