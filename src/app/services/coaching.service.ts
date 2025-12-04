import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { Coaching } from '../models/coaching';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoachingService {
  private apiUrl = "http://localhost:9090/coaching";


  constructor(private http: HttpClient, private router: Router) { }

getCoachingById(id: any): Observable<Coaching> {
  return this.http.get<Coaching>(`${this.apiUrl}/${id}`).pipe(
    tap(data => console.log('Coaching reçu:', data)), // debug
    catchError((error: any) => {
      console.error('Erreur lors de la récupération du Coaching:', error);
      return throwError(error);
    })
  );
}


// Coaching.service.ts
getCoaching(): Observable<Coaching[]> {
  return this.http.get<any[]>(`${this.apiUrl}/allCoachingEmplois`).pipe(
      tap(data => console.log('Données reçues:', data)), // ✅ Debug
      catchError((error: any) => {
        console.error('Erreur:', error);
        return throwError(error);
      })
    );
}




addCoaching(data: FormData): Observable<Coaching> {
  // Pas besoin de spécifier Content-Type, le navigateur le fera automatiquement pour FormData
  return this.http.post<Coaching>(`${this.apiUrl}`, data)
    .pipe(
      catchError((error: any) => {
        console.error('Erreur lors de l\'ajout du Coaching:', error);
        return throwError('Une erreur s\'est produite lors de l\'ajout du Coaching. Veuillez réessayer.');
      })
    );
}

  putCoaching(id: string, formData: any): Observable<Coaching> {
  return this.http.put<Coaching | HttpErrorResponse>(`${this.apiUrl}/${id}`, formData)
    .pipe(
      map((response: any) => {
        // Vérifier si la réponse est une instance de HttpErrorResponse
        if (response instanceof HttpErrorResponse) {
          // Si c'est une erreur HTTP, propager l'erreur
          throw response;
        } else {
          // Sinon, retourner la réponse comme une instance d'Activite
          return response as Coaching;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Traiter les erreurs HTTP ici
        console.error('Erreur lors de la mise à jour du Coaching:', error);
        // Retourner une erreur observable
        return throwError('Une erreur s\'est Coachinge lors de la mise à jour du Coaching. Veuillez réessayer.');
      })
    );
}


  deleteCoaching(id:any):Observable<Coaching>{
    return this.http.delete<Coaching>(`${this.apiUrl}/${id}`)

  }


}
