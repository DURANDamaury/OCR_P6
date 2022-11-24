const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const saucesCtrl = require('../controllers/controllerSauces');

router.get('/sauces', auth,saucesCtrl.sauces);
router.get('/sauces/:id', auth,saucesCtrl.sauceId);
router.post('/sauces', auth, multer, saucesCtrl.saucesPost);

module.exports = router;