import { NextApiRequest, NextApiResponse } from 'next';
const vader = require('vader-sentiment');

/** Pass this a "sample" json key with a string to test for sentiment */
export default (req: NextApiRequest, res: NextApiResponse) => {
  const data = JSON.parse(req.body);
  const { sample } = data;

  if (sample && typeof sample === 'string') {
    // console.time('vader');
    const sentiment = vader.SentimentIntensityAnalyzer.polarity_scores(sample).compound;
    // console.timeEnd('vader');

    // console.log(sentiment);

    res.status(200).json({ sentiment });
  } else {
    res.status(500).end();
  }
};
