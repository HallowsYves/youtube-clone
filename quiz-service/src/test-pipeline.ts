import * as dotenv from 'dotenv';
import { transcribeVideo } from './transcriber';
import { generateQuizFromTranscript } from './generator';

dotenv.config();

async function runTest() {
    const testGcsUri = 'gs://yv-yt-processed-videos/processed-black_hole.mp4';
    const mockVideoId = 'test-video-123';

    try {
        console.log('Transcribing Video ...');
        const transcript = await transcribeVideo(testGcsUri);
        console.log("Transcription Complete.");
        console.log(`Transcript Preview: ${transcript.substring(0,100)}...`);

        console.log('\n Generating Quiz Via Gemini...');
        const quiz = await generateQuizFromTranscript(transcript, mockVideoId);

        console.log("Quiz generation sucessful!");
        console.log(JSON.stringify(quiz, null, 2));
    } catch (error) {
        console.error("Pipeline Failed: ", error);
    }
}

runTest();