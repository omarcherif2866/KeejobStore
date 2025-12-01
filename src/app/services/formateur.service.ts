import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Formateur } from '../models/formateur';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ServiceFormateur } from '../models/service-formateur';
import { TitleWhy } from '../models/title-why';

@Injectable({
  providedIn: 'root'
})
export class FormateurService {


  private apiUrl = "http://localhost:9090/formateur";


  constructor(private http: HttpClient, private router: Router) { }

getFormateurById(id: any): Observable<Formateur> {
  return this.http.get<Formateur>(`${this.apiUrl}/${id}`).pipe(
    tap(data => console.log('Formateur reçu:', data)), // debug
    catchError((error: any) => {
      console.error('Erreur lors de la récupération du formateur:', error);
      return throwError(error);
    })
  );
}


// Formateur.service.ts
getFormateur(): Observable<Formateur[]> {
  return this.http.get<any[]>(`${this.apiUrl}/allFormateurs`).pipe(
      tap(data => console.log('Données reçues:', data)), // ✅ Debug
      catchError((error: any) => {
        console.error('Erreur:', error);
        return throwError(error);
      })
    );
}




addFormateur(data: FormData): Observable<Formateur> {
  // Pas besoin de spécifier Content-Type, le navigateur le fera automatiquement pour FormData
  return this.http.post<Formateur>(`${this.apiUrl}`, data)
    .pipe(
      catchError((error: any) => {
        console.error('Erreur lors de l\'ajout du Formateur:', error);
        return throwError('Une erreur s\'est produite lors de l\'ajout du Formateur. Veuillez réessayer.');
      })
    );
}

  putFormateur(id: string, formData: any): Observable<Formateur> {
  return this.http.put<Formateur | HttpErrorResponse>(`${this.apiUrl}/${id}`, formData)
    .pipe(
      map((response: any) => {
        // Vérifier si la réponse est une instance de HttpErrorResponse
        if (response instanceof HttpErrorResponse) {
          // Si c'est une erreur HTTP, propager l'erreur
          throw response;
        } else {
          // Sinon, retourner la réponse comme une instance d'Activite
          return response as Formateur;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Traiter les erreurs HTTP ici
        console.error('Erreur lors de la mise à jour du Formateur:', error);
        // Retourner une erreur observable
        return throwError('Une erreur s\'est Formateure lors de la mise à jour du Formateur. Veuillez réessayer.');
      })
    );
}


  deleteFormateur(id:any):Observable<Formateur>{
    return this.http.delete<Formateur>(`${this.apiUrl}/${id}`)

  }
}
