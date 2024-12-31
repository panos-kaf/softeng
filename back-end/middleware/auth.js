const authenticate = (req, res, next) => {
    const secretKey = req.headers['secret-key'];

    // Check if the API key is valid (this is a simple example)
    if (secretKey !== process.env.MY_SECRET_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}
module.exports = authenticate;