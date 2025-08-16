import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './modules/auth/auth.module'
import { DocumentsModule } from './modules/documents/documents.module'
import { TenantsModule } from './modules/tenants/tenants.module'
import { DatabaseModule } from './database.module'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { AuditInterceptor } from './common/audit.interceptor'
import { RisksModule } from './modules/risks/risks.module'
import { IncidentsModule } from './modules/incidents/incidents.module'
import { DashboardModule } from './modules/dashboard/dashboard.module'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '.env.local', '.env.development'] }),
		DatabaseModule,
		AuthModule,
		DocumentsModule,
		TenantsModule,
		RisksModule,
		IncidentsModule,
		DashboardModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{ provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
	],
})
export class AppModule {}
