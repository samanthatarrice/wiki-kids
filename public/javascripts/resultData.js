// Retrieve the selected entry content
const retrieveEntry = async (resultTitle) => {
  const wikiEntryString = getWikiEntryString(resultTitle);
  const content = getWikiEntryContent(wikiEntryString);
  return content
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

const getWikiEntryContent = async (url) => {
  try {
      const req = await fetch(url);
      const json = await req.json();
      console.log(json)
      return json.parse.text['*']
  } catch (e) {
      console.error(e);
  }
};
