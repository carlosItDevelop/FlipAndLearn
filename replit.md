# Flip & Learn - Angular Flashcard Application

## Overview

Flip & Learn is an interactive Angular application designed for learning English through flashcards. The application allows users to practice English translation by flipping cards between Portuguese and English text, with AI-powered translation capabilities for adding custom lessons.

## User Preferences

Preferred communication style: Simple, everyday language.
User feedback: Very satisfied with gamification implementation ("Lindo!! \0/ \0/")

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
1. **LessonService**: Manages flashcard lessons with PostgreSQL database storage via REST API
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

1. **Lesson Management**: Lessons are stored persistently in PostgreSQL database
2. **API Layer**: Express.js REST API serves lesson data to Angular frontend
3. **Filtering**: Real-time filtering by difficulty level via database queries
4. **Translation**: User input in Portuguese is sent to Gemini AI for English translation
5. **Audio**: Text-to-speech synthesis for English pronunciation practice
6. **State Updates**: Reactive updates using RxJS observables and HTTP requests

## External Dependencies

### Audio Integration (No external API required)
- **Web Speech API**: Native browser API for text-to-speech
- **No API Keys**: Works completely offline with browser support
- **Language Support**: Portuguese (pt-BR) and English (en-US)

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
- **No API Keys Required**: Completely self-contained application
- **Browser Compatibility**: Supports modern browsers with Web Speech API
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Database Architecture
- **PostgreSQL Database**: Persistent storage for lessons with proper schema
- **Drizzle ORM**: Type-safe database operations and schema management
- **REST API**: Express.js backend serving lesson data to Angular frontend
- **Data Persistence**: User-added lessons are permanently stored in database

### Recent Changes (January 11, 2025)
- **Database Migration**: Successfully migrated from PostgreSQL to JSON Server for platform independence
- **JSON Server Integration**: All 22 lessons migrated to db.json with proper data structure  
- **Gamification System**: Implemented comprehensive point/level/achievement system
- **Progress Dashboard**: Added detailed statistics dashboard with charts and progress tracking
- **Study Sessions**: Interactive study sessions with real-time progress tracking
- **Achievement System**: 6 different achievements with progress indicators
- **Navigation Enhancement**: Added Study/Progress view toggle with modern UI
- **Real-time Statistics**: Live tracking of points, streaks, daily goals, and accuracy
- **Local Storage**: Progress and achievements persist between sessions
- **Audio Fix**: Corrected audio to play in correct language (PT/EN) based on displayed text
- **Documentation**: Updated architecture to reflect JSON Server approach

### Potential Enhancements
- **User Authentication**: Individual user accounts and lesson management
- **Progress Tracking**: Learning statistics and completion tracking
- **Offline Support**: Service worker implementation for offline functionality
- **Advanced Filtering**: Search functionality and custom lesson categories

The application follows Angular best practices with standalone components, reactive programming patterns, and modern TypeScript features. The architecture is designed for scalability and maintainability, with clear separation of concerns between services and components.