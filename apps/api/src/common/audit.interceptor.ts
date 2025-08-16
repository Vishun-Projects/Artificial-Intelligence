import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, tap } from 'rxjs'
import { PrismaService } from '../prisma.service'

@Injectable()
export class AuditInterceptor implements NestInterceptor {
	constructor(private readonly prisma: PrismaService) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const req: any = context.switchToHttp().getRequest()
		const user = req.user as { userId?: string; tenantId?: string } | undefined
		const method = req.method
		const url = req.url as string
		const ip = req.ip as string
		return next.handle().pipe(
			tap(async (result) => {
				try {
					await this.prisma.auditLog.create({
						data: {
							tenantId: user?.tenantId || req.body?.tenantId || req.query?.tenantId || 'unknown',
							userId: user?.userId,
							action: method,
							entity: url.split('?')[0],
							entityId: undefined,
							metadata: JSON.stringify({ url, status: 200 }),
							ipAddress: ip,
						},
					})
				} catch {}
			}),
		)
	}
}