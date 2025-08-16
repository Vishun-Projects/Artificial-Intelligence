import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
	@Get('health')
	health() {
		return { status: 'ok' }
	}

	@Get('version')
	version() {
		return { name: 'grc-api', version: '0.1.0' }
	}
}
