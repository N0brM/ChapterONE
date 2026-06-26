import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface TextAnalysisResult {
  wordCount: number;
  sentenceCount: number;
  readingTimeMinutes: number;
  predominantEmotion: string;
  readingLevel: string;
}

export interface ImproveTextResult {
  improvedText: string;
}

@Injectable({ providedIn: 'root' })
export class AiService {
  private apiUrl = `${environment.apiUrl}/api/AI`;

  constructor(private http: HttpClient) {}

  analyzeText(text: string): Observable<TextAnalysisResult> {
    return this.http.post<any>(`${this.apiUrl}/analyze`, { Text: text }).pipe(
      map(res => ({
        wordCount:          res.WordCount          ?? 0,
        sentenceCount:      res.SentenceCount      ?? 0,
        readingTimeMinutes: res.ReadingTimeMinutes ?? 1,
        predominantEmotion: res.predominantEmotion ?? res.PredominantEmotion ?? 'Neutro',
        readingLevel:       res.readingLevel       ?? res.ReadingLevel       ?? 'Geral',
      }))
    );
  }

  improveText(text: string, type: 'grammar' | 'vocabulary' | 'style'): Observable<ImproveTextResult> {
    return this.http.post<any>(`${this.apiUrl}/improve`, { Text: text, Type: type }).pipe(
      map(res => ({
        improvedText: res.ImprovedText ?? '',
      }))
    );
  }
}