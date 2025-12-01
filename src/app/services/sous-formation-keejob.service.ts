import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { SousFormationKeejob } from '../models/sous-formation-keejob';
@Injectable({
  providedIn: 'root'
})
export class SousFormationKeejobService {
  private apiUrl = "http://localhost:9090/sousFormationKeejob";


  constructor(private http: HttpClient, private router: Router) { }

getSousFormationKeejobById(id: any): Observable<SousFormationKeejob> {
  return this.http.get<SousFormationKeejob>(`${this.apiUrl}/${id}`).pipe(
    tap(data => console.log('SousFormationKeejob reçu:', data)), // debug
    catchError((error: any) => {
      console.error('Erreur lors de la récupération du SousFormationKeejob:', error);
      return throwError(error);
    })
  );
}


// SousFormationKeejob.service.ts
getSousFormationKeejob(): Observable<SousFormationKeejob[]> {
  return this.http.get<any[]>(`${this.apiUrl}/allSousFormationKeejobs`).pipe(
      tap(data => console.log('Données reçues:', data)), // ✅ Debug
      catchError((error: any) => {
        console.error('Erreur:', error);
        return throwError(error);
      })
    );
}




addSousFormationKeejob(data: FormData): Observable<SousFormationKeejob> {
  // Pas besoin de spécifier Content-Type, le navigateur le fera automatiquement pour FormData
  return this.http.post<SousFormationKeejob>(`${this.apiUrl}`, data)
    .pipe(
      catchError((error: any) => {
        console.error('Erreur lors de l\'ajout du SousFormationKeejob:', error);
        return throwError('Une erreur s\'est produite lors de l\'ajout du SousFormationKeejob. Veuillez réessayer.');
      })
    );
}

  putSousFormationKeejob(id: string, formData: any): Observable<SousFormationKeejob> {
  return this.http.put<SousFormationKeejob | HttpErrorResponse>(`${this.apiUrl}/${id}`, formData)
    .pipe(
      map((response: any) => {
        // Vérifier si la réponse est une instance de HttpErrorResponse
        if (response instanceof HttpErrorResponse) {
          // Si c'est une erreur HTTP, propager l'erreur
          throw response;
        } else {
          // Sinon, retourner la réponse comme une instance d'Activite
          return response as SousFormationKeejob;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Traiter les erreurs HTTP ici
        console.error('Erreur lors de la mise à jour du SousFormationKeejob:', error);
        // Retourner une erreur observable
        return throwError('Une erreur s\'est SousFormationKeejobe lors de la mise à jour du SousFormationKeejob. Veuillez réessayer.');
      })
    );
}


  deleteSousFormationKeejob(id:any):Observable<SousFormationKeejob>{
    return this.http.delete<SousFormationKeejob>(`${this.apiUrl}/${id}`)

  }


  getSousFormationKeejobByFormationKeejob(formationId: number): Observable<SousFormationKeejob[]> {
  return this.http.get<SousFormationKeejob[]>(`${this.apiUrl}/formation/${formationId}`);
}


assignLogicielsToSousFormation(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/assign-logiciels`, data);
}



}



