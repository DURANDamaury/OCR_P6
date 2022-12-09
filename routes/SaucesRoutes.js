const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const saucesCtrl = require('../controllers/SaucesController');

router.get('/sauces', auth,saucesCtrl.getAllSauces);
router.get('/sauces/:id', auth,saucesCtrl.getSauceById);
router.post('/sauces', auth, multer, saucesCtrl.createSauce);
router.post('/sauces/:id/like', auth,saucesCtrl.LikeSauce);
router.delete('/sauces/:id',auth,saucesCtrl.deleteSauce);
router.put('/sauces/:id',auth, multer, saucesCtrl.modifySauce);
module.exports = router;