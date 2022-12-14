const Sauce = require('../models/modelsSauce');
const likesFonctions = require('../utils/likesFonction')
const fs = require('fs')



exports.getAllSauces = (req, res) => 
    {
        Sauce.find()
            .then(sauces => res.status(200).json(sauces))
            .catch(error => res.status(400).json({ error }))
    };

exports.getSauceById = (req, res) => 
    {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => res.status(200).json(sauce))
            .catch(error => res.status(404).json({ error }))    //404 car la sauce n'existe pas
    };

exports.createSauce = (req, res) => 
    {
        const sauceObject = JSON.parse(req.body.sauce); //Pour ajouter un fichier à la requête, le front-end doit envoyer
                                                        //les données de la requête sous la forme form-data et non sous forme de JSON. 
                                                        //Le corps de la requête contient une chaîne sauce, qui est simplement
                                                        //un objetSauce converti en chaîne. Nous devons donc l'analyser à l'aide
                                                        //de JSON.parse() pour obtenir un objet utilisable
        delete req.body._id;                            //On efface l'id envoyé par la requete car la bdd en créera un
        delete sauceObject._userId;                     //On ne fait pas confiance à l'utilisateur on vérifie déjà avec le token qui est plus fiable et non modifiable
        const sauce = new Sauce
        ({
            ...sauceObject,                             //On récupère les données dans un objet
                                                        //... est un raccourcis qui récupère les données d'un coup au lieu d'écrire: titre: req.body.title...
            userId: req.auth.userId,                    //userId extrait du token par le middleware d'authentification.
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                                                        //Nous devons également résoudre l'URL complète de notre image, car req.file.filename
                                                        //ne contient que le segment filename.
                                                        //Nous utilisons req.protocol pour obtenir le premier segment (dans notre cas 'http').
                                                        //Nous ajoutons '://', puis utilisons req.get('host')
                                                        //pour résoudre l'hôte du serveur (ici, 'localhost:3000').
                                                        //Nous ajoutons finalement '/images/' et le nom de fichier pour compléter notre URL.
        });          
                                                        //

        sauce.save()                                    //on sauvegarde
            .then(() => res.status(201).json({ message: 'Sauce has been created successfully'}))
            .catch(error => res.status(400).json({ error }));
    };

exports.deleteSauce = (req,res) =>
    {
        Sauce.findOne({_id: req.params.id})     //on recherche la sauce à modifier
                .then((sauce) => 
                    {
                        if(!sauce) 
                            {       
                            res.status(404).json({error: 'Sauce not exist'});
                            }
                        if (sauce.userId != req.auth.userId)    //si la personne qui modifie est différente de la personne qui a créé la sauce
                            {
                                res.status(403).json({ message : 'Not authorized'});
                            } 
                        else 
                            {
                                const filename = sauce.imageUrl.split("/images/")[1]; // On récupère le nom de l'image
                                fs.unlink(`images/${filename}`, () => 
                                {
                                Sauce.deleteOne({ _id: req.params.id })
                                    .then(() => res.status(204).json({ message: 'Sauce has been deleted successfully'})) //On indique "no content" qui sous entend qu'il n'y en a plus
                                    .catch(error => {res.status(400).json({ error })});
                                })
                            }
                    })
                .catch((error) => {res.status(400).json({ error });});
    };

exports.LikeSauce = (req,res) =>
    {
        const like = parseInt(req.body.like);   //on récupère un entier du like
        const userId = req.body.userId;         //Id de l'utilisateur
        const sauceId = req.params.id;          //id de la sauce

        if (like === 1)     //Si like=1 alors l'utilisateur aime. 
            {
                likesFonctions.like(req,res)
            }
        
        if (like === -1)    //Si like=-1 alors l'utilisateur n'aime pas 
            {
                likesFonctions.dislike(req,res)
            }

        if (like === 0)     //anulation du vote
            {
                likesFonctions.undoLike(req,res)
            }
    }

exports.modifySauce = (req, res, next) => 
    {
        const sauceObject = req.file ?      //Est-ce qu'il y a un champ 'file'
            {
                    ...JSON.parse(req.body.sauce),      //on parse la chaine de caractère pour récupérer l'objet
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //et on reconstitue l'adresse
                    
            }
            : //si il n'y a pas de champs file 
            { ...req.body } //alors on récupère l'objet directement dans le corps de la requete

            delete sauceObject._userId  //on supprime l'userId de la requete pour éviter que quelqu'un ne crée un objet
                                        //à son nom puis le modifie pour le réassigner à quelqu'un d'autre.

            Sauce.findOne({_id: req.params.id})     //on recherche la sauce à modifier
                .then((sauce) => 
                    {
                        if (sauce.userId != req.auth.userId)    //si la personne qui modifie est différente de la personne qui a créé la sauce
                            {
                                res.status(403).json({ message : 'Not authorized'});
                            } 
                        else 
                            {
                                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                                .then(() => res.status(200).json({message : 'Sauce has been modified succesfully'}))
                                .catch(error => res.status(400).json({ error }));
                            }
                    })
                .catch((error) => {
                    res.status(400).json({ error });
                });
    };