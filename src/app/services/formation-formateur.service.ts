import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormationFormateurService {


  private apiUrl = 'http://localhost:9090/formationsFormateur';

  constructor(private http: HttpClient) {}

  // ✔ Récupérer toutes les formations
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  // ✔ Ajouter une formation
  add(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, data);
  }

  // ✔ Récupérer les formations d’un formateur
  getByFormateur(id: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/byFormateur/${id}`);
  }

    // ✅ Ajoutez cette méthode
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  
  // ✅ Ajoutez cette méthode
  update(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }
}
