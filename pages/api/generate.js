import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
      model: 'text-davinci-003',
      prompt: generatePrompt(query),
      max_tokens: 300,
      temperature: 0.6,
    });

    const elementsArray = completion.data.choices[0].text.split(', ');

    // res.status(200).json({ result: resultMarkup });
    res.status(200).json({
      result: completion.data.choices[0].text,
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
  // const capitalizedAnimal =
  //   requete.toUpperCase() + requete.slice(1).toLowerCase();
  return `Suggérer des synonymes pour le mot suivant.
Mot: Travailler
Synonymes: œuvrer, s'activer, s'employer, opérer, fonctionner, s'efforcer, s'appliquer, s'exercer, s'occuper, s'atteller, s'adonner, s'astreindre, se consacrer
Mot: ouvrage
Synonymes: livre, publication, écrit, manuscrit, traité, opuscule, recueil, volume, livret, brochure
Mot: murmurer
Synonymes: babiller,  bafouiller,  balbutier,  baragouiner,  bougonner,  bourdonner,  bredouiller,  broncher,  bruire,  chanter,  couler,  dire,  frémir,  fredonner,  froufrouter,  gémir,  gazouiller,  geindre,  gringotter,  grognasser,  grogner,  grognonner,  grommeler,  gronder,  groumer,  mâchouiller,  marmonner,  marmotter,  maronner,  maugréer,  parler bas,  prononcer,  protester,  râler,  rechigner,  renauder,  rogner,  rognonner,  ronchonner,  ronfler,  rouscailler,  rouspéter,  se lamenter,  se plaindre,  souffler
Mot: chanter
Synonymes: beugler, bourdonner, brailler, chansonner, chantonner, conter, crier, débiter, dégoiser, détonner, dire, entonner, exécuter, exalter, extorquer, fredonner, gazouiller, glorifier, goualer, grésiller, gringotter, gueuler, jaser, louer, machicoter, miauler, murmurer, nasiller, nuancer, pépier, piauler, plaire, proclamer, psalmodier, publier, rabâcher, réciter, raconter, radoter, railler, ramager, répéter, redire, roucouler, s'égosiller, se glorifier, seriner, se vanter, siffler, solfier, sourire, striduler, ténoriser, tirer, vocaliser
Mot: ${requete}
Synonymes:`;
}
