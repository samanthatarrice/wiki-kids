require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const test = async () => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test' }],
    model: 'gpt-3.5-turbo',
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
    const { paragraphsArray } = req.body;

    // Shorten the prompt to fit within the model's maximum context length
    const shortenedPrompt = `Rewrite the paragraphs from the ${paragraphsArray.slice(
      0,
      5,
    )} so that they can be read by an average second grader.`;

    const openaiResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: shortenedPrompt
        }
      ],
      max_tokens: 300,
    });

    console.log(openaiResponse.choices[0].message.content);
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
