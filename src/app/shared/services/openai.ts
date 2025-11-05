import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Openai {

  constructor(private readonly http: HttpClient){

  }

  senQuestion(prompt: string){

    return this.http.post(environment.baseUrl, {prompt});

  }
}