import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Actualite } from '../models/actualite';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ActualiteService {

  private apiUrl = "http://localhost:9090/actualite";


  constructor(private http: HttpClient, private router: Router) { }

  getActualiteById(id: any): Observable<Actualite> {
    return this.http.get<Actualite>(`${this.apiUrl}/` + id);
  } 

// actualite.service.ts
getActualite(): Observable<Actualite[]> {
  return this.http.get<any[]>(`${this.apiUrl}/allActualitess`).pipe(
      tap(data => console.log('Données reçues:', data)), // ✅ Debug
      catchError((error: any) => {
        console.error('Erreur:', error);
        return throwError(error);
      })
    );
}




  addActualite(data: any): Observable<Actualite> {
    return this.http.post<Actualite>(`${this.apiUrl}`, data)
      .pipe(
        catchError((error: any) => {
          console.error('Erreur lors de l\'ajout du Actualite:', error);
          return throwError('Une erreur s\'est Actualitee lors de l\'ajout du Actualite. Veuillez réessayer.');
        })
      );
  }

  putActualite(id: string, formData: any): Observable<Actualite> {
  return this.http.put<Actualite | HttpErrorResponse>(`${this.apiUrl}/${id}`, formData)
    .pipe(
      map((response: any) => {
        // Vérifier si la réponse est une instance de HttpErrorResponse
        if (response instanceof HttpErrorResponse) {
          // Si c'est une erreur HTTP, propager l'erreur
          throw response;
        } else {
          // Sinon, retourner la réponse comme une instance d'Activite
          return response as Actualite;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Traiter les erreurs HTTP ici
        console.error('Erreur lors de la mise à jour du Actualite:', error);
        // Retourner une erreur observable
        return throwError('Une erreur s\'est Actualitee lors de la mise à jour du Actualite. Veuillez réessayer.');
      })
    );
}


  deleteActualite(id:any):Observable<Actualite>{
    return this.http.delete<Actualite>(`${this.apiUrl}/${id}`)

  }
}
