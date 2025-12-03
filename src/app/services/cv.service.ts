import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Cv } from '../models/cv';

@Injectable({
  providedIn: 'root'
})
export class CvService {
  private apiUrl = "http://localhost:9090/cv";


  constructor(private http: HttpClient, private router: Router) { }

getCvById(id: any): Observable<Cv> {
  return this.http.get<Cv>(`${this.apiUrl}/${id}`).pipe(
    tap(data => console.log('Cv reçu:', data)), // debug
    catchError((error: any) => {
      console.error('Erreur lors de la récupération du Cv:', error);
      return throwError(error);
    })
  );
}


// Cv.service.ts
getCv(): Observable<Cv[]> {
  return this.http.get<any[]>(`${this.apiUrl}/allCVandLetters`).pipe(
      tap(data => console.log('Données reçues:', data)), // ✅ Debug
      catchError((error: any) => {
        console.error('Erreur:', error);
        return throwError(error);
      })
    );
}




addCv(data: FormData): Observable<Cv> {
  // Pas besoin de spécifier Content-Type, le navigateur le fera automatiquement pour FormData
  return this.http.post<Cv>(`${this.apiUrl}`, data)
    .pipe(
      catchError((error: any) => {
        console.error('Erreur lors de l\'ajout du Cv:', error);
        return throwError('Une erreur s\'est produite lors de l\'ajout du Cv. Veuillez réessayer.');
      })
    );
}

  putCv(id: string, formData: any): Observable<Cv> {
  return this.http.put<Cv | HttpErrorResponse>(`${this.apiUrl}/${id}`, formData)
    .pipe(
      map((response: any) => {
        // Vérifier si la réponse est une instance de HttpErrorResponse
        if (response instanceof HttpErrorResponse) {
          // Si c'est une erreur HTTP, propager l'erreur
          throw response;
        } else {
          // Sinon, retourner la réponse comme une instance d'Activite
          return response as Cv;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Traiter les erreurs HTTP ici
        console.error('Erreur lors de la mise à jour du Cv:', error);
        // Retourner une erreur observable
        return throwError('Une erreur s\'est Cve lors de la mise à jour du Cv. Veuillez réessayer.');
      })
    );
}


  deleteCv(id:any):Observable<Cv>{
    return this.http.delete<Cv>(`${this.apiUrl}/${id}`)

  }


}
