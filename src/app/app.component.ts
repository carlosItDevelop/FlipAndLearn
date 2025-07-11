import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { LessonService } from './services/lesson.service';
import { AudioService } from './services/audio.service';
import { GamificationService } from './services/gamification.service';
import { Lesson, LevelFilter, UserProgress } from './models/lesson.model';
import { FlashcardComponent } from './components/flashcard/flashcard.component';
import { AddLessonModalComponent } from './components/add-lesson-modal/add-lesson-modal.component';
import { ProgressDashboardComponent } from './components/progress-dashboard/progress-dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    FlashcardComponent,
    AddLessonModalComponent,
    ProgressDashboardComponent
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
  userProgress$!: Observable<UserProgress>;
  
  // Navigation state
  currentView: 'study' | 'progress' = 'study';
  
  // Study session state
  studySessionActive = false;

  constructor(
    private lessonService: LessonService,
    private audioService: AudioService,
    public gamificationService: GamificationService
  ) {
    this.userProgress$ = this.gamificationService.getUserProgress();
  }

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
    this.filteredLessons$.pipe(take(1)).subscribe((lessons: Lesson[]) => {
      if (lessons.length > 0) {
        this.currentLessonIndex = this.currentLessonIndex > 0 
          ? this.currentLessonIndex - 1 
          : lessons.length - 1;
        this.initializeData();
      }
    });
  }

  nextLesson(): void {
    this.filteredLessons$.pipe(take(1)).subscribe((lessons: Lesson[]) => {
      if (lessons.length > 0) {
        // Record study progress if session is active
        if (this.studySessionActive) {
          this.gamificationService.recordCardStudied(true, this.getDifficultyLevel());
        }
        
        this.currentLessonIndex = this.currentLessonIndex < lessons.length - 1 
          ? this.currentLessonIndex + 1 
          : 0;
        this.initializeData();
      }
    });
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

  startStudySession(): void {
    this.studySessionActive = true;
    this.gamificationService.startSession();
  }

  endStudySession(): void {
    if (this.studySessionActive) {
      this.studySessionActive = false;
      this.gamificationService.endSession();
    }
  }

  private getDifficultyLevel(): number {
    let difficulty = 2;
    this.currentLesson$.pipe(take(1)).subscribe(lesson => {
      if (lesson) {
        switch (lesson.level) {
          case 'Iniciante': difficulty = 1; break;
          case 'Intermediário': difficulty = 2; break;
          case 'Avançado': difficulty = 3; break;
          case 'Pessoal': difficulty = 2; break;
          default: difficulty = 2;
        }
      }
    });
    return difficulty;
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
