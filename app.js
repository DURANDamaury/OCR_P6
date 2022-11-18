const express = require('express');         //import express modul
const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://bdciron:6cpc128@cluster0.llzcdt2.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true })
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

app.use('/api/auth', userRoutes);


module.exports = app;                       //export de notre app pour récupération serveur