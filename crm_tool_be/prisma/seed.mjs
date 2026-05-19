import { PrismaClient } from '@prisma/client';

import { createMockPatients } from './mock-patients.mjs';

const prisma = new PrismaClient();

async function main() {
  const patients = createMockPatients();

  await prisma.patientVisit.deleteMany();
  await prisma.patient.deleteMany();

  for (const patient of patients) {
    await prisma.patient.create({
      data: {
        id: patient.id,
        name: patient.name,
        lastname: patient.lastname,
        phone: patient.phone,
        email: patient.email,
        address: patient.address,
        dateOfBirth: patient.dateOfBirth,
        medicalHistory: patient.medicalHistory,
        visits: {
          create: patient.visits,
        },
      },
    });
  }

  console.log(`Seeded ${patients.length} patients.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
