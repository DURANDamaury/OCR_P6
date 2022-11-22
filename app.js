const express = require('express');         //import express modul
const mongoose = require('mongoose');

const mongodb_user = process.env.MONGODB_USER
const mongodb_pass = process.env.MONGODB_PASS
mongoose.connect('mongodb+srv://'+mongodb_user+':'+mongodb_pass+'@cluster0.llzcdt2.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
app.use(express.json());

app.use((req, res, next) => 
    {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
    });

const userRoutes = require('./routes/routesUsers');
const sauceRoutes = require('./routes/routesSauces');    

app.use('/api/auth', userRoutes);
app.use('/api', sauceRoutes);


module.exports = app;                       //export de notre app pour récupération serveur