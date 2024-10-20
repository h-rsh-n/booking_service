const express = require('express');
const router = express.Router();
const {pingController} = require('../../controllers')


router.get('/ping',pingController.ping)

module.exports = router;