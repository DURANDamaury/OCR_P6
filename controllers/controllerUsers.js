const User = require('../models/modelsUsers');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


exports.signUp = (req, res, next) => 
    {
        bcrypt.hash(req.body.password, 10)
            .then(hash => 
            {
            const user = new User({email: req.body.email, password: hash});
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error: error.message })) //
            })
            .catch(error => res.status(500).json({ error: 'erreur en sortie' }));

    };

exports.login = (req, res, next) => 
    {
        User.findOne({ email: req.body.email })
        .then(user => 
            {
            if (user === null)  //l'utilisateur n'existe pas
                {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'}); // on ne dira pas que l'utilisateur n'existe pas pour ne pas donner cette info
                }
            else                //l'utilisateur existe
                {
                bcrypt.compare(req.body.password, user.password)    //on compare le password passé par le formulaire avec celui de la bdd
                    .then(valid =>
                        {
                        if (!valid) //le mdp n'est pas bon
                            {
                            return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                            }
                        else        //le mdp est bon
                            {
                            res.status(200).json
                                ({
                                    userId: user._id,       //userId récupéré de la bdd
                                    token: jwt.sign
                                        (                                                            //génération du token crypté
                                        { userId: user._id },                                                   //Chaine à encoder
                                        process.env.TOKEN,         //Chaine d'encodage
                                        { expiresIn: '24h' }
                                        )                                                    //Validité
                                });
                            }
                        })
                    .catch(error => res.status(500).json({ error })); //erreur de traitement (pas une erreur de mdp)
                }
            }
            )
        .catch(error => res.status(500).json({ error })); //Erreur dans le cas d'un problème avec la bdd
    };