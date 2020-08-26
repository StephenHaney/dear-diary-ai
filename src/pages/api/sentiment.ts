import { NextApiRequest, NextApiResponse } from 'next';
const aposToLexForm = require('apos-to-lex-form');
const SpellCorrector = require('spelling-corrector');
const natural = require('natural');
const StopWord = require('stopword');

// init spelling correction:
const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

/** Pass this a "sample" json key with a string to test for sentiment */
export default (req: NextApiRequest, res: NextApiResponse) => {
  const data = JSON.parse(req.body);
  const { sample } = data;

  if (sample && typeof sample === 'string') {
    // Get rid of contractions (I'm => I am)
    console.time('lex');
    const lexedSample = aposToLexForm(sample);
    console.timeEnd('lex');
    // Everything lower case
    console.time('case');
    const casedSample = lexedSample.toLowerCase();
    console.timeEnd('case');
    // Remove non-alpha characters
    console.time('alpha');
    const alphaOnlySample = casedSample.replace(/[^a-zA-Z\s]+/g, '');
    console.timeEnd('alpha');

    // Convert sample to tokens:
    console.time('token');
    const { WordTokenizer } = natural;
    const tokenizer = new WordTokenizer();
    const tokenizedSample = tokenizer.tokenize(alphaOnlySample);
    console.timeEnd('token');

    // Correct spelling:
    console.time('spelling');
    tokenizedSample.forEach((word: string, index: number) => {
      tokenizedSample[index] = spellCorrector.correct(word);
    });
    console.timeEnd('spelling');

    // Remove stop words:
    console.time('stop');
    const filteredSample = StopWord.removeStopwords(tokenizedSample);
    console.timeEnd('stop');

    console.time('Sentiment');
    const { SentimentAnalyzer, PorterStemmer } = natural;
    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'pattern');
    const sentiment = analyzer.getSentiment(filteredSample);
    console.timeEnd('Sentiment');
    res.status(200).json({ sentiment });
  } else {
    res.status(500).end();
  }
};
