import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface TranslationRequest {
  text: string;
  targetLanguage: 'en' | 'pt';
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

  constructor(private http: HttpClient) {
    // Get API key from Replit environment
    this.apiKey = this.getEnvironmentVariable('GEMINI_API_KEY') || '';
  }

  private getEnvironmentVariable(name: string): string {
    // For browser environment, get from window object
    if (typeof window !== 'undefined' && (window as any)._env) {
      return (window as any)._env[name] || '';
    }
    
    return '';
  }

  translateText(request: TranslationRequest): Observable<string> {
    if (!this.apiKey) {
      return throwError(() => new Error('Gemini API key is not configured. Please set GEMINI_API_KEY environment variable.'));
    }

    const prompt = this.buildPrompt(request);
    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const url = `${this.baseUrl}?key=${this.apiKey}`;

    return this.http.post<GeminiResponse>(url, payload, { headers }).pipe(
      map(response => {
        if (response.candidates && response.candidates.length > 0) {
          const translatedText = response.candidates[0].content.parts[0].text.trim();
          return translatedText;
        }
        throw new Error('Empty response from translation API');
      }),
      catchError(error => {
        console.error('Translation error:', error);
        if (error.status === 400) {
          return throwError(() => new Error('Invalid request to translation API. Please check your input.'));
        } else if (error.status === 401) {
          return throwError(() => new Error('Invalid API key. Please check your Gemini API configuration.'));
        } else if (error.status === 429) {
          return throwError(() => new Error('Translation quota exceeded. Please try again later.'));
        }
        return throwError(() => new Error('Translation service is currently unavailable. Please try again later.'));
      })
    );
  }

  private buildPrompt(request: TranslationRequest): string {
    const sourceLanguage = request.targetLanguage === 'en' ? 'Portuguese' : 'English';
    const targetLanguage = request.targetLanguage === 'en' ? 'English' : 'Portuguese';
    
    return `Translate the following sentence from ${sourceLanguage} to ${targetLanguage}. Only return the translated text, without any introductory phrases or explanations. The text is: "${request.text}"`;
  }
}
