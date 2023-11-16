require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const gptModel = 'gpt-3.5-turbo-1106';

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
    let { section, resultTitle, readingLevel } = req.body;

    section = JSON.stringify(section);

    const openaiResponse = await openai.chat.completions.create({
      model: gptModel,
      messages: [
        {
          role: 'user',
          content: `Reword the information from the ${section} so that a student with a DRA reading level of ${readingLevel} can read it within their zone of proximal development. Be sure to be as factual and objective as possible. Return this as an html string (please do not include the word html anywhere above the html). Use the subtitle as an <h3> element at the top and the text below that as a <p> element. If the subtitle is "Summary", replace it with the ${resultTitle} and make that element an <h2>.
          ###
          resultTitle: 'Minskin"
          readingLevel: 16
          section: {"subtitle":"Summary","text":["The Minskin is a breed of cat derived from intentional hybrid cross-breedings between the Munchkin and Burmese cat breeds, with the addition of Sphynx and Devon Rex.","The Minskin is short-legged dwarf cat with a very short coat. It is described as having a small to medium-sized semi-cobby muscular body, a rounded head, large ears that are wide at the base, a short broad muzzle with prominent whisker pads and eyes that are large and round, spaced well apart, giving them an open and alert expression. Their fur is a sparse coat, which is more dense on their outer extremities, giving them a unique coat description of \"fur-points\" that define the mask, ears, legs and tail, with a more sparsely coated cashmere-like torso.","Minskin cats are often described as exotic and alien-like, they are sweet tempered and affectionate cats that are playful but not destructive. They are a small breed that requires little grooming and gets along with other animals and humans.[1]"]}
          response: '<h2>Minskin</h2><p>The Minskin is a type of cat that comes from mixing Munchkin cats with Burmese cats, and also adding in some Sphynx and Devon Rex cats. This cat has short legs and a coat that is not very thick. It has a strong body that is not too big, a round head, big ears that start wide at the base, a short wide nose area with noticeable whisker spots, and big round eyes that are set far apart. This gives them a look that is open and alert. Their fur is thicker on their face, ears, legs, and tail, which is called "fur-points." The rest of their body has thinner fur that feels like cashmere. Minskin cats look unusual and almost like they are from another planet. They are friendly, loving, and like to play but they don't cause trouble. They are small, easy to take care of, and they get along well with people and other pets.</p>'
          ###
          resultTitle: ${resultTitle}
          readingLevel: ${readingLevel}
          section: ${section}
          response:
          `,
        },
      ],
      max_tokens: 500,
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
