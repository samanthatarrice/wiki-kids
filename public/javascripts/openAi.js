const retrieveBotResponse = async (wikiArray, resultTitle, readingLevel) => {
  try {
    console.time('openai res time');
    const response = await fetch('http://localhost:3000/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wikiArray, resultTitle, readingLevel }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    console.timeEnd('openai res time');

    return result.openaiResponse;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};
