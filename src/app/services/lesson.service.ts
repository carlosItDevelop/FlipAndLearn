import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Lesson, LevelFilter } from '../models/lesson.model';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private initialLessons: Lesson[] = [
    { id: 1, level: "Iniciante", englishText: "The book is on the table.", portugueseText: "O livro está sobre a mesa." },
    { id: 2, level: "Intermediário", englishText: "Software architecture is the set of fundamental structures of a software system.", portugueseText: "Arquitetura de software é o conjunto de estruturas fundamentais de um sistema de software." },
    { id: 3, level: "Intermediário", englishText: "To be a good software architect, you need to understand the business requirements deeply.", portugueseText: "Para ser um bom arquiteto de software, você precisa entender profundamente os requisitos de negócio." },
    { id: 4, level: "Avançado", englishText: "Leveraging CQRS and event sourcing can lead to highly scalable and resilient systems, but it introduces complexity.", portugueseText: "Aproveitar CQRS e event sourcing pode levar a sistemas altamente escaláveis e resilientes, mas introduz complexidade." },
    { id: 5, level: "Iniciante", englishText: "I would like to order a coffee, please.", portugueseText: "Eu gostaria de pedir um café, por favor." },
    { id: 6, level: "Iniciante", englishText: "Where is the nearest train station?", portugueseText: "Onde é a estação de trem mais próxima?" },
    { id: 7, level: "Intermediário", englishText: "The team is deploying the new feature to the production environment.", portugueseText: "A equipe está implantando o novo recurso no ambiente de produção." },
    { id: 8, level: "Intermediário", englishText: "Learning a new language opens up a world of opportunities.", portugueseText: "Aprender um novo idioma abre um mundo de oportunidades." },
    { id: 9, level: "Avançado", englishText: "A robust CI/CD pipeline is crucial for modern software development agility.", portugueseText: "Um pipeline de CI/CD robusto é crucial para a agilidade do desenvolvimento de software moderno." },
    { id: 10, level: "Avançado", englishText: "Despite the initial challenges, refactoring the legacy code resulted in significant performance improvements.", portugueseText: "Apesar dos desafios iniciais, a refatoração do código legado resultou em melhorias significativas de desempenho." },
    { id: 11, level: "Iniciante", englishText: "My name is Carlos.", portugueseText: "Meu nome é Carlos." },
    { id: 12, level: "Iniciante", englishText: "What time is it?", portugueseText: "Que horas são?" },
    { id: 13, level: "Iniciante", englishText: "I need help with my luggage.", portugueseText: "Eu preciso de ajuda com minha bagagem." },
    { id: 14, level: "Iniciante", englishText: "How much does this cost?", portugueseText: "Quanto custa isto?" },
    { id: 15, level: "Iniciante", englishText: "The weather is beautiful today.", portugueseText: "O tempo está lindo hoje." },
    { id: 16, level: "Iniciante", englishText: "Can you speak slowly, please?", portugueseText: "Você pode falar devagar, por favor?" },
    { id: 17, level: "Iniciante", englishText: "I am learning English.", portugueseText: "Eu estou aprendendo inglês." },
    { id: 18, level: "Iniciante", englishText: "This is my family.", portugueseText: "Esta é minha família." },
    { id: 19, level: "Iniciante", englishText: "See you tomorrow.", portugueseText: "Até amanhã." },
    { id: 20, level: "Iniciante", englishText: "Have a nice day!", portugueseText: "Tenha um bom dia!" },
    { id: 21, level: "Intermediário", englishText: "The database migration script failed last night.", portugueseText: "O script de migração do banco de dados falhou na noite passada." },
    { id: 22, level: "Intermediário", englishText: "We need to optimize the query to improve performance.", portugueseText: "Nós precisamos otimizar a consulta para melhorar o desempenho." },
    { id: 23, level: "Intermediário", englishText: "What are the main advantages of using this framework?", portugueseText: "Quais são as principais vantagens de usar este framework?" },
    { id: 24, level: "Intermediário", englishText: "The project deadline is approaching quickly.", portugueseText: "O prazo do projeto está se aproximando rapidamente." },
    { id: 25, level: "Intermediário", englishText: "I have been working as a software architect for ten years.", portugueseText: "Eu trabalho como arquiteto de software há dez anos." },
    { id: 26, level: "Intermediário", englishText: "Could you please review my pull request?", portugueseText: "Você poderia, por favor, revisar meu pull request?" },
    { id: 27, level: "Intermediário", englishText: "Effective communication is key to a successful team.", portugueseText: "Comunicação eficaz é a chave para uma equipe de sucesso." },
    { id: 28, level: "Intermediário", englishText: "Let's schedule a meeting to discuss the requirements.", portugueseText: "Vamos agendar uma reunião para discutir os requisitos." },
    { id: 29, level: "Intermediário", englishText: "The application is not responding.", portugueseText: "A aplicação não está respondendo." },
    { id: 30, level: "Intermediário", englishText: "I'm looking forward to our trip to the beach.", portugueseText: "Estou ansioso para nossa viagem à praia." },
    { id: 31, level: "Avançado", englishText: "Idempotency is a critical property for handlers in a distributed event-driven architecture.", portugueseText: "A idempotência é uma propriedade crítica para handlers em uma arquitetura distribuída orientada a eventos." },
    { id: 32, level: "Avançado", englishText: "The CAP theorem forces a choice between consistency and availability during a network partition.", portugueseText: "O teorema CAP força uma escolha entre consistência e disponibilidade durante uma partição de rede." },
    { id: 33, level: "Avançado", englishText: "Implementing a circuit breaker pattern can prevent cascading failures in microservices.", portugueseText: "Implementar um padrão de circuit breaker pode prevenir falhas em cascata em microsserviços." },
    { id: 34, level: "Avançado", englishText: "The nuances of garbage collection in high-performance applications cannot be overstated.", portugueseText: "As nuances da coleta de lixo em aplicações de alto desempenho não podem ser exageradas." },
    { id: 35, level: "Avançado", englishText: "He had to delve into the intricacies of the legacy system to debug the elusive issue.", portugueseText: "Ele teve que mergulhar nas complexidades do sistema legado para depurar o problema elusivo." },
    { id: 36, level: "Avançado", englishText: "The proliferation of IoT devices presents both opportunities and significant security challenges.", portugueseText: "A proliferação de dispositivos IoT apresenta tanto oportunidades quanto desafios de segurança significativos." },
    { id: 37, level: "Avançado", englishText: "Quantum computing threatens to render current cryptographic standards obsolete.", portugueseText: "A computação quântica ameaça tornar os padrões criptográficos atuais obsoletos." },
    { id: 38, level: "Avançado", englishText: "The committee's decision was predicated on a thorough analysis of the economic data.", portugueseText: "A decisão do comitê foi baseada em uma análise completa dos dados econômicos." },
    { id: 39, level: "Avançado", englishText: "They reached an impasse in the negotiations, with neither side willing to compromise.", portugueseText: "Eles chegaram a um impasse nas negociações, com nenhum dos lados disposto a ceder." },
    { id: 40, level: "Avançado", englishText: "To remain competitive, the company must perpetually innovate.", portugueseText: "Para se manter competitiva, a empresa deve inovar perpetuamente." },
    { id: 41, level: "Iniciante", englishText: "The sky is blue.", portugueseText: "O céu é azul." },
    { id: 42, level: "Intermediário", englishText: "I'm reading a book about artificial intelligence.", portugueseText: "Estou lendo um livro sobre inteligência artificial." },
    { id: 43, level: "Avançado", englishText: "The philosophical implications of sentient AI are profound.", portugueseText: "As implicações filosóficas de uma IA senciente são profundas." },
    { id: 44, level: "Iniciante", englishText: "My favorite food is pizza.", portugueseText: "Minha comida favorita é pizza." },
    { id: 45, level: "Intermediário", englishText: "We should refactor this component to make it more reusable.", portugueseText: "Deveríamos refatorar este componente para torná-lo mais reutilizável." },
    { id: 46, level: "Avançado", englishText: "The system exhibits emergent behavior that was not explicitly programmed.", portugueseText: "O sistema exibe um comportamento emergente que não foi explicitamente programado." },
    { id: 47, level: "Iniciante", englishText: "I go to the gym three times a week.", portugueseText: "Eu vou à academia três vezes por semana." },
    { id: 48, level: "Intermediário", englishText: "The API documentation is unclear about this endpoint.", portugueseText: "A documentação da API não é clara sobre este endpoint." },
    { id: 49, level: "Avançado", englishText: "Orthogonality in software design reduces coupling and improves maintainability.", portugueseText: "A ortogonalidade no design de software reduz o acoplamento e melhora a manutenibilidade." },
    { id: 50, level: "Intermediário", englishText: "I'm trying to connect to the database, but I'm getting an error.", portugueseText: "Estou tentando me conectar ao banco de dados, mas estou recebendo um erro." }
  ];

  private lessonsSubject = new BehaviorSubject<Lesson[]>(this.loadLessons());
  public lessons$ = this.lessonsSubject.asObservable();

  private currentFilterSubject = new BehaviorSubject<LevelFilter>('Todos');
  public currentFilter$ = this.currentFilterSubject.asObservable();

  constructor() {
    this.loadUserLessons();
  }

  private loadLessons(): Lesson[] {
    const userLessons = this.getUserLessons();
    return [...this.initialLessons, ...userLessons];
  }

  private loadUserLessons(): void {
    const lessons = this.loadLessons();
    this.lessonsSubject.next(lessons);
  }

  private getUserLessons(): Lesson[] {
    try {
      const saved = localStorage.getItem('userLessons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  private saveUserLessons(userLessons: Lesson[]): void {
    try {
      localStorage.setItem('userLessons', JSON.stringify(userLessons));
    } catch (error) {
      console.error('Failed to save lessons to localStorage:', error);
    }
  }

  getLessons(): Observable<Lesson[]> {
    return this.lessons$;
  }

  getFilteredLessons(filter: LevelFilter): Observable<Lesson[]> {
    return new Observable(observer => {
      this.lessons$.subscribe(lessons => {
        if (filter === 'Todos') {
          observer.next(lessons);
        } else {
          observer.next(lessons.filter(lesson => lesson.level === filter));
        }
      });
    });
  }

  addLesson(lesson: Omit<Lesson, 'id'>): void {
    const userLessons = this.getUserLessons();
    const newLesson: Lesson = {
      ...lesson,
      id: Date.now() // Simple ID generation
    };
    
    userLessons.push(newLesson);
    this.saveUserLessons(userLessons);
    
    const allLessons = [...this.initialLessons, ...userLessons];
    this.lessonsSubject.next(allLessons);
  }

  setFilter(filter: LevelFilter): void {
    this.currentFilterSubject.next(filter);
  }

  getCurrentFilter(): LevelFilter {
    return this.currentFilterSubject.value;
  }
}
