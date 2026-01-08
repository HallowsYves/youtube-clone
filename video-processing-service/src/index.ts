import express from "express";
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo } from "./storage";

setupDirectories();
const app = express();
app.use(express.json());

app.post('/process-video', async (request, response) => {
    let data;
    try {
        const message = Buffer.from(request.body.message.data, 'base64').toString('utf-8');
        data = JSON.parse(message);
        if (!data.name) {
            throw new Error('Invalid message payload recieved');
        }
    } catch (error) {
        console.error(error);
        return response.status(400).send('Bad Request: missing filename');
    }

    const inputFileName = data.name;
    const outputFileName = `processed-${inputFileName}`;

    // Download raw video from cloud storage
    await downloadRawVideo(inputFileName);

    try {
        await convertVideo(inputFileName, outputFileName);
    } catch (err) {
        await Promise.all([deleteRawVideo(inputFileName), deleteProcessedVideo(outputFileName)]);
        console.error(err);
        return response.status(500).send("Internal server error: video processing failed.");
    }

    // Upload processed video to cloud storage
    await uploadProcessedVideo(outputFileName);
    await Promise.all([deleteRawVideo(inputFileName), deleteProcessedVideo(outputFileName)]);
    return response.status(200).send("Processing finished successfully.")
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});