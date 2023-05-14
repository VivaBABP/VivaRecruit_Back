import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const ecologie = await prisma.interests.upsert({
        create: {
      labelInterest: 'Ecologie',
        }, update: {}, where: { labelInterest: 'Ecologie', }
    });
    const economique = await prisma.interests.upsert({
        create: {
      labelInterest: 'Economique',
        }, update: {}, where: { labelInterest: 'Economique',}
    });
    const communication = await prisma.interests.upsert({
        create: {
            labelInterest: 'Communication'
        }, update: {}, where: { labelInterest: 'Communication', }
    });
    const sport = await prisma.interests.upsert({
        create: {
            labelInterest: 'Sport'
        }, update: {}, where: { labelInterest: 'Sport' }
    });
    const rencontre = await prisma.interests.upsert({
        create: {
            labelInterest: 'Rencontre'
        }, update: {}, where: { labelInterest: 'Rencontre' }
    });
}
main()
    .then(async () => {
    await prisma.$disconnect();
  })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
