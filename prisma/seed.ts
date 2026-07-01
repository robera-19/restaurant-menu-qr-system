import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Cleaning Database ---');
  // Clear old data to prevent errors
  await prisma.qrScan.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.menuItemImage.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.qrCode.deleteMany();
  await prisma.admin.deleteMany();

  console.log('--- Creating Super Admin ---');
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.admin.create({
    data: {
      fullName: 'Ethio Buna Manager',
      email: 'admin@ethiobuna.com',
      passwordHash: hashedPassword,
      role: 'ADMIN',
      isVerified: true,
      isActive: true,
    },
  });

  console.log('--- Creating Categories ---');
  // We save the IDs to link them to food items later
  const cat1 = await prisma.category.create({
    data: { name: 'Hot Drinks', createdBy: admin.id },
  });
  const cat2 = await prisma.category.create({
    data: { name: 'Traditional Food', createdBy: admin.id },
  });
  const cat3 = await prisma.category.create({
    data: { name: 'Pizza', createdBy: admin.id },
  });

  console.log('--- Seeding Finished ---');
  console.log('Login Email: admin@ethiobuna.com');
  console.log('Login Password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
