import { Injectable } from '@angular/core';
import { EvaluationCatalogue } from '../models/evaluation-catalogue';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvaluationCatalogueService {
  private apiUrll = "http://localhost:9090/evaluationDescription";

  constructor(private http: HttpClient, private router: Router) { }


    getEvaluationCatalogueByEvaluation(evaluationId: any): Observable<EvaluationCatalogue[]> {
    return this.http.get<EvaluationCatalogue[]>(`${this.apiUrll}/byEvaluation/${evaluationId}`);
  }

}
