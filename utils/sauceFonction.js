const Sauce = require('../models/modelsSauce');

exports.like = (req,res) =>
    {
        const userId = req.body.userId;         //Id de l'utilisateur
        const sauceId = req.params.id;          //id de la sauce
        Sauce.updateOne
            (
                { _id: sauceId },
                { $push: { usersLiked: userId }, $inc: { likes: +1 } }
            )
            .then(() => res.status(200).json({ message: message }))
            .catch((error) => res.status(400).json({ error }));
    }