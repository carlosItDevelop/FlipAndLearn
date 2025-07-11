import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Observable, combineLatest, map } from 'rxjs';

import { LessonService } from './services/lesson.service';
import { AudioService } from './services/audio.service';
import { Lesson, LevelFilter } from './models/lesson.model';
import { FlashcardComponent } from './components/flashcard/flashcard.component';
import { AddLessonModalComponent } from './components/add-lesson-modal/add-lesson-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    FlashcardComponent,
    AddLessonModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Flip & Learn';
  
  filteredLessons$!: Observable<Lesson[]>;
  currentLessonIndex = 0;
  currentLesson$!: Observable<Lesson | null>;
  showTranslation = false;
  isModalOpen = false;
  
  selectedFilter: LevelFilter = 'Todos';
  filterOptions: LevelFilter[] = ['Todos', 'Iniciante', 'Intermediário', 'Avançado', 'Pessoal'];
  
  progress$!: Observable<{ current: number; total: number; percentage: number }>;

  constructor(
    private lessonService: LessonService,
    private audioService: AudioService
  ) {}

  ngOnInit(): void {
    this.initializeData();
  }

  private initializeData(): void {
    // Get filtered lessons based on current filter
    this.filteredLessons$ = this.lessonService.getFilteredLessons(this.selectedFilter);
    
    // Get current lesson
    this.currentLesson$ = combineLatest([
      this.filteredLessons$,
    ]).pipe(
      map(([lessons]) => {
        if (lessons.length === 0) return null;
        const validIndex = Math.min(this.currentLessonIndex, lessons.length - 1);
        this.currentLessonIndex = Math.max(0, validIndex);
        return lessons[this.currentLessonIndex] || null;
      })
    );

    // Calculate progress
    this.progress$ = this.filteredLessons$.pipe(
      map(lessons => ({
        current: this.currentLessonIndex + 1,
        total: lessons.length,
        percentage: lessons.length > 0 ? ((this.currentLessonIndex + 1) / lessons.length) * 100 : 0
      }))
    );
  }

  onFilterChange(): void {
    this.currentLessonIndex = 0;
    this.lessonService.setFilter(this.selectedFilter);
    this.filteredLessons$ = this.lessonService.getFilteredLessons(this.selectedFilter);
    this.initializeData();
  }

  previousLesson(): void {
    this.filteredLessons$.subscribe(lessons => {
      if (lessons.length > 0) {
        this.currentLessonIndex = this.currentLessonIndex > 0 
          ? this.currentLessonIndex - 1 
          : lessons.length - 1;
        this.initializeData();
      }
    }).unsubscribe();
  }

  nextLesson(): void {
    this.filteredLessons$.subscribe(lessons => {
      if (lessons.length > 0) {
        this.currentLessonIndex = this.currentLessonIndex < lessons.length - 1 
          ? this.currentLessonIndex + 1 
          : 0;
        this.initializeData();
      }
    }).unsubscribe();
  }

  toggleTranslation(): void {
    this.showTranslation = !this.showTranslation;
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onLessonAdded(lesson: Omit<Lesson, 'id'>): void {
    this.lessonService.addLesson(lesson);
    
    // If the filter is set to show personal lessons or all lessons, refresh the view
    if (this.selectedFilter === 'Pessoal' || this.selectedFilter === 'Todos') {
      this.initializeData();
    }
  }

  isAudioSupported(): boolean {
    return this.audioService.isAudioSupported();
  }

  getLevelStats(): Observable<{ [key: string]: number }> {
    return this.lessonService.getLessons().pipe(
      map(lessons => {
        const stats: { [key: string]: number } = {
          'Iniciante': 0,
          'Intermediário': 0,
          'Avançado': 0,
          'Pessoal': 0
        };
        
        lessons.forEach(lesson => {
          stats[lesson.level]++;
        });
        
        return stats;
      })
    );
  }
}
