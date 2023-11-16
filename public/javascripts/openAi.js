const retrieveBotResponse = async (section, resultTitle, readingLevel) => {
  try {
    console.time('openai res time');
    const response = await fetch('http://localhost:3000/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ section, resultTitle, readingLevel }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    console.timeEnd('openai res time');

    return result.openaiResponse.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

const renderSection = (openaiResponse) => {
  const selectedEntryContainer = document.querySelector('#selectedResult');

  // Create a new div to hold the content for the current section
  const sectionDiv = document.createElement('div');

  // Set the innerHTML of the new div with the OpenAI response
  sectionDiv.innerHTML = openaiResponse;

  // Append the new div to the container
  selectedEntryContainer.appendChild(sectionDiv);
};
