document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") {
    initApp()
  }
})

const initApp = () => {
  setSearchFocus();
  const form = document.querySelector("#searchBar");
  form.addEventListener("submit", submitSearch)
}

const submitSearch = (e) => {
  e.preventDefault()
  deleteSearchResults()
  processSearch()
  setSearchFocus()
}

const setSearchFocus = () => {
  document.querySelector("#search").focus();
}

const processSearch = async () => {
  clearStatsLine();
  const searchTerm = getSearchTerm();
  if (searchTerm === "") return;
  const resultArray = await retrieveSearchResults(searchTerm)
  if (resultArray.length) buildSearchResults(resultArray)
  setStatsLine(resultArray.length)
}

const deleteSearchResults = () => {
  const parentEl = document.querySelector("#searchResults")
  let childEl = parentEl.lastElementChild
  while (childEl) {
    parentEl.removeChild(childEl)
    childEl = parentEl.lastElementChild
  }
}

const buildSearchResults = (resultArray) => {
  resultArray.forEach(result => {
    const resultItem = createResultItem(result)
    const resultContent = document.createElement("div")
    resultContent.classList.add("resultContents")
    if (result.img) {
      const resultImage = createResultImage(result)
      resultContent.append(resultImage)
    }
    const resultText = createResultText(result)
    resultContent.append(resultText)
    resultItem.append(resultContent)
    const searchResults = document.querySelector("#searchResults")
    searchResults.append(resultItem)
  })
}

const createResultItem = (result) => {
  const resultItem = document.createElement('div')
  resultItem.classList.add('result-item') // This won't work now since we don't have any css
  const resultTitle = document.createElement('div');
  resultItem.classList.add('result-title');
  const link = document.createElement('a')
  link.href = `https://en.wikipedia.org/?curid=${result.id}`
  link.textContent = result.title
  link.target = '_blank'
  resultTitle.appendChild(link)
  resultItem.append(resultTitle)
  return resultItem
}

const createResultImage = (result) => {
  const resultImage = document.createElement("div");
  resultImage.classList.add("result-img");
  const img = document.createElement("img");
  img.src = result.img;
  img.alt = result.title;
  resultImage.append(img);
  return resultImage;
}

const createResultText = (result) => {
    const resultText = document.createElement('div');
    resultText.classList.add('result-text');
    const resultDescription = document.createElement('p');
    resultDescription.classList.add('result-description');
    resultDescription.textContent = result.text;
    resultText.append(resultDescription);
    return resultText;
}

const clearStatsLine = () => {
  document.querySelector('#stats').textContent = ''
}

const setStatsLine = (numberOfResults) => {
  const statsLine = document.querySelector('#stats')
  if (numberOfResults) {
    statsLine.textContent = `Displaying ${numberOfResults} results.`
  } else {
    statsLine.textContent = 'Sorry, no results.'
  }
}

const getSearchTerm = () => {
  const rawSearchTerm = document.querySelector("#search")
    .value
    .trim();
  const regex = /[ ]{2,}/gi // Looks for more than one space
  const searchTerm = rawSearchTerm.replaceAll(regex, " ")
  return searchTerm
}

const retrieveSearchResults = async (searchTerm) => {
  const wikiSearchString = getWikiSearchString(searchTerm)
  const wikiSearchResults = await requestData(wikiSearchString)
  let resultArray = []
  if (wikiSearchResults.hasOwnProperty("query")) {
    resultArray = processWikiResults(wikiSearchResults.query.pages)
  }
  return resultArray
}

const getWikiSearchString = (searchTerm) => {
  const maxChars = getMaxChars()
  const rawSearchString = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchTerm}&gsrlimit=20&prop=pageimages|extracts&exchars=${maxChars}&exintro&explaintext&exlimit=max&format=json&origin=*`
  const searchString = encodeURI(rawSearchString)
  return searchString
}

const getMaxChars = () => {
  const width = window.innerWidth || document.body.clientWidth;
  let maxChars
  if (width < 414) maxChars = 65;
  if (width >= 414 && width < 1400) maxChars = 100;
  if (width >= 1400) maxChars = 130;
  return maxChars
}

const requestData = async (searchString) => {
  try {
    const res = await fetch(searchString)
    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

const processWikiResults = (results) => {
  const resultArray = []
  Object.keys(results).forEach(key => {
    const id = key
    const title = results[key].title
    const text = results[key].extract
    const img = results[key].hasOwnProperty("thumbnail")
      ? results[key].thumbnail.source
      : null
    const item = { id,title,img,text }
    resultArray.push(item)
  })
  return resultArray
}
