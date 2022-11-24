const Sauce = require('../models/modelsSauce');


exports.sauces = (req, res) => 
    {
        Sauce.find()
            .then(sauces => res.status(200).json(sauces))
            .catch(error => res.status(400).json({ error }))
    };

exports.sauceId = (req, res) => 
    {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => res.status(200).json(sauce))
            .catch(error => res.status(404).json({ error }))
    };

exports.saucesPost = (req, res) => 
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
            .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
            .catch(error => res.status(400).json({ error }));
    };