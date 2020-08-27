/* This api is used to determine sentiment of a text-string sent from client app */
const vader = require('vader-sentiment');

export default (req, res) => {
  switch (req.method) {
    case 'GET':
      let queryString = (req.query);
      let inputString = queryString.q;
      console.log("input string : " + inputString);
      // Invoke the NLP model in using VADER to detect sentiment
      const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(inputString);
      console.log(intensity);
      // The pos, neu, and neg scores are ratios for proportions of text that fall in each category 
      // Sum of pos, neg and neu should all add up to be 1... or close to it with float operation 
      // positive sentiment: compound score >= 0.05  
      // neutral sentiment: (compound score > -0.05) && (compound score < 0.05)
      // negative sentiment: compound score <= -0.05
      res.status(200).json(
        { 
          negative: intensity.neg,
          positive: intensity.pos,
          neutral: intensity.neu,
          compound : intensity.compound
        })
      break
    case 'POST':
      // TODO : Handle POST request if need be
      break
    default:
      res.status(405).end() //Method Not Allowed
      break
  }
}