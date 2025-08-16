import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { DocumentsService } from './documents.service'

class ListQuery { tenantId!: string }
class UploadDto { tenantId!: string; title!: string; contentUrl!: string }

@Controller('documents')
export class DocumentsController {
	constructor(private readonly documents: DocumentsService) {}

	@Get()
	list(@Query() q: ListQuery) {
		return this.documents.list(q.tenantId)
	}

	@Post()
	create(@Body() body: UploadDto) {
		return this.documents.create(body.tenantId, body.title, body.contentUrl)
	}
}