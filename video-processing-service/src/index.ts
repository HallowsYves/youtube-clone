import express, { response } from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
app.use(express.json());

app.post('/process-video', (request, response) => {
    const inputFilePath = request.body.inputFilePath;
    const outputFilePath = request.body.outputFilePath;

    // Check if file path is valid
    if (!inputFilePath || !outputFilePath) {
        return response.status(400).send('Bad Request: Missing file path');
    }

    // Ffmpeg command
    ffmpeg(inputFilePath)
      .outputOptions('-vf', 'scale=-1:360')
      .on('end', function() {
        console.log('Processing finished successfully');
        response.status(200).send('Processing finished successfully');
      })
      .on('error', function(err:any) {
        console.log("An error occured: " + err.message);
        response.status(500).send('An error occured: ' + err.message);
      })
      .save(outputFilePath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});