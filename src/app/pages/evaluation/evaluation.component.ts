import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Evaluation } from 'src/app/models/evaluation';
import { EvaluationService } from 'src/app/services/evaluation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {
  evaluations: Evaluation[] = [];
  loading = false;
  constructor(private evaluationservice: EvaluationService,private router:Router) {}

  ngOnInit(): void {
    this.fetchevaluations()
  }

  fetchevaluations() {
    this.loading = true;
    this.evaluationservice.getEvaluation().subscribe(
      (response: any[]) => {
        // Transformer chaque JSON en instance de Evaluation
        this.evaluations = response.map(f => new Evaluation(
          f.id,
          f.name,
          f.description,
          f.title,
          f.subTitle,
          f.image,
          f.evaluationDescriptions || [],

        ));
        this.evaluations = this.evaluations; // si pagination ou filtrage
        this.loading = false;
        console.log('Données reçuess: ', this.evaluations);
      },
      (error) => {
        console.error('Erreur lors du chargement des evaluations:', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors du chargement des données',
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
  }

sanitizeImage(url: string): string {
  if (!url) return '';

  // Cas où l'URL est en double
  if (url.includes("https://res.cloudinary.com") && url.split("https://res.cloudinary.com").length > 2) {
    const parts = url.split("https://res.cloudinary.com/daxkymr4t/image/upload/");
    return "https://res.cloudinary.com/daxkymr4t/image/upload/" + parts[parts.length - 1];
  }

  return url;
}


}
