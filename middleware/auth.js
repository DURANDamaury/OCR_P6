const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => 
    {
    try 
        {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'Bk+CI8w!PIDK5!AwAT7957T1oziRRuUyQ@^pU&B@t%znDDp5BUaWLGw^AV=6');
        const userId = decodedToken.userId;
        req.auth = 
            {
                userId: userId
            };
        next();
        }
    catch(error) 
        {
            res.status(401).json({ error });
        }
    };