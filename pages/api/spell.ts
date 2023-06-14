import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { fileURL, jobDescription, feedback } = req.body;
  try {
    const response = await fetch('https://api.respell.ai/v1/run', {
      method: 'POST',
      headers: {
        // This is your API key
        authorization: 'Bearer ' + process.env.RESPELL_API_KEY,
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        spellId: process.env.SPELL_ID,
        spellVersionId: process.env.SPELL_VERSION_ID,
        // Fill in dynamic values for each of your 3 input blocks
        inputs: {
          input: 'You are an AI agent that ranks resumes out of a score of 100 given a resume, job description, and feedback.',
          additional_feedback: feedback,
          job_description: jobDescription,
          resume: fileURL,
        },
      }),
    });
    console.log(process.env.RESPELL_API_KEY)
    console.log(process.env.SPELL_ID)
    console.log(process.env.SPELL_VERSION_ID)
    const output = await response.json();
    console.log("api: ", output)
    return res.status(200).json(output);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};