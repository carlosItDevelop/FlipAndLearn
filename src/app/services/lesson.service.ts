import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Lesson, LevelFilter } from '../models/lesson.model';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private apiUrl = '/api';
  private lessonsSubject = new BehaviorSubject<Lesson[]>([]);
  public lessons$ = this.lessonsSubject.asObservable();

  private currentFilterSubject = new BehaviorSubject<LevelFilter>('Todos');
  public currentFilter$ = this.currentFilterSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadLessonsFromAPI();
  }

  private loadLessonsFromAPI(): void {
    this.http.get<any[]>(`${this.apiUrl}/lessons`)
      .pipe(
        map(lessons => lessons.map(lesson => ({
          id: lesson.id,
          level: lesson.level,
          englishText: lesson.english_text || lesson.englishText,
          portugueseText: lesson.portuguese_text || lesson.portugueseText
        } as Lesson))),
        catchError(error => {
          console.error('Failed to load lessons from API:', error);
          return of([]);
        })
      )
      .subscribe(lessons => {
        this.lessonsSubject.next(lessons);
      });
  }

  getLessons(): Observable<Lesson[]> {
    return this.lessons$;
  }

  getFilteredLessons(filter: LevelFilter): Observable<Lesson[]> {
    const params = filter === 'Todos' ? '' : `?level=${filter}`;
    return this.http.get<any[]>(`${this.apiUrl}/lessons${params}`)
      .pipe(
        map(lessons => lessons.map(lesson => ({
          id: lesson.id,
          level: lesson.level,
          englishText: lesson.english_text || lesson.englishText,
          portugueseText: lesson.portuguese_text || lesson.portugueseText
        } as Lesson))),
        catchError(error => {
          console.error('Failed to load filtered lessons from API:', error);
          return of([]);
        })
      );
  }

  addLesson(lesson: Omit<Lesson, 'id'>): void {
    const newLessonData = {
      level: lesson.level,
      englishText: lesson.englishText,
      portugueseText: lesson.portugueseText
    };

    this.http.post<any>(`${this.apiUrl}/lessons`, newLessonData)
      .pipe(
        catchError(error => {
          console.error('Failed to add lesson to API:', error);
          return of(null);
        })
      )
      .subscribe(result => {
        if (result) {
          // Reload lessons from API to get the updated list
          this.loadLessonsFromAPI();
        }
      });
  }

  setFilter(filter: LevelFilter): void {
    this.currentFilterSubject.next(filter);
  }

  getCurrentFilter(): LevelFilter {
    return this.currentFilterSubject.value;
  }
}
