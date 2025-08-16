import { PrismaClient } from '@prisma/client'
import * as argon2 from 'argon2'

const prisma = new PrismaClient()

async function main() {
	const tenant = await prisma.tenant.upsert({
		where: { slug: 'acme' },
		update: {},
		create: { name: 'Acme Corp', slug: 'acme', isGdprEnabled: true },
	})

	const adminRole = await prisma.role.upsert({
		where: { tenantId_key: { tenantId: tenant.id, key: 'admin' } },
		update: {},
		create: { tenantId: tenant.id, key: 'admin', name: 'Administrator' },
	})
	await prisma.permission.createMany({
		data: [
			{ roleId: adminRole.id, action: '*', resource: '*' },
		],
	})

	const auditorRole = await prisma.role.upsert({
		where: { tenantId_key: { tenantId: tenant.id, key: 'auditor' } },
		update: {},
		create: { tenantId: tenant.id, key: 'auditor', name: 'Auditor' },
	})

	const adminEmail = 'admin@acme.com'
	const passwordHash = await argon2.hash('ChangeMe123!')
	const adminUser = await prisma.user.upsert({
		where: { email: adminEmail },
		update: {},
		create: {
			email: adminEmail,
			passwordHash,
			fullName: 'Admin User',
			tenantId: tenant.id,
			isActive: true,
		},
	})
	await prisma.userRole.upsert({
		where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
		update: {},
		create: { userId: adminUser.id, roleId: adminRole.id },
	})

	console.log('Seeded tenant, roles, and admin:', tenant.slug)
}

main().finally(async () => prisma.$disconnect())