import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { FormationKeejob } from '../models/formation-keejob';

@Injectable({
  providedIn: 'root'
})
export class FormationKeejobService {
  private apiUrl = "http://localhost:9090/formationKeejob";


  constructor(private http: HttpClient, private router: Router) { }

getFormationKeejobById(id: any): Observable<FormationKeejob> {
  return this.http.get<FormationKeejob>(`${this.apiUrl}/${id}`).pipe(
    tap(data => console.log('FormationKeejob reçu:', data)), // debug
    catchError((error: any) => {
      console.error('Erreur lors de la récupération du FormationKeejob:', error);
      return throwError(error);
    })
  );
}


// FormationKeejob.service.ts
getFormationKeejob(): Observable<FormationKeejob[]> {
  return this.http.get<any[]>(`${this.apiUrl}/allFormationKeejobs`).pipe(
      // tap(data => console.log('Données reçuess:', data)), // ✅ Debug
      catchError((error: any) => {
        console.error('Erreur:', error);
        return throwError(error);
      })
    );

    
}




addFormationKeejob(data: FormData): Observable<FormationKeejob> {
  // Pas besoin de spécifier Content-Type, le navigateur le fera automatiquement pour FormData
  return this.http.post<FormationKeejob>(`${this.apiUrl}`, data)
    .pipe(
      catchError((error: any) => {
        console.error('Erreur lors de l\'ajout du FormationKeejob:', error);
        return throwError('Une erreur s\'est produite lors de l\'ajout du FormationKeejob. Veuillez réessayer.');
      })
    );
}

  putFormationKeejob(id: string, formData: any): Observable<FormationKeejob> {
  return this.http.put<FormationKeejob | HttpErrorResponse>(`${this.apiUrl}/${id}`, formData)
    .pipe(
      map((response: any) => {
        // Vérifier si la réponse est une instance de HttpErrorResponse
        if (response instanceof HttpErrorResponse) {
          // Si c'est une erreur HTTP, propager l'erreur
          throw response;
        } else {
          // Sinon, retourner la réponse comme une instance d'Activite
          return response as FormationKeejob;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Traiter les erreurs HTTP ici
        console.error('Erreur lors de la mise à jour du FormationKeejob:', error);
        // Retourner une erreur observable
        return throwError('Une erreur s\'est FormationKeejobe lors de la mise à jour du FormationKeejob. Veuillez réessayer.');
      })
    );
}


  deleteFormationKeejob(id:any):Observable<FormationKeejob>{
    return this.http.delete<FormationKeejob>(`${this.apiUrl}/${id}`)

  }


}



