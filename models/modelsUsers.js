const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');   //Validateur de donnée unique, permet de tester si les données envoyées au schéma existent déjà
const validator = require('validator')                          //Traitement des erreurs


const userSchema = mongoose.Schema(
    {
    email:      { 
                type: String, required: true, unique: true,
                validate (email)
                    {
                        if (!validator.isEmail(email)) throw new Error ('Email invalide');
                    } 
                },
    password:   {
                type: String, required: true,
                /* validate (password)
                    {
                        if (!validator.isLength(password, {min: 7, max:16})) throw new error ('Le mot de pass doit contenir 7 caractères')
                    } */
                }
    });

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);