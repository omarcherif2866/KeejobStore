import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceFormateur } from '../models/service-formateur';

@Injectable({
  providedIn: 'root'
})
export class ServiceFormateurService {

  private apiUrl = "http://localhost:9090/serviceFormateur";


  constructor(private http: HttpClient, private router: Router) { }


  getServicesByFormateur(formateurId: any): Observable<ServiceFormateur[]> {
    return this.http.get<ServiceFormateur[]>(`${this.apiUrl}/byFormateur/${formateurId}`);
  }

    add(service: any): Observable<ServiceFormateur> {
    return this.http.post<ServiceFormateur>(this.apiUrl, service);
  }

  // Mettre à jour un service existant
  update(id: number | string, service: any): Observable<ServiceFormateur> {
    return this.http.put<ServiceFormateur>(`${this.apiUrl}/${id}`, service);
  }

    getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

}