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

// ----
