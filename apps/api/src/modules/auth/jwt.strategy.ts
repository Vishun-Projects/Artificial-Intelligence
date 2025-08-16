import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

export type JwtPayload = {
	sub: string
	tenantId: string
	iat?: number
	exp?: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET || 'dev',
		})
	}

	async validate(payload: JwtPayload) {
		return { userId: payload.sub, tenantId: payload.tenantId }
	}
}