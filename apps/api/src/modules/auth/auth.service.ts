import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../../prisma.service'
import * as argon2 from 'argon2'

@Injectable()
export class AuthService {
	constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

	async validateUser(email: string, password: string) {
		const user = await this.prisma.user.findUnique({ where: { email } })
		if (!user || !user.isActive) throw new UnauthorizedException()
		const ok = await argon2.verify(user.passwordHash, password)
		if (!ok) throw new UnauthorizedException()
		return user
	}

	async login(tenantId: string, email: string, password: string) {
		const user = await this.validateUser(email, password)
		if (user.tenantId !== tenantId) throw new UnauthorizedException()
		const payload = { sub: user.id, tenantId }
		const accessToken = await this.jwt.signAsync(payload, {
			secret: process.env.JWT_SECRET || 'dev',
			expiresIn: process.env.JWT_EXPIRES_IN || '15m',
		})
		const refreshToken = await this.jwt.signAsync(payload, {
			secret: process.env.JWT_SECRET || 'dev',
			expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
		})
		return { accessToken, refreshToken }
	}
}