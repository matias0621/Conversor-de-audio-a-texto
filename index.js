const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('audio'), (req, res) => {
    const inputPath = req.file.path;
    const outputPath = `uploads/${req.file.filename}.wav`;

    ffmpeg(inputPath)
        .toFormat('wav')
        .on('end', () => {
            res.download(outputPath, (err) => {
                if (err) {
                    console.error(err);
                }
                // Optionally, delete the files after download
            });
        })
        .on('error', (err) => {
            console.error(err);
            res.status(500).send('Conversion error');
        })
        .save(outputPath);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
