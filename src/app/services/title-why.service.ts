import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TitleWhy } from '../models/title-why';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TitleWhyService {

  private apiUrl = 'http://localhost:9090/titleWhy'; // à adapter selon ton backend

  constructor(private http: HttpClient) { }

  // Récupérer tous les TitleWhy pour un formateur
  getTitleWhyByFormateur(formateurId: any): Observable<TitleWhy[]> {
    return this.http.get<TitleWhy[]>(`${this.apiUrl}/byFormateur/${formateurId}`);
  }

    add(service: any): Observable<TitleWhy> {
    return this.http.post<TitleWhy>(this.apiUrl, service);
  }

  // Mettre à jour un service existant
  update(id: number | string, service: any): Observable<TitleWhy> {
    return this.http.put<TitleWhy>(`${this.apiUrl}/${id}`, service);
  }

    getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
