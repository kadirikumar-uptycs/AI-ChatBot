const express = require('express');
const path = require('path');
const router = express.Router();
const controllers = require('../controllers');
const isAuthenticated = require('../middleware/isAuthenticated.js');

router.use('/images', express.static(path.join(__dirname, '../assets/images'), {
    maxAge: '30d',
}));

router.get('/', isAuthenticated, (req, res) => res.send(req?.user));
router.post('/chat', isAuthenticated, controllers.reply);
router.get('/chatHistory', isAuthenticated, controllers.getHistory);
router.post('/modelPreference', isAuthenticated, controllers.selectModel);
router.delete('/chatHistory', isAuthenticated, controllers.clearHistory);
router.get('/stories', isAuthenticated, controllers.fetchStories);
router.post('/story', isAuthenticated, controllers.createStory);
router.put('/story/:id', isAuthenticated, controllers.updateStory);
router.delete('/story/:id', isAuthenticated, controllers.deleteStory);
router.get('/songDetails', isAuthenticated, controllers.getSongsManifest);
router.get('/song/:fileName', controllers.fetchSong);

module.exports = router;