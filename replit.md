# Flip & Learn - Angular Flashcard Application

## Overview

Flip & Learn is an interactive Angular application designed for learning English through flashcards. The application allows users to practice English translation by flipping cards between Portuguese and English text, with AI-powered translation capabilities for adding custom lessons.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Angular 19.x with standalone components
- **Styling**: Tailwind CSS for responsive design
- **Language**: TypeScript with strict mode enabled
- **Component Architecture**: Standalone components with modular design
- **State Management**: RxJS observables for reactive data flow

### Key Technologies
- Angular CLI for build and development tooling
- Google Generative AI (@google/genai) for translation services
- Web Speech API for text-to-speech functionality
- Tailwind CSS for utility-first styling
- RxJS for reactive programming patterns

## Key Components

### Core Services
1. **LessonService**: Manages flashcard lessons with in-memory storage
2. **AudioService**: Handles text-to-speech functionality using Web Speech API
3. **TranslationService**: Integrates with Google Gemini AI for Portuguese-to-English translation

### UI Components
1. **FlashcardComponent**: Interactive card component with flip animations
2. **AddLessonModalComponent**: Modal for adding new lessons with AI translation
3. **AppComponent**: Main application container with filtering and navigation

### Data Models
- **Lesson**: Interface defining flashcard structure (id, level, englishText, portugueseText)
- **LevelFilter**: Type for filtering lessons by difficulty level

## Data Flow

1. **Lesson Management**: Lessons are stored in-memory within LessonService
2. **Filtering**: Real-time filtering by difficulty level (Iniciante, Intermediário, Avançado, Pessoal)
3. **Translation**: User input in Portuguese is sent to Gemini AI for English translation
4. **Audio**: Text-to-speech synthesis for English pronunciation practice
5. **State Updates**: Reactive updates using RxJS observables and BehaviorSubjects

## External Dependencies

### AI Integration
- **Google Gemini API**: Used for Portuguese-to-English translation
- **API Key**: Configured through environment variables (GEMINI_API_KEY)
- **Fallback**: Graceful degradation when API key is not available

### Browser APIs
- **Web Speech API**: For text-to-speech functionality
- **LocalStorage**: Potential for persistence (not currently implemented)

### Development Dependencies
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS & Autoprefixer**: CSS processing and vendor prefixes
- **TypeScript**: Type safety and modern JavaScript features

## Deployment Strategy

### Build Configuration
- **Development**: Standard Angular CLI development server
- **Production**: Optimized builds with code splitting and minification
- **Bundle Budgets**: Configured limits for initial bundle (500KB warning, 1MB error)

### Environment Configuration
- **API Keys**: Environment-based configuration for Gemini API
- **Browser Compatibility**: Supports modern browsers with Web Speech API
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Potential Enhancements
- **Database Integration**: Could be extended with Drizzle ORM for data persistence
- **User Authentication**: Potential for user-specific lesson management
- **Progress Tracking**: Could implement learning progress and statistics
- **Offline Support**: Service worker implementation for offline functionality

The application follows Angular best practices with standalone components, reactive programming patterns, and modern TypeScript features. The architecture is designed for scalability and maintainability, with clear separation of concerns between services and components.