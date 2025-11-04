import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Openai {

  constructor(private readonly http: HttpClient) {}

  senQuestion(prompt: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${environment.openai.apiKey}`
    });

    const body = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Eres un asistente útil y amable.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    };

    return this.http.post(environment.openai.baseUrl, body, { headers });
  }
}
