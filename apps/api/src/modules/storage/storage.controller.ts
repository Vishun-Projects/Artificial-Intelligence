import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { StorageService } from './storage.service'
import { JwtAuthGuard } from '../auth/jwt.guard'

@Controller('storage')
@UseGuards(JwtAuthGuard)
export class StorageController {
	constructor(private readonly storage: StorageService) {}

	@Get('presign')
	presign(@Query('key') key: string, @Query('contentType') contentType?: string) {
		return this.storage.presignPut(key, contentType)
	}
}