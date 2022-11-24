const multer = require('multer');

const MIME_TYPES =              // on se crée un dictionnaire des différents formats d'images possibles
    {
        'image/jpg': 'jpg',
        'image/jpeg': 'jpg',
        'image/png': 'png'
    };

const storage = multer.diskStorage(     // la fonction diskstorage de multer configure le chemin et le nom de fichier pour les fichiers entrants.
    {
        destination: (req, file, callback) => 
            {
                callback(null, 'images');   // Pas d'erreur, pn utilise le dossier 'images'
            },
        filename: (req, file, callback) =>  // création du nom de fichier
            {
                const name = file.originalname.split(' ').join('_');    // pour éliminer l'éventuel problème de fichier avec des espaces
                                                                        // on sépare dans un tableau avec split les strings séparées par un espace
                                                                        // Puis on les rattachent dans un seul string avec join en ajouteant '_' entre chaque string
                
                const extension = MIME_TYPES[file.mimetype];            // Pour générer l'extension de fichier on récupère le mimetype fourni par le front (file.mimetype)
                                                                        // Et on récupère l'extension en fonction de la mimetype 
                                                                        // (par exemple image/jpg est fourni on obtient jpg)

                callback(null, name + Date.now() + '.' + extension);    // Callback null pour dire que tout c'est bien passé
                                                                        // on renvoie donc notre nom de fichier
                                                                        // qui contiendra le nom+la date+.+extension
            }
            }
    );

module.exports = multer({storage: storage}).single('image');            //on renvois notre objet à multer en lui précisant que c'est une image