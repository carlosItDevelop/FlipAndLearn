import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Lesson } from '../../models/lesson.model';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-flashcard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.css']
})
export class FlashcardComponent {
  @Input() lesson!: Lesson;
  @Input() showTranslation: boolean = false;
  @Output() playAudio = new EventEmitter<string>();

  isFlipped = false;
  isPlayingPortugueseAudio = false;
  isPlayingEnglishAudio = false;

  constructor(private audioService: AudioService) {}

  flipCard(): void {
    this.isFlipped = !this.isFlipped;
  }

  async onPlayPortugueseAudio(): Promise<void> {
    if (this.isPlayingPortugueseAudio || this.isPlayingEnglishAudio) return;
    
    this.isPlayingPortugueseAudio = true;
    try {
      await this.audioService.speak(this.lesson.portugueseText, 'pt-BR');
    } catch (error) {
      console.error('Portuguese audio playback failed:', error);
    } finally {
      this.isPlayingPortugueseAudio = false;
    }
  }

  async onPlayEnglishAudio(): Promise<void> {
    if (this.isPlayingEnglishAudio || this.isPlayingPortugueseAudio) return;
    
    this.isPlayingEnglishAudio = true;
    try {
      await this.audioService.speak(this.lesson.englishText, 'en-US');
    } catch (error) {
      console.error('English audio playback failed:', error);
    } finally {
      this.isPlayingEnglishAudio = false;
    }
  }

  getDifficultyColor(): string {
    switch (this.lesson.level) {
      case 'Iniciante':
        return 'bg-green-100 text-green-800';
      case 'Intermediário':
        return 'bg-yellow-100 text-yellow-800';
      case 'Avançado':
        return 'bg-red-100 text-red-800';
      case 'Pessoal':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
