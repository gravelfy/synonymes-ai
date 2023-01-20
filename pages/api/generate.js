import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: generatePrompt(req.body.animal),
    max_tokens: 300,
    temperature: 0.6,
  });
  res.status(200).json({ result: completion.data.choices[0].text });
}

function generatePrompt(requete) {
  // const capitalizedAnimal =
  //   requete.toUpperCase() + requete.slice(1).toLowerCase();
  return `Suggérer des synonymes pour le mot suivant.
Mot: Travailler
Synonymes: Œuvrer, s'activer, s'employer, opérer, fonctionner, s'efforcer, s'appliquer, s'exercer, s'occuper, s'atteller, s'adonner, s'astreindre, se consacrer.
Mot: ouvrage
Synonymes: Livre, publication, écrit, manuscrit, traité, opuscule, recueil, volume, livret, brochure.
Mot: murmurer
Synonymes: babiller,  bafouiller,  balbutier,  baragouiner,  bougonner,  bourdonner,  bredouiller,  broncher,  bruire,  chanter,  couler,  dire,  frémir,  fredonner,  froufrouter,  gémir,  gazouiller,  geindre,  gringotter,  grognasser,  grogner,  grognonner,  grommeler,  gronder,  groumer,  mâchouiller,  marmonner,  marmotter,  maronner,  maugréer,  parler bas,  prononcer,  protester,  râler,  rechigner,  renauder,  rogner,  rognonner,  ronchonner,  ronfler,  rouscailler,  rouspéter,  se lamenter,  se plaindre,  souffler
Mot: chanter
Synonymes: beugler, bourdonner, brailler, chansonner, chantonner, conter, crier, débiter, dégoiser, détonner, dire, entonner, exécuter, exalter, extorquer, fredonner, gazouiller, glorifier, goualer, grésiller, gringotter, gueuler, jaser, louer, machicoter, miauler, murmurer, nasiller, nuancer, pépier, piauler, plaire, proclamer, psalmodier, publier, rabâcher, réciter, raconter, radoter, railler, ramager, répéter, redire, roucouler, s'égosiller, se glorifier, seriner, se vanter, siffler, solfier, sourire, striduler, ténoriser, tirer, vocaliser
Mot: ${requete}
Synonymes:`;
}
