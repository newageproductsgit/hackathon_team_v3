// pages/api/questions/[ids].js

import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;

  // Convert the ids from a comma-separated string to an array of integers
  const idArray = id.split(',').map(id => parseInt(id));

  try {
    const query = `
      SELECT q.*, a.*
      FROM questions q
      LEFT JOIN answers a ON q.id = a.question_id
      WHERE q.id NOT IN (${idArray.map(() => '?').join(', ')})
    `;

    const results = await prisma.$queryRawUnsafe(query, ...idArray);


    // Transform the results into the desired format
    const transformedResults = results.reduce((acc, curr) => {
        const { question_id, question_text, answer_text, correct_answer_id } = curr;
        // Check if the question is already in the accumulator
        const existingQuestion = acc.find(q => q.question_id === question_id);
        if (existingQuestion) {
          // Add answer text to existing question's answer_text array
          existingQuestion.answer_text.push(answer_text);
        } else {
          // Create a new question object and add it to the accumulator
          acc.push({
            question_id,
            question_text,
            answer_text: [answer_text],
            correct_answer_id
          });
          //answer_text =[];
        }
        return acc;
      }, []);
  
     

    if (results.length === 0) {
      return res.status(404).json({ error: 'No questions found' });
    }

   // res.status(200).json(results);
    res.status(200).json(transformedResults);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error',error });
  }
}
