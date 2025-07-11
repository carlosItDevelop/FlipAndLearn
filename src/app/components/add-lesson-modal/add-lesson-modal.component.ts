import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  englishText = '';
  selectedLevel: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Pessoal' = 'Pessoal';
  isLoading = false;
  error = '';

  constructor() {}

  onClose(): void {
    this.closeModal.emit();
    this.resetForm();
  }

  onSubmit(): void {
    if (!this.portugueseText.trim()) {
      this.error = 'Por favor, digite o texto em português.';
      return;
    }

    if (!this.englishText.trim()) {
      this.error = 'Por favor, digite o texto em inglês.';
      return;
    }

    this.error = '';

    const newLesson: Omit<Lesson, 'id'> = {
      portugueseText: this.portugueseText.trim(),
      englishText: this.englishText.trim(),
      level: this.selectedLevel
    };

    this.lessonAdded.emit(newLesson);
    this.onClose();
  }

  private resetForm(): void {
    this.portugueseText = '';
    this.englishText = '';
    this.selectedLevel = 'Pessoal';
    this.error = '';
    this.isLoading = false;
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
