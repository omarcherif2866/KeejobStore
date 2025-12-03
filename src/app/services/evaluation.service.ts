import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { Evaluation } from '../models/evaluation';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private apiUrl = "http://localhost:9090/evaluation";


  constructor(private http: HttpClient, private router: Router) { }

getEvaluationById(id: any): Observable<Evaluation> {
  return this.http.get<Evaluation>(`${this.apiUrl}/${id}`).pipe(
    tap(data => console.log('Evaluation reçu:', data)), // debug
    catchError((error: any) => {
      console.error('Erreur lors de la récupération du Evaluation:', error);
      return throwError(error);
    })
  );
}


// Evaluation.service.ts
getEvaluation(): Observable<Evaluation[]> {
  return this.http.get<any[]>(`${this.apiUrl}/allEvaluations`).pipe(
      tap(data => console.log('Données reçues:', data)), // ✅ Debug
      catchError((error: any) => {
        console.error('Erreur:', error);
        return throwError(error);
      })
    );
}




addEvaluation(data: FormData): Observable<Evaluation> {
  // Pas besoin de spécifier Content-Type, le navigateur le fera automatiquement pour FormData
  return this.http.post<Evaluation>(`${this.apiUrl}`, data)
    .pipe(
      catchError((error: any) => {
        console.error('Erreur lors de l\'ajout du Evaluation:', error);
        return throwError('Une erreur s\'est produite lors de l\'ajout du Evaluation. Veuillez réessayer.');
      })
    );
}

  putEvaluation(id: string, formData: any): Observable<Evaluation> {
  return this.http.put<Evaluation | HttpErrorResponse>(`${this.apiUrl}/${id}`, formData)
    .pipe(
      map((response: any) => {
        // Vérifier si la réponse est une instance de HttpErrorResponse
        if (response instanceof HttpErrorResponse) {
          // Si c'est une erreur HTTP, propager l'erreur
          throw response;
        } else {
          // Sinon, retourner la réponse comme une instance d'Activite
          return response as Evaluation;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Traiter les erreurs HTTP ici
        console.error('Erreur lors de la mise à jour du Evaluation:', error);
        // Retourner une erreur observable
        return throwError('Une erreur s\'est Evaluatione lors de la mise à jour du Evaluation. Veuillez réessayer.');
      })
    );
}


  deleteEvaluation(id:any):Observable<Evaluation>{
    return this.http.delete<Evaluation>(`${this.apiUrl}/${id}`)

  }


  getAllCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  // Optionnel : récupérer les détails groupés par catégorie
  getDetailsByCategory(): Observable<Record<string, any[]>> {
    return this.http.get<Record<string, any[]>>(`${this.apiUrl}/by-category`);
  }

}

