import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserProgress, Achievement, StudySession } from '../models/lesson.model';

@Injectable({
  providedIn: 'root'
})
export class GamificationService {
  private userProgressSubject = new BehaviorSubject<UserProgress>(this.getInitialProgress());
  public userProgress$ = this.userProgressSubject.asObservable();

  private achievementsSubject = new BehaviorSubject<Achievement[]>(this.getInitialAchievements());
  public achievements$ = this.achievementsSubject.asObservable();

  private currentSessionSubject = new BehaviorSubject<StudySession | null>(null);
  public currentSession$ = this.currentSessionSubject.asObservable();

  constructor() {
    this.loadProgress();
  }

  private getInitialProgress(): UserProgress {
    return {
      totalPoints: 0,
      level: 1,
      currentStreak: 0,
      bestStreak: 0,
      cardsStudiedToday: 0,
      dailyGoal: 10,
      lastStudyDate: null,
      totalCardsStudied: 0,
      averageAccuracy: 0
    };
  }

  private getInitialAchievements(): Achievement[] {
    return [
      {
        id: 'first-lesson',
        name: 'Primeiros Passos',
        description: 'Complete sua primeira lição',
        icon: '🎯',
        unlocked: false,
        requirement: 1,
        progress: 0
      },
      {
        id: 'daily-goal',
        name: 'Meta Diária',
        description: 'Complete sua meta diária',
        icon: '✅',
        unlocked: false,
        requirement: 1,
        progress: 0
      },
      {
        id: 'week-streak',
        name: 'Guerreiro Semanal',
        description: 'Estude por 7 dias seguidos',
        icon: '🔥',
        unlocked: false,
        requirement: 7,
        progress: 0
      },
      {
        id: 'perfect-score',
        name: 'Pontuação Perfeita',
        description: 'Acerte 100% em uma sessão',
        icon: '⭐',
        unlocked: false,
        requirement: 1,
        progress: 0
      },
      {
        id: 'speed-learner',
        name: 'Aprendiz Veloz',
        description: 'Complete 20 cartões em uma sessão',
        icon: '⚡',
        unlocked: false,
        requirement: 20,
        progress: 0
      },
      {
        id: 'consistent-learner',
        name: 'Aprendiz Consistente',
        description: 'Estude por 30 dias',
        icon: '📚',
        unlocked: false,
        requirement: 30,
        progress: 0
      }
    ];
  }

  startSession(): StudySession {
    const session: StudySession = {
      sessionId: Date.now().toString(),
      startTime: new Date(),
      cardsStudied: 0,
      correctAnswers: 0,
      totalPoints: 0
    };
    
    this.currentSessionSubject.next(session);
    return session;
  }

  endSession(): void {
    const session = this.currentSessionSubject.value;
    if (session) {
      session.endTime = new Date();
      this.updateProgress(session);
      this.currentSessionSubject.next(null);
    }
  }

  recordCardStudied(isCorrect: boolean, difficulty: number = 3): void {
    const session = this.currentSessionSubject.value;
    if (!session) return;

    session.cardsStudied++;
    if (isCorrect) {
      session.correctAnswers++;
      // Points based on difficulty and streak
      const basePoints = this.calculatePoints(difficulty);
      session.totalPoints += basePoints;
    }

    this.currentSessionSubject.next(session);
  }

  private calculatePoints(difficulty: number): number {
    const progress = this.userProgressSubject.value;
    let basePoints = 0;
    
    switch (difficulty) {
      case 1: basePoints = 5; break;  // Easy
      case 2: basePoints = 10; break; // Medium  
      case 3: basePoints = 15; break; // Hard
      case 4: basePoints = 20; break; // Very Hard
      default: basePoints = 10;
    }

    // Streak bonus
    const streakBonus = Math.floor(progress.currentStreak / 3) * 2;
    return basePoints + streakBonus;
  }

  private updateProgress(session: StudySession): void {
    const progress = this.userProgressSubject.value;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Update basic stats
    progress.totalPoints += session.totalPoints;
    progress.totalCardsStudied += session.cardsStudied;
    
    // Calculate accuracy
    if (progress.totalCardsStudied > 0) {
      const totalCorrect = (progress.averageAccuracy * (progress.totalCardsStudied - session.cardsStudied)) + session.correctAnswers;
      progress.averageAccuracy = totalCorrect / progress.totalCardsStudied;
    }

    // Update daily progress and streak
    const lastStudyDate = progress.lastStudyDate ? new Date(progress.lastStudyDate) : null;
    const isToday = lastStudyDate && this.isSameDay(lastStudyDate, today);
    const wasYesterday = lastStudyDate && this.isSameDay(lastStudyDate, yesterday);

    if (!isToday) {
      progress.cardsStudiedToday = session.cardsStudied;
      
      if (wasYesterday || !lastStudyDate) {
        progress.currentStreak = wasYesterday ? progress.currentStreak + 1 : 1;
      } else {
        progress.currentStreak = 1;
      }
      
      progress.bestStreak = Math.max(progress.bestStreak, progress.currentStreak);
      progress.lastStudyDate = today;
    } else {
      progress.cardsStudiedToday += session.cardsStudied;
    }

    // Update level based on points
    progress.level = Math.floor(progress.totalPoints / 100) + 1;

    this.userProgressSubject.next(progress);
    this.checkAchievements(session);
    this.saveProgress();
  }

  private checkAchievements(session: StudySession): void {
    const progress = this.userProgressSubject.value;
    const achievements = this.achievementsSubject.value;
    let updated = false;

    achievements.forEach(achievement => {
      if (achievement.unlocked) return;

      let currentProgress = 0;
      
      switch (achievement.id) {
        case 'first-lesson':
          currentProgress = progress.totalCardsStudied > 0 ? 1 : 0;
          break;
        case 'daily-goal':
          currentProgress = progress.cardsStudiedToday >= progress.dailyGoal ? 1 : 0;
          break;
        case 'week-streak':
          currentProgress = progress.currentStreak;
          break;
        case 'perfect-score':
          const accuracy = session.cardsStudied > 0 ? session.correctAnswers / session.cardsStudied : 0;
          currentProgress = accuracy === 1 && session.cardsStudied >= 5 ? 1 : 0;
          break;
        case 'speed-learner':
          currentProgress = session.cardsStudied;
          break;
        case 'consistent-learner':
          currentProgress = progress.currentStreak;
          break;
      }

      achievement.progress = currentProgress;
      
      if (currentProgress >= achievement.requirement && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedDate = new Date();
        updated = true;
        this.showAchievementNotification(achievement);
      }
    });

    if (updated) {
      this.achievementsSubject.next([...achievements]);
    }
  }

  private showAchievementNotification(achievement: Achievement): void {
    // This could trigger a toast notification or modal
    console.log(`🎉 Conquista desbloqueada: ${achievement.name}!`);
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  private loadProgress(): void {
    const saved = localStorage.getItem('fliplearn_progress');
    if (saved) {
      const progress = JSON.parse(saved);
      progress.lastStudyDate = progress.lastStudyDate ? new Date(progress.lastStudyDate) : null;
      this.userProgressSubject.next(progress);
    }

    const savedAchievements = localStorage.getItem('fliplearn_achievements');
    if (savedAchievements) {
      const achievements = JSON.parse(savedAchievements);
      achievements.forEach((ach: Achievement) => {
        if (ach.unlockedDate) {
          ach.unlockedDate = new Date(ach.unlockedDate);
        }
      });
      this.achievementsSubject.next(achievements);
    }
  }

  private saveProgress(): void {
    localStorage.setItem('fliplearn_progress', JSON.stringify(this.userProgressSubject.value));
    localStorage.setItem('fliplearn_achievements', JSON.stringify(this.achievementsSubject.value));
  }

  updateDailyGoal(newGoal: number): void {
    const progress = this.userProgressSubject.value;
    progress.dailyGoal = newGoal;
    this.userProgressSubject.next(progress);
    this.saveProgress();
  }

  getCurrentSession(): Observable<StudySession | null> {
    return this.currentSession$;
  }

  getUserProgress(): Observable<UserProgress> {
    return this.userProgress$;
  }

  getAchievements(): Observable<Achievement[]> {
    return this.achievements$;
  }
}