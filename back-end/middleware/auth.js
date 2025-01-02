const authenticate = (req, res, next) => {
  const token = req.headers['x-observatory-auth']; // Custom header

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    console.log(token);
    console.log(process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key
    req.user = decoded; // Attach decoded token payload to the request
    next();
  }
  catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticate;