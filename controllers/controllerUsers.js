const User = require('../models/modelsUsers');
const bcrypt = require('bcrypt');


exports.signUp = (req, res, next) => 
    {
        //delete req.body._id
        bcrypt.hash(req.body.password, 10)
            .then(hash => 
            {
            const user = new User({email: req.body.email, password: hash});
            console.log(user)
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error: 'erreur lors de la sauvegarde' }));
            })
            .catch(error => res.status(500).json({ error: 'erreur en sortie' }));

    };

exports.login = (req, res, next) => 
    {
        User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) 
                {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
                }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) 
                        {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                        }
                    res.status(200).json
                        ({
                        userId: user._id,
                        token: 'TOKEN'
                        });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    };