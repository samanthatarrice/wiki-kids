const getSearchTerm = () => {
  const rawSearchTerm = document.querySelector('#search').value.trim();
  const regex = /[ ]{2,}/gi; // Looks for more than one space after a word
  const searchTerm = rawSearchTerm.replaceAll(regex, ' ');
  return searchTerm;
};

const retrieveSearchResults = async (searchTerm) => {
  const wikiSearchString = getWikiSearchString(searchTerm);
  const wikiSearchResults = await requestData(wikiSearchString);
  let resultArray = [];
  if (wikiSearchResults.hasOwnProperty('query')) {
    resultArray = processWikiResults(wikiSearchResults.query.pages);
  }
  return resultArray;
};

const getWikiSearchString = (searchTerm) => {
  const maxChars = getMaxChars();
  const rawSearchString = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchTerm}&gsrlimit=20&prop=pageimages|extracts&exchars=${maxChars}&exintro&explaintext&exlimit=max&format=json&origin=*`;
  const searchString = encodeURI(rawSearchString);
  return searchString;
};

const getMaxChars = () => {
  const width = window.innerWidth || document.body.clientWidth;
  let maxChars;
  if (width < 414) maxChars = 65;
  if (width >= 414 && width < 1400) maxChars = 100;
  if (width >= 1400) maxChars = 130;
  return maxChars;
};

const requestData = async (searchString) => {
  try {
    const res = await fetch(searchString);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

const processWikiResults = (results) => {
  const resultArray = [];
  Object.keys(results).forEach((key) => {
    const id = key;
    const title = results[key].title;
    const text = results[key].extract;
    const img = results[key].hasOwnProperty('thumbnail')
      ? results[key].thumbnail.source
      : null;
    const item = { id, title, img, text };
    resultArray.push(item);
  });
  return resultArray;
};
