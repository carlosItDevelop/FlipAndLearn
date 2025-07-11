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
  isPlayingAudio = false;

  constructor(private audioService: AudioService) {}

  flipCard(): void {
    this.isFlipped = !this.isFlipped;
  }

  async onPlayAudio(): Promise<void> {
    if (this.isPlayingAudio) return;
    
    this.isPlayingAudio = true;
    try {
      await this.audioService.speak(this.lesson.englishText, 'en-US');
    } catch (error) {
      console.error('Audio playback failed:', error);
    } finally {
      this.isPlayingAudio = false;
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
