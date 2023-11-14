// Remove elements from previous search:
const clearStatsLine = () => {
  document.querySelector('#stats').textContent = '';
};

const deleteSearchResults = () => {
  const parentEl = document.querySelector('#searchResults');
  let childEl = parentEl.lastElementChild;
  while (childEl) {
    parentEl.removeChild(childEl);
    childEl = parentEl.lastElementChild;
  }
};

// Create elements for new search:
const setStatsLine = (numberOfResults) => {
  const statsLine = document.querySelector('#stats');
  if (numberOfResults) {
    statsLine.textContent = `Displaying ${numberOfResults} results.`;
  } else {
    statsLine.textContent = 'Sorry, no results.';
  }
};

const buildSearchResults = (resultArray) => {
  const searchResults = document.querySelector('#searchResults');
  resultArray.forEach((result) => {
    const resultItem = createResultItem(result);
    const resultContent = document.createElement('div');
    resultContent.classList.add('resultContents');
    // Create and append image:
    if (result.img) {
      const resultImage = createResultImage(result);
      resultContent.append(resultImage);
    }
    // Create and append text:
    const resultText = createResultText(result);
    resultContent.append(resultText);
    // Create and append link to show results:
    const selectResultLink = createSelectResultLink(result);
    resultContent.append(selectResultLink);
    // Append content to item, then item to the list of results:
    resultItem.append(resultContent);
    searchResults.append(resultItem);
  });
  searchResults.addEventListener('click', handleSelectResult)
};

// Create each result item's container and title in DOM
const createResultItem = (result) => {
  // Create each item container:
  const resultItem = document.createElement('div');
  resultItem.classList.add('result-item');
  resultItem.dataset.resultId = result.id; // Set the result ID as a data attribute
  // Create item title:
  const resultTitle = document.createElement('div');
  resultItem.classList.add('result-title');
  // Create item link:
  const link = document.createElement('a');
  link.href = `https://en.wikipedia.org/?curid=${result.id}`;
  link.textContent = result.title;
  link.target = '_blank';
  // Append elements:
  resultTitle.appendChild(link);
  resultItem.append(resultTitle);
  return resultItem;
};

const createResultImage = (result) => {
  const resultImage = document.createElement('div');
  resultImage.classList.add('result-img');
  const img = document.createElement('img');
  img.src = result.img;
  img.alt = result.title;
  resultImage.append(img);
  return resultImage;
};

const createResultText = (result) => {
  const resultText = document.createElement('div');
  resultText.classList.add('result-text');
  const resultDescription = document.createElement('p');
  resultDescription.classList.add('result-description');
  resultDescription.textContent = result.text;
  resultText.append(resultDescription);
  return resultText;
};

const createSelectResultLink = (result) => {
  const selectResultLink = document.createElement('a');
  selectResultLink.textContent = 'Show results';
  selectResultLink.href = '#';
  return selectResultLink;
};

// SHOW SELECTED RESULT:

const handleSelectResult = (e) => {
  const selectedResult = e.target.closest('.result-item');
  const resultTitle = selectedResult.querySelector('.result-title a').textContent;
  if (selectedResult) {
    const resultId = selectedResult.dataset.resultId;
    displaySelectedEntry(resultTitle);
  }
};

const displaySelectedEntry = async (resultTitle) => {
  const selectedEntryContent = await retrieveEntry(resultTitle);
  const cleanedHTML = selectedEntryContent.replace(/^```|```$/g, '');
  const selectedEntryContainer = document.querySelector('#selectedResult');
  selectedEntryContainer.innerHTML = cleanedHTML;
};
