const fs = require('fs');
const https = require('https');
const MarkovMachine = require('./markov.js');

function readFile(filename) {
  try {
    return fs.readFileSync(filename, 'utf-8');
  } catch (error) {
    console.error(`Error reading file '${filename}': ${error.message}`);
    process.exit(1);
  }
}

function readUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        resolve(data);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

function printUsageAndExit() {
  console.log('Usage: node makeText.js [file|url] [filename|url]');
  process.exit(1);
}

if (process.argv.length !== 4) {
  printUsageAndExit();
}

const sourceType = process.argv[2];
const source = process.argv[3];

if (sourceType === 'file') {
  const text = readFile(source);
  const markovMachine = new MarkovMachine(text);
  const generatedText = markovMachine.makeText();
  console.log(generatedText);
} else if (sourceType === 'url') {
  readUrl(source)
    .then((text) => {
      const markovMachine = new MarkovMachine(text);
      const generatedText = markovMachine.makeText();
      console.log(generatedText);
    })
    .catch((error) => {
      console.error(`Error fetching URL '${source}': ${error.message}`);
      process.exit(1);
    });
} else {
  printUsageAndExit();
}


