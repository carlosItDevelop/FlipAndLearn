import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';
import { Lesson } from '../../models/lesson.model';

@Component({
  selector: 'app-add-lesson-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-lesson-modal.component.html',
  styleUrls: ['./add-lesson-modal.component.css']
})
export class AddLessonModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() lessonAdded = new EventEmitter<Omit<Lesson, 'id'>>();

  portugueseText = '';
  isLoading = false;
  error = '';

  constructor(private translationService: TranslationService) {}

  onClose(): void {
    this.closeModal.emit();
    this.resetForm();
  }

  async onSubmit(): Promise<void> {
    if (!this.portugueseText.trim()) {
      this.error = 'Por favor, digite um texto em português.';
      return;
    }

    this.isLoading = true;
    this.error = '';

    try {
      const englishText = await this.translationService.translateText({
        text: this.portugueseText.trim(),
        targetLanguage: 'en'
      }).toPromise();

      if (englishText) {
        const newLesson: Omit<Lesson, 'id'> = {
          portugueseText: this.portugueseText.trim(),
          englishText: englishText,
          level: 'Pessoal'
        };

        this.lessonAdded.emit(newLesson);
        this.onClose();
      } else {
        this.error = 'Não foi possível traduzir o texto. Tente novamente.';
      }
    } catch (error: any) {
      console.error('Translation error:', error);
      this.error = error.message || 'Erro ao traduzir o texto. Verifique sua conexão e tente novamente.';
    } finally {
      this.isLoading = false;
    }
  }

  private resetForm(): void {
    this.portugueseText = '';
    this.error = '';
    this.isLoading = false;
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
