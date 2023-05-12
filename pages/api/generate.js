import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function uniq(a) {
  return a.sort().filter(function (item, pos, ary) {
    return !pos || item != ary[pos - 1];
  });
}

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          'OpenAI API key not configured, please follow instructions in README.md',
      },
    });
    return;
  }

  const query = req.body.query || '';
  if (query.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Veuillez entrer une expression valide.',
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-002',
      prompt: generatePrompt(query),
      max_tokens: 300,
      temperature: 0,
    });

    // Remove the last dot '.' from the result if OpenAI added it
    const result = completion.data.choices[0].text.split('.').join('');
    const elementsArray = uniq(result.split(', '));

    res.status(200).json({
      result: result,
      elements: elementsArray,
      query: query,
    });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  }
}

function generatePrompt(requete) {
  return `Suggérer des synonymes pour le mot suivant. Les synonymes doivent être séparés par une virgule et un espace.
Mot: Travailler
Synonymes: œuvrer, s'activer, s'employer, opérer, fonctionner, s'efforcer, s'appliquer, s'exercer, s'occuper, s'atteller, s'adonner, s'astreindre, se consacrer
Mot: ${requete}
Synonymes:`;
}
