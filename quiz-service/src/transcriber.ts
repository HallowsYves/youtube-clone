import { VideoIntelligenceServiceClient, protos } from '@google-cloud/video-intelligence';

const client = new VideoIntelligenceServiceClient();

export async function transcribeVideo(gcsUri: string): Promise<string> {
  const feature: protos.google.cloud.videointelligence.v1.Feature = 'SPEECH_TRANSCRIPTION' as any;

  const request: protos.google.cloud.videointelligence.v1.IAnnotateVideoRequest = {
    inputUri: gcsUri,
    features: [feature],
    videoContext: {
      speechTranscriptionConfig: {
        languageCode: 'en-US',
        enableAutomaticPunctuation: true,
      },
    },
  };

  const response = await client.annotateVideo(request);
  const operation = response[0]; 

  console.log('Waiting for transcription to complete...');
  
  const [operationResult] = await operation.promise();

  const results = operationResult.annotationResults?.[0];
  
  if (!results?.speechTranscriptions) {
    return '';
  }

  const transcript = results.speechTranscriptions
    .map((s: protos.google.cloud.videointelligence.v1.ISpeechTranscription) => {
      return s.alternatives?.[0]?.transcript || '';
    })
    .join(' ');

  return transcript;
}