// Retrieve the selected entry content
// const retrieveEntry = async (resultTitle) => {
//   const wikiEntryString = getWikiEntryString(resultTitle);
//   const htmlString = await getWikiEntryHtml(wikiEntryString);
//   const paragraphsArray = parseWikiParagraphs(htmlString);
//   console.log(paragraphsArray)
//   const botResponse = await getBotResponse(paragraphsArray)
//   console.log(botResponse)
//   return htmlString;
// };
const retrieveEntry = async (resultTitle) => {
  const wikiEntryString = getWikiEntryString(resultTitle);
  const htmlString = await getWikiEntryHtml(wikiEntryString);
  const paragraphsArray = parseWikiParagraphs(htmlString);
  console.log(paragraphsArray);

  const joinedParagraphs = paragraphsArray.join(' '); // Convert array to a single string
  const botResponse = await retrieveBotResponse(joinedParagraphs); // Assuming this function handles the backend request
  console.log(botResponse)
  return htmlString;
};

const getWikiEntryString = (resultTitle) => {
  return 'https://en.wikipedia.org/w/api.php?' +
    new URLSearchParams({
      origin: '*',
      action: 'parse',
      page: resultTitle,
      format: 'json',
    });
};

const getWikiEntryHtml = async (url) => {
  try {
    const req = await fetch(url);
    const json = await req.json();

    if (json.parse && json.parse.text) {
      const htmlString = json.parse.text['*'];
      return htmlString;
    } else {
      console.error('Invalid JSON structure:', json);
    }
  } catch (e) {
    console.error(e);
  }
};

const parseWikiParagraphs = (htmlString) => {
  // Convert html into object:
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  // Find all <p> elements and push them into an array:
  const paragraphs = doc.querySelectorAll('p');
  const paragraphsArray = [];
  for (const paragraph of paragraphs) {
    paragraphsArray.push(paragraph.textContent);
  }
  return paragraphsArray;
};
