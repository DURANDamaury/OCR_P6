const Sauce = require('../models/modelsSauce');

module.exports.like = (req,res) =>
    {
        const userId = req.body.userId;         //Id de l'utilisateur
        const sauceId = req.params.id;          //id de la sauce
        Sauce.updateOne
            (
                { _id: sauceId },
                { $push: { usersLiked: userId }, $inc: { likes: +1 } }
            )
            .then(() => res.status(200).json({ message: "Sauce has been Like successfully" }))
            .catch((error) => res.status(400).json({ error }));
    }

module.exports.dislike = (req,res) =>
    {
        const userId = req.body.userId;         //Id de l'utilisateur
        const sauceId = req.params.id;          //id de la sauce
        Sauce.updateOne
                    (
                        { _id: sauceId },
                        { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } }
                    )
                .then(() => res.status(200).json({ message: 'Sauce has been Dislike successfully' }))
                .catch((error) => res.status(400).json({ error }));
    }

module.exports.undoLike = (req,res) =>
    {
        const userId = req.body.userId;
        const sauceId = req.params.id;
        Sauce.findOne({ _id: sauceId })     //on récupère la sauce
                    .then((sauce) => 
                        {
                            if (sauce.usersLiked.includes(userId))  //On vérifie dans les like si on trouve id de l'utilisateur,
                                                                    //dans quel cas c'est un like qu'on annule.
                                {
                                    Sauce.updateOne
                                        (
                                            { _id: sauceId },
                                            { $pull: { usersLiked: userId }, $inc: { likes: -1 } }  //on supprime userId de la liste des likes et on decrémente les likes
                                        )
                                    .then(() => res.status(200).json({ message: 'Like has been deleted successfully' }))
                                    .catch((error) => res.status(400).json({ error }));
                                }
            
                            if (sauce.usersDisliked.includes(userId))   //On vérifie dans les dislike si on trouve l'utilisateur
                                                                        //dans quel cas on annule un dislike
                                {
                                    Sauce.updateOne
                                        (
                                            { _id: sauceId },
                                            { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } } //on supprime l'userId des dislikes et on décrémente la quantité
                                        )
                                    .then(() => res.status(200).json({ message: 'Dislike has been deleted successfully' }))
                                    .catch((error) => res.status(400).json({ error }));
                                }
                        })
                    .catch((error) => res.status(404).json({ error }));
    }