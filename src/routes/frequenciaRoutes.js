const express = require('express');
const router = express.Router();
const controller = require('../controllers/frequenciaController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, controller.create);
router.get('/', authenticate, controller.list);

module.exports = router;
