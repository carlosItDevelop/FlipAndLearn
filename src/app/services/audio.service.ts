import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private synthesis: SpeechSynthesis;
  private isSupported: boolean;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.isSupported = 'speechSynthesis' in window;
  }

  isAudioSupported(): boolean {
    return this.isSupported;
  }

  async speak(text: string, lang: string = 'en-US'): Promise<void> {
    if (!this.isSupported) {
      throw new Error('Speech synthesis is not supported in this browser');
    }

    // Cancel any ongoing speech
    this.synthesis.cancel();

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

      this.synthesis.speak(utterance);
    });
  }

  stop(): void {
    if (this.isSupported) {
      this.synthesis.cancel();
    }
  }
}
