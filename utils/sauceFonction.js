exports.testFonction = (msg) => {console.log('msg')}

exports.upDateOne = (Sauce, sauceId, userId, likeDislike,message) =>
    {
    
    Sauce.updateOne
        (
            { _id: sauceId },
            { $push: { usersLiked: userId }, $inc: { likes: +1 } }
        )
        .then(() => res.status(200).json({ message: message }))
        .catch((error) => res.status(400).json({ error }));
    }