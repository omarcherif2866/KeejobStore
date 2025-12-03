import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Partenaire } from '../models/partenaire';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PartenaireService {
  private apiUrl = "http://localhost:9090/partenaire";


  constructor(private http: HttpClient, private router: Router) { }

getPartenaireById(id: any): Observable<Partenaire> {
  return this.http.get<Partenaire>(`${this.apiUrl}/${id}`).pipe(
    tap(data => console.log('Partenaire reçu:', data)), // debug
    catchError((error: any) => {
      console.error('Erreur lors de la récupération du Partenaire:', error);
      return throwError(error);
    })
  );
}


// Partenaire.service.ts
getPartenaire(): Observable<Partenaire[]> {
  return this.http.get<any[]>(`${this.apiUrl}/allPartenaires`).pipe(
      tap(data => console.log('Données reçues:', data)), // ✅ Debug
      catchError((error: any) => {
        console.error('Erreur:', error);
        return throwError(error);
      })
    );
}




addPartenaire(data: FormData): Observable<Partenaire> {
  // Pas besoin de spécifier Content-Type, le navigateur le fera automatiquement pour FormData
  return this.http.post<Partenaire>(`${this.apiUrl}`, data)
    .pipe(
      catchError((error: any) => {
        console.error('Erreur lors de l\'ajout du Partenaire:', error);
        return throwError('Une erreur s\'est produite lors de l\'ajout du Partenaire. Veuillez réessayer.');
      })
    );
}

  putPartenaire(id: string, formData: any): Observable<Partenaire> {
  return this.http.put<Partenaire | HttpErrorResponse>(`${this.apiUrl}/${id}`, formData)
    .pipe(
      map((response: any) => {
        // Vérifier si la réponse est une instance de HttpErrorResponse
        if (response instanceof HttpErrorResponse) {
          // Si c'est une erreur HTTP, propager l'erreur
          throw response;
        } else {
          // Sinon, retourner la réponse comme une instance d'Activite
          return response as Partenaire;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Traiter les erreurs HTTP ici
        console.error('Erreur lors de la mise à jour du Partenaire:', error);
        // Retourner une erreur observable
        return throwError('Une erreur s\'est Partenairee lors de la mise à jour du Partenaire. Veuillez réessayer.');
      })
    );
}


  deletePartenaire(id:any):Observable<Partenaire>{
    return this.http.delete<Partenaire>(`${this.apiUrl}/${id}`)

  }

  getPartenaireBySousFormationKeejob(sousFormationId: number): Observable<Partenaire[]> {
    return this.http.get<Partenaire[]>(`${this.apiUrl}/sousFormation/${sousFormationId}`);
  }

  getPartenaireByFormationKeejob(FormationId: number): Observable<Partenaire[]> {
    return this.http.get<Partenaire[]>(`${this.apiUrl}/formation/${FormationId}`);
  }

  getPartenaireByEvaluation(evaluationId: number): Observable<Partenaire[]> {
    return this.http.get<Partenaire[]>(`${this.apiUrl}/evaluation/${evaluationId}`);
  }

}


