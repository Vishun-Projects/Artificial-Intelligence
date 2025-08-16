import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { DocumentsService } from './documents.service'
import { JwtAuthGuard } from '../auth/jwt.guard'
import { Permissions } from '../../common/permissions.decorator'

class ListQuery { tenantId!: string }
class UploadDto { tenantId!: string; title!: string; contentUrl!: string }

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
	constructor(private readonly documents: DocumentsService) {}

	@Get()
	@Permissions({ resource: 'documents', action: 'read' })
	list(@Query() q: ListQuery) {
		return this.documents.list(q.tenantId)
	}

	@Post()
	@Permissions({ resource: 'documents', action: 'create' })
	create(@Body() body: UploadDto) {
		return this.documents.create(body.tenantId, body.title, body.contentUrl)
	}
}