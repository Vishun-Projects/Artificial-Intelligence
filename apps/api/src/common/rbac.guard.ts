import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PERMISSIONS_KEY, RequiredPermission } from './permissions.decorator'
import { PrismaService } from '../prisma.service'

@Injectable()
export class RbacGuard implements CanActivate {
	constructor(private readonly reflector: Reflector, private readonly prisma: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const required = this.reflector.getAllAndOverride<RequiredPermission[]>(PERMISSIONS_KEY, [
			context.getHandler(),
			context.getClass(),
		])
		if (!required || required.length === 0) return true
		const req: any = context.switchToHttp().getRequest()
		const user = req.user as { userId: string; tenantId: string } | undefined
		if (!user) return false
		const roles = await this.prisma.userRole.findMany({
			where: { userId: user.userId },
			include: { role: { include: { permissions: true } } },
		})
		const perms = new Set(roles.flatMap(r => r.role.permissions.map(p => `${p.resource}:${p.action}`)))
		return required.every(r => perms.has(`${r.resource}:${r.action}`) || perms.has(`*:*`) || perms.has(`${r.resource}:*`) || perms.has(`*:${r.action}`))
	}
}