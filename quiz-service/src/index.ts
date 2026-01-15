import express from "express";
import { transcribeVideo } from './transcriber';
import { generateQuizFromTranscript } from "./generator";

const app = express();
app.use(express.json())

app.post('/process-video', async (req, res) => {
    const message = req.body.message;

    if (!message || !message.attributes) {
        console.error('Error: Invalid Pub/Sub message format');
        return res.status(400).send('Bad Reqeust: Invalid message format');
    }

    const { bucketId, objectId } = message.attributes;

    if (message.attributes.eventType !== 'OBJECT_FINALIZE') {
        console.log(`Skipping event type: ${message.attributes.eventType}`);
        return res.status(204).send();
    }

    if (!bucketId || !objectId ) {
        return res.status(400).send('Missing bucket or object information');
    }

    const gcsUri = `gs://${bucketId}/${objectId}`;
    const videoId = objectId.split('#').pop()?.split('.')[0] || objectId;

    console.log(`Starting video intelligence layer for ${videoId}`);

    try {
        const transcript = await transcribeVideo(gcsUri);
        const quiz = await generateQuizFromTranscript(transcript, videoId);
        
        // TODO: save to firestore 
        console.log(`Success: Generated Quiz for ${videoId}`);

        res.status(200).send(`Generated Quiz for ${videoId}`);
    } catch (error) {
        console.error(`Pipeline failed for ${videoId}:`, error);
        res.status(500).send('Internal Processing Error');
    }
});



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Quiz service is listening on port ${PORT}`);
})