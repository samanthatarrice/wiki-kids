require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const gptModel = 'gpt-4-1106-preview';

const test = async () => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test' }],
    model: gptModel,
  });
  return chatCompletion.choices[0].message.content
}

// Test openAi
(async () => {
  const result = await test();
  console.log(result);
})();

// Mongoose connect:
main().catch((err) =>
  console.log('There was an error connecting to Mongo:', err),
);

async function main() {
  // * Removed useCreateIndex and useFindAndModify bc it wasn't supported
  await mongoose.connect('mongodb://localhost:27017/wikikids', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Mongo connection open!');
}

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/register', (req, res) => {
  res.render('users/register');
});

app.get('/login', (req, res) => {
  res.render('users/login');
});

app.get('/search', (req, res) => {
  res.render('search/index');
});

app.post('/search', async (req, res) => {
  try {
    const { wikiArray, resultTitle, readingLevel } = req.body;
    // TODO: pass in level
    console.log('readingLevel:', readingLevel);

    // Reading level 16

    const openaiResponse = await openai.chat.completions.create({
      model: gptModel,
      messages: [
        {
          role: 'user',
          content: `Use the information from the ${wikiArray} and reword it so that a student with a DRA reading level of ${readingLevel} can read it. Each subtile should be a different section, with the corresponding text below (except for the first 'Summary' subtitle section. The text from that section should just come directly after the title. Be sure to be as factual and objective as possible. Make sure to use the ${resultTitle} as the main title. Return this as an html string (please just start the string with one back tick and then followed directly with the html), with the main title as an <h2> element, the subtitles as <h3> element, and the text as <p> elements under each corresponding subtitle section. If a section's text is an empty array, don't inlcude that section.
          ###
          resultTitle: 'Minskin"
          readingLevel: 16
          wikiArray: [{"subtitle":"Summary","text":["The Minskin is a breed of cat derived from intentional hybrid cross-breedings between the Munchkin and Burmese cat breeds, with the addition of Sphynx and Devon Rex.","The Minskin is short-legged dwarf cat with a very short coat. It is described as having a small to medium-sized semi-cobby muscular body, a rounded head, large ears that are wide at the base, a short broad muzzle with prominent whisker pads and eyes that are large and round, spaced well apart, giving them an open and alert expression. Their fur is a sparse coat, which is more dense on their outer extremities, giving them a unique coat description of \"fur-points\" that define the mask, ears, legs and tail, with a more sparsely coated cashmere-like torso.","Minskin cats are often described as exotic and alien-like, they are sweet tempered and affectionate cats that are playful but not destructive. They are a small breed that requires little grooming and gets along with other animals and humans.[1]"]},{"subtitle":"History","text":["In 1998, Paul Richard McSorley began the development of the Minskin cat breed in Boston, Massachusetts.[2] Just as the Siamese has color restricted to the points/extremities, Paul McSorley envisioned a cat with short legs and denser fur restricted to the points (fur-points) on the mask, ears, legs and tail, with a noticeably more sparsely coated torso, neck and belly.","To accomplish his goal, he crossed his already established Munchkin show cats with short legs with a full coat of fur. He then introduced and combined 'fuzzy' Sphynx for the hairless characteristic but with denser fur restricted to the extremities, making for a healthier immune system.[citation needed] For the appeal of structure, temperament, type and other desired qualities, he also used his International Award Winning Burmese cats and Devon Rex in the development of his Minskin breeding program. The first standard cat that met his goal was \"TRT I Am Minskin Hear Me Roar\", born in July 2000.[citation needed]","By early 2005 about 50 cats meeting the Minskin vision existed and were registered by The International Cat Association (TICA). In 2008, the Minskin became recognized as a Preliminary New Breed (PNB) and is currently in TICA's program that monitors the development of new breeds and their progress toward achieving the title of Advanced New Breed (ANB), and then Championship."]},{"subtitle":"Minskin cat breed recognition for registration","text":["TICA, TICA is one of two major international cat registries which recognize Minskin cats as a breed and allow registration for pedigree tracking of the Minskin breed. All new breeds of cat must have a unique quality that defines and identifies them as the breed that they are. Minskin cats have a coat description that is unique to them; \"Fur-Points\" are what qualifies the Minskin breed as a unique breed trait which specifically describes more densely compact rex fur on the mask, ears, legs and tail, while maintaining a more sparcely coated torso. The gene responsible for rex fur or lack of, is determined by gene loci. \nIn addition to TICA, Minskins are also recognized by WCF."]},{"subtitle":"External links","text":[]}]
          response: '<h2>Minskin</h2><p>The Minskin is a type of cat that comes from mixing Munchkin cats with Burmese cats, and also adding in some Sphynx and Devon Rex cats. This cat has short legs and a coat that is not very thick. It has a strong body that is not too big, a round head, big ears that start wide at the base, a short wide nose area with noticeable whisker spots, and big round eyes that are set far apart. This gives them a look that is open and alert. Their fur is thicker on their face, ears, legs, and tail, which is called "fur-points." The rest of their body has thinner fur that feels like cashmere. Minskin cats look unusual and almost like they are from another planet. They are friendly, loving, and like to play but they don't cause trouble. They are small, easy to take care of, and they get along well with people and other pets.</p><h3>History</h3><p>In 1998, a man named Paul Richard McSorley started making the Minskin cat breed in Boston, Massachusetts. He wanted to make a cat with short legs and fur that was thicker on the face, ears, legs, and tail, but thinner on the body. He used his Munchkin cats that had short legs and a full coat of fur. Then he added the Sphynx cats, which don't have much hair, to get the look he wanted. He also used Burmese cats and Devon Rex cats because they had good qualities he liked. The first cat that was just right was born in July 2000. By 2005, there were about 50 cats that were just like what Paul McSorley had wanted. These cats were registered with The International Cat Association (TICA). In 2008, TICA started to recognize the Minskin as a new type of cat that was still being watched to see how it developed.</p><h3>Minskin cat breed recognition for registration</h3><p>TICA is a big group that keeps track of different types of cats. They say that Minskin cats are a special breed and they keep records of them. Minskin cats have a special kind of fur called "Fur-Points" that makes them different. This fur is thicker on certain parts.</p>'
          ###
          resultTitle: ${resultTitle}
          readingLevel: ${readingLevel}
          wikiArray: ${wikiArray}
          response:
          `,
        },
      ],
      max_tokens: 1000,
      temperature: 0.2,
    });

    // console.log(openaiResponse.choices[0].message.content);
    // Send the OpenAI response back to the frontend
    res.json({ openaiResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(3000, () => {
  console.log('Serving WikiKids on port 3000');
});
