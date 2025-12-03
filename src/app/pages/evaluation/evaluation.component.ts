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
  currentIndex = 0; // index de départ
  visibleEvaluations: Evaluation[] = [];

  ngOnInit(): void {
    this.fetchEvaluations()
  }

fetchEvaluations() {
  this.loading = true;
  this.evaluationservice.getEvaluation().subscribe({
    next: (response: any[]) => {
      this.evaluations = response.map(data => new Evaluation(data));
      this.loading = false;

      console.log('Données reçues: ', this.evaluations);

      // 👉 AJOUT ICI
      if (this.evaluations.length > 0) {
        this.currentIndex = 0;
        this.updateVisibleEvaluations();
      }
    },
    error: (error) => {
      console.error('Erreur lors du chargement des évaluations:', error);
      this.loading = false;
      Swal.fire({
        icon: 'error',
        title: 'Erreur lors du chargement des données',
        showConfirmButton: false,
        timer: 1500
      });
    }
  });
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


updateVisibleEvaluations() {
    this.visibleEvaluations = [];

    for (let i = 0; i < 3; i++) {
      const index = (this.currentIndex + i) % this.evaluations.length;
      this.visibleEvaluations.push(this.evaluations[index]);
    }
  }

  scrollRight() {
    this.currentIndex = (this.currentIndex + 1) % this.evaluations.length;
    this.updateVisibleEvaluations();
  }

  scrollLeft() {
    this.currentIndex =
      (this.currentIndex - 1 + this.evaluations.length) %
      this.evaluations.length;

    this.updateVisibleEvaluations();
  }

}
