import EventEmitter from 'events';
import { Deepgram } from '@deepgram/sdk';
import 'dotenv/config';

class Transcriber extends EventEmitter {
  constructor() {
    super();
    this.deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY);
    this.connection = null;
  }

  startTranscriptionStream(sampleRate) {
    const options = {
      model: 'nova-2',
      punctuate: true,
      language: 'en',
      interim_results: true,
      diarize: false,
      smart_format: true,
      endpointing: 0,
      encoding: 'linear16',
      sample_rate: sampleRate,
    };

    this.connection = this.deepgram.transcription.live(options);

    this.connection.on('open', () => {
      this.emit('transcriber-ready');
    });

    this.connection.on('transcriptReceived', (data) => {
      const transcript = data.channel.alternatives[0].transcript;
      if (data.is_final) {
        this.emit('final', transcript);
      } else {
        this.emit('partial', transcript);
      }
    });

    this.connection.on('error', (error) => {
      this.emit('error', error);
    });

    this.connection.on('close', () => {
      this.emit('close');
    });
  }

  endTranscriptionStream() {
    if (this.connection) {
      this.connection.finish();
    }
  }

  send(payload) {
    if (this.connection) {
      this.connection.send(payload);
    }
  }
}

export default Transcriber;
