/* This api is used to determine sentiment of a text-string sent from client app */

// TODO : Return Tweets based on either Keyword or Twitter User Handle - id
export default (req, res) => {
  res.status(200).json(
    { 
      post: req.query, 
      comments : ""
    })
}