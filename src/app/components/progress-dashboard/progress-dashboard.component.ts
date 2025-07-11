import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { GamificationService } from '../../services/gamification.service';
import { UserProgress, Achievement } from '../../models/lesson.model';

@Component({
  selector: 'app-progress-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="progress-dashboard p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">📊 Seu Progresso</h2>
      
      <div *ngIf="userProgress$ | async as progress" class="space-y-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Level Card -->
          <div class="bg-white rounded-xl shadow-md p-6 text-center border-l-4 border-yellow-400">
            <div class="text-2xl mb-2">🏆</div>
            <h3 class="text-lg font-semibold text-gray-700">Nível</h3>
            <p class="text-3xl font-bold text-yellow-600">{{progress.level}}</p>
            <div class="text-sm text-gray-500 mt-2">
              {{progress.totalPoints % 100}}/100 para próximo nível
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div class="bg-yellow-400 h-2 rounded-full" 
                   [style.width.%]="(progress.totalPoints % 100)"></div>
            </div>
          </div>

          <!-- Streak Card -->
          <div class="bg-white rounded-xl shadow-md p-6 text-center border-l-4 border-orange-400">
            <div class="text-2xl mb-2">🔥</div>
            <h3 class="text-lg font-semibold text-gray-700">Sequência</h3>
            <p class="text-3xl font-bold text-orange-600">{{progress.currentStreak}}</p>
            <div class="text-sm text-gray-500 mt-2">
              Recorde: {{progress.bestStreak}} dias
            </div>
          </div>

          <!-- Daily Goal Card -->
          <div class="bg-white rounded-xl shadow-md p-6 text-center border-l-4 border-green-400">
            <div class="text-2xl mb-2">🎯</div>
            <h3 class="text-lg font-semibold text-gray-700">Meta Diária</h3>
            <p class="text-3xl font-bold text-green-600">{{progress.cardsStudiedToday}}/{{progress.dailyGoal}}</p>
            <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div class="bg-green-400 h-2 rounded-full" 
                   [style.width.%]="(progress.cardsStudiedToday / progress.dailyGoal * 100)"></div>
            </div>
          </div>

          <!-- Points Card -->
          <div class="bg-white rounded-xl shadow-md p-6 text-center border-l-4 border-purple-400">
            <div class="text-2xl mb-2">⭐</div>
            <h3 class="text-lg font-semibold text-gray-700">Pontos</h3>
            <p class="text-3xl font-bold text-purple-600">{{progress.totalPoints}}</p>
            <div class="text-sm text-gray-500 mt-2">
              Precisão: {{(progress.averageAccuracy * 100).toFixed(1)}}%
            </div>
          </div>
        </div>

        <!-- Achievements Section -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
            🏅 Conquistas
          </h3>
          
          <div *ngIf="achievements$ | async as achievements" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let achievement of achievements" 
                 class="achievement-card p-4 rounded-lg border-2 transition-all duration-300"
                 [class]="achievement.unlocked ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'">
              
              <div class="flex items-center mb-3">
                <span class="text-2xl mr-3" 
                      [class]="achievement.unlocked ? 'filter-none' : 'filter grayscale opacity-50'">
                  {{achievement.icon}}
                </span>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-800" 
                      [class]="achievement.unlocked ? 'text-green-800' : 'text-gray-600'">
                    {{achievement.name}}
                  </h4>
                  <p class="text-sm text-gray-600">{{achievement.description}}</p>
                </div>
              </div>
              
              <div *ngIf="!achievement.unlocked && achievement.requirement > 1" class="mt-2">
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progresso</span>
                  <span>{{achievement.progress}}/{{achievement.requirement}}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-400 h-2 rounded-full transition-all duration-300" 
                       [style.width.%]="(achievement.progress / achievement.requirement * 100)"></div>
                </div>
              </div>
              
              <div *ngIf="achievement.unlocked && achievement.unlockedDate" class="mt-2 text-xs text-green-600">
                Desbloqueado em {{achievement.unlockedDate | date:'dd/MM/yyyy'}}
              </div>
            </div>
          </div>
        </div>

        <!-- Study History -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
            📈 Resumo de Estudos
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <p class="text-2xl font-bold text-blue-600">{{progress.totalCardsStudied}}</p>
              <p class="text-gray-600">Cartões Estudados</p>
            </div>
            
            <div class="text-center">
              <p class="text-2xl font-bold text-green-600">{{(progress.averageAccuracy * 100).toFixed(1)}}%</p>
              <p class="text-gray-600">Precisão Média</p>
            </div>
            
            <div class="text-center">
              <p class="text-2xl font-bold text-purple-600">{{progress.bestStreak}}</p>
              <p class="text-gray-600">Melhor Sequência</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .achievement-card {
      transition: transform 0.2s ease-in-out;
    }
    
    .achievement-card:hover {
      transform: translateY(-2px);
    }
    
    .filter {
      filter: grayscale(100%);
    }
    
    .filter-none {
      filter: none;
    }
  `]
})
export class ProgressDashboardComponent implements OnInit {
  userProgress$: Observable<UserProgress>;
  achievements$: Observable<Achievement[]>;

  constructor(private gamificationService: GamificationService) {
    this.userProgress$ = this.gamificationService.getUserProgress();
    this.achievements$ = this.gamificationService.getAchievements();
  }

  ngOnInit(): void {
    // Component initialization
  }
}