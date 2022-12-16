const passwordValidator = require("password-validator");

// Creation d'un schema de validation pour le password
module.exports.schema = () =>
    {
        const schema = new passwordValidator();
        schema
            .is().min(6)            //Longueur min de 6
            .is().max(20)           //Longueur max 20
            .has().not().spaces()   //Pas d'espace
            .has().uppercase()      //Majuscule
            .has().lowercase()      //Minuscule
            .has().digits(1);       //Chiffres

            return schema
    }