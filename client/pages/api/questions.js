import { PrismaClient } from '@prisma/client';



export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
        const prisma = new PrismaClient();
       const excludeId =req.id;
       console.log('req.id',req.id);
        const questions = await prisma.questions.findMany({
            where: {
              id: {
                not: excludeId,
              },
            },
          });
      
      res.status(200).json(questions);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching questions' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
