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
      model: 'text-davinci-003',
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
  // const capitalizedAnimal =
  //   requete.toUpperCase() + requete.slice(1).toLowerCase();
  return `Suggérer des synonymes pour le mot suivant. Les synonymes doivent être séparés par une virgule et un espace. Les synonymes ne doivent pas contenir de répétition.  
Mot: Travailler
Synonymes: œuvrer, s'activer, s'employer, opérer, fonctionner, s'efforcer, s'appliquer, s'exercer, s'occuper, s'atteller, s'adonner, s'astreindre, se consacrer
Mot: ouvrage
Synonymes: livre, publication, écrit, manuscrit, traité, opuscule, recueil, volume, livret, brochure
Mot: murmurer
Synonymes: babiller,  bafouiller,  balbutier,  baragouiner,  bougonner,  bourdonner,  bredouiller,  broncher,  bruire,  chanter,  couler,  dire,  frémir,  fredonner,  froufrouter,  gémir,  gazouiller,  geindre,  gringotter,  grognasser,  grogner,  grognonner,  grommeler,  gronder,  groumer,  mâchouiller,  marmonner,  marmotter,  maronner,  maugréer,  parler bas,  prononcer,  protester,  râler,  rechigner,  renauder,  rogner,  rognonner,  ronchonner,  ronfler,  rouscailler,  rouspéter,  se lamenter,  se plaindre,  souffler
Mot: chanter
Synonymes: beugler, bourdonner, brailler, chansonner, chantonner, conter, crier, débiter, dégoiser, détonner, dire, entonner, exécuter, exalter, extorquer, fredonner, gazouiller, glorifier, goualer, grésiller, gringotter, gueuler, jaser, louer, machicoter, miauler, murmurer, nasiller, nuancer, pépier, piauler, plaire, proclamer, psalmodier, publier, rabâcher, réciter, raconter, radoter, railler, ramager, répéter, redire, roucouler, s'égosiller, se glorifier, seriner, se vanter, siffler, solfier, sourire, striduler, ténoriser, tirer, vocaliser
Mot: affaire
Synonymes: accident, accrochage, accusation, échange, économie, action, activité, agence, agité, énigme, épisode, établissement, atelier, attaque, attentif, événement, aventure, bagarre, barda, baroud, bataclan, bataille, bazar, besogne, besoin, bidule, boîte, bordel, bourse, boutique, bureau, business, but, cabinet, cas, cause, chantier, charge, choc, chose, circonstance, comédie, combat, combinaison, commerce, complication, compte, conjoncture, contestation, controverse, convention, débat, dégourdi, déluré, démêlé, danger, devoir, difficulté, discussion, dispute, dossier, duel, embarras, emmanchure, empressé, engagement, ennui, entreprise, espèce, façon, fait, fait-divers, finance, firme, frétillant, fringant, galant, galanterie, grabuge, guerre, guilleret, histoire, holding, industrie, litige, machin, magasin, marché, mésaventure, négoce, obligation, occasion, occupé, occupation, oeuvre, opération, organisme, politique, préoccupation, problème, procès, querelle, question, rôle, rencontre, sémillant, scandale, situation, société, souci, soucieux, spéculation, tâche, tracas, traite, transaction, travail, truc, trust, usine
Mot: chose
Synonymes: bijou, bric-à-brac, action, affaire, article, événement, babiole, bibelot, bagatelle, batifolage, bidule, bien, bricole, capital, circonstance, condition, engin, fait, fourbi, instrument, machin, objet, phénomène, possession, réalité, richesse, rien, sujet, truc
Mot: ${requete}
Synonymes:`;
}
