import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())

	const config = new DocumentBuilder()
		.setTitle('GRC Platform API')
		.setDescription('Enterprise GRC API')
		.setVersion('0.1.0')
		.addBearerAuth()
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('/docs', app as any, document)

	await app.listen(process.env.PORT ? Number(process.env.PORT) : 3001, '0.0.0.0')
}
bootstrap()
