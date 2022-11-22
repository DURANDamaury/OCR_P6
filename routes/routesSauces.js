const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const saucesCtrl = require('../controllers/controllerSauces');

router.get('/sauces', saucesCtrl.sauces);
router.get('/sauces/:id', auth,saucesCtrl.sauceId)

module.exports = router;