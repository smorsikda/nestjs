import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('123456', 10);

    // Crea el tenant solo si no existe
    let tenant = await prisma.tenant.findFirst({ where: { name: 'Tenant Demo' } });
    if (!tenant) {
        tenant = await prisma.tenant.create({ data: { name: 'Tenant Demo' } });
    }

    await prisma.user.upsert({
        where: { email: 'admin@demo.com' },
        update: {},
        create: {
            email: 'admin@demo.com',
            name: 'Administrador',
            password: passwordHash,
            telephone: '88888888',
            role: Role.ADMIN,
            tenantId: tenant.id,
        },
    });

    await prisma.user.upsert({
        where: { email: 'user@demo.com' },
        update: {},
        create: {
            email: 'user@demo.com',
            name: 'Usuario Demo',
            password: passwordHash,
            role: Role.USER,
            tenantId: tenant.id,
        },
    });

    console.log('Seed ejecutado correctamente');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });