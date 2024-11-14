const fs = require('fs');
const path = require('path');

const fetchSong = (req, res) => {
    const { fileName } = req.params;
    const filePath = path.join(__dirname, '../assets/songs', fileName);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('File does not exist:', filePath);
            return res.status(404).json({ error: 'File not found' });
        }
        const readStream = fs.createReadStream(filePath);

        readStream.on('open', () => {
            res.setHeader('Content-Type', 'audio/mpeg'); 
            readStream.pipe(res);
        });

        readStream.on('error', (streamErr) => {
            console.error('Stream error:', streamErr);
            res.status(500).json({ error: 'Error streaming file' });
        });
    });
}

module.exports = fetchSong;