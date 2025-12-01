import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Logiciel } from '../models/logiciel';

@Injectable({
  providedIn: 'root'
})
export class LogicielService {

  private apiUrl = "http://localhost:9090/logiciel";


  constructor(private http: HttpClient, private router: Router) { }

  getLogicielById(id: any): Observable<Logiciel> {
    return this.http.get<Logiciel>(`${this.apiUrl}/` + id);
  } 

// Logiciel.service.ts
getLogiciel(): Observable<Logiciel[]> {
  return this.http.get<any[]>(`${this.apiUrl}/allLogiciels`).pipe(
      tap(data => console.log('logiciels reçues:', data)), // ✅ Debug
      catchError((error: any) => {
        console.error('Erreur:', error);
        return throwError(error);
      })
    );
}




  addLogiciel(data: any): Observable<Logiciel> {
    return this.http.post<Logiciel>(`${this.apiUrl}`, data)
      .pipe(
        catchError((error: any) => {
          console.error('Erreur lors de l\'ajout du Logiciel:', error);
          return throwError('Une erreur s\'est Logiciele lors de l\'ajout du Logiciel. Veuillez réessayer.');
        })
      );
  }

  putLogiciel(id: string, formData: any): Observable<Logiciel> {
  return this.http.put<Logiciel | HttpErrorResponse>(`${this.apiUrl}/${id}`, formData)
    .pipe(
      map((response: any) => {
        // Vérifier si la réponse est une instance de HttpErrorResponse
        if (response instanceof HttpErrorResponse) {
          // Si c'est une erreur HTTP, propager l'erreur
          throw response;
        } else {
          // Sinon, retourner la réponse comme une instance d'Activite
          return response as Logiciel;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Traiter les erreurs HTTP ici
        console.error('Erreur lors de la mise à jour du Logiciel:', error);
        // Retourner une erreur observable
        return throwError('Une erreur s\'est Logiciele lors de la mise à jour du Logiciel. Veuillez réessayer.');
      })
    );
}


  deleteLogiciel(id:any):Observable<Logiciel>{
    return this.http.delete<Logiciel>(`${this.apiUrl}/${id}`)

  }

    getLogicielBySousFormationKeejob(sousFormationId: number): Observable<Logiciel[]> {
    return this.http.get<Logiciel[]>(`${this.apiUrl}/sousFormation/${sousFormationId}`);
  }
}

