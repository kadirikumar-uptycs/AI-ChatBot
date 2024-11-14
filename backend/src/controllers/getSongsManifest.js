const fs = require('fs').promises;
const path = require('path');

const getSongsManifest = async (_, res) => {
    try {
        const manifestPath = path.resolve(__dirname, '../assets/songs/manifest.json');
        const songsDetails = await fs.readFile(manifestPath, 'utf-8');
        const songs = JSON.parse(songsDetails);
        return res.status(200).send(songs);
    } catch (error) {
        console.error(`Error reading the manifest file:\n${error}`);
        return res.status(500).send({ message: 'Failed to fetch song details' });
    }
};

module.exports = getSongsManifest;