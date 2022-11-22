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
                }
    });

userSchema.plugin(uniqueValidator, { message: '{PATH} doit être unique' });

module.exports = mongoose.model('User', userSchema);