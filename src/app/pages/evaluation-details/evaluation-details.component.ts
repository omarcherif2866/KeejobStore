import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Details, Evaluation } from 'src/app/models/evaluation';
import { Partenaire } from 'src/app/models/partenaire';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { PartenaireService } from 'src/app/services/partenaire.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evaluation-details',
  templateUrl: './evaluation-details.component.html',
  styleUrls: ['./evaluation-details.component.css']
})
export class EvaluationDetailsComponent implements OnInit {
    @ViewChild('partnersCarousel', { static: false }) partnersCarousel!: ElementRef;
  evaluations: Evaluation[] = [];
  loading = false;
  availableCategories: string[] = []; // Toutes les catégories disponibles
  groupedDetails: Record<string, Details[]> = {};
  partenaires: Partenaire[] = [];
  evaluationId!: number;
  currentIndexPartners = 0;
  visiblePartners: any[] = [];

  constructor(
    private evaluationservice: EvaluationService, private partenaireService: PartenaireService,  private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.evaluationId = Number(this.route.snapshot.paramMap.get('id'));
    
    // Charger l'évaluation spécifique
    this.fetchEvaluationById(this.evaluationId);    this.fetchCategories();
    this.evaluationId = Number(this.route.snapshot.paramMap.get('id'));
    this.getPartenaireByEvaluation();
  }

  fetchEvaluationById(id: number) {
    this.loading = true;
    this.evaluationservice.getEvaluationById(id).subscribe({
      next: (response: any) => {
        // Mettre UNE SEULE évaluation dans le tableau
        this.evaluations = [new Evaluation(response)];
        this.loading = false;
        console.log('Évaluation chargée:', this.evaluations[0]);
        
        this.groupDetailsByCategory();
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'évaluation:', error);
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

  sanitizeImage(url: string | null): string {
    if (!url) return '';

    if (url.includes("https://res.cloudinary.com") && url.split("https://res.cloudinary.com").length > 2) {
      const parts = url.split("https://res.cloudinary.com/daxkymr4t/image/upload/");
      return "https://res.cloudinary.com/daxkymr4t/image/upload/" + parts[parts.length - 1];
    }

    return url;
  }

  fetchCategories() {
    this.evaluationservice.getAllCategories().subscribe({
      next: (categories: string[]) => {
        this.availableCategories = categories;
        console.log('Catégories disponibles:', this.availableCategories);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    });
  }

groupDetailsByCategory(): void {
  // Réinitialiser l'objet groupedDetails
  this.groupedDetails = {};

  // Parcourir toutes les évaluations
  this.evaluations.forEach(evaluation => {
    // Parcourir toutes les sections
    evaluation.Sections.forEach(section => {
      // Parcourir tous les détails
      section.details.forEach(detail => {
        // Ignorer les détails sans catégorie ou avec catégorie vide
        if (!detail.category || detail.category.trim() === '') {
          return; // Passer au détail suivant
        }

        const category = detail.category;
        
        // Si la catégorie n'existe pas encore, l'initialiser
        if (!this.groupedDetails[category]) {
          this.groupedDetails[category] = [];
        }
        
        // Ajouter le détail à la catégorie
        this.groupedDetails[category].push(detail);
      });
    });
  });

  console.log('Details groupés par catégorie:', this.groupedDetails);
}

  // Méthode utilitaire pour obtenir les détails d'une catégorie spécifique
  getDetailsByCategory(category: string): Details[] {
    return this.groupedDetails[category] || [];
  }

  // Méthode utilitaire pour obtenir toutes les catégories avec des détails
  getCategoriesWithDetails(): string[] {
    return Object.keys(this.groupedDetails);
  }

getPartenaireByEvaluation() {
  const id = this.evaluationId;

  if (!id) return;

  this.partenaireService.getPartenaireByEvaluation(id).subscribe({
    next: (res) => {
      this.partenaires = res;
      console.log("Partenaires récupérés :", this.partenaires);

      this.currentIndexPartners = 0;  
      this.updateVisiblePartners();   // ← IMPORTANT
      console.log("Visible partners :", this.visiblePartners);
    },
    error: (err) => console.error(err)
  });
}


updateVisiblePartners() {
  const total = this.partenaires.length;
  this.visiblePartners = [];

  if (total === 0) return;

  for (let i = 0; i < Math.min(4, total); i++) {
    const index = (this.currentIndexPartners + i) % total;
    this.visiblePartners.push(this.partenaires[index]);
  }
}


  scrollRightPartners() {
    this.currentIndexPartners = (this.currentIndexPartners + 1) % this.partenaires.length;
    this.updateVisiblePartners();

  }

  scrollLeftPartners() {
    this.currentIndexPartners =
      (this.currentIndexPartners - 1 + this.partenaires.length) % this.partenaires.length;
    this.updateVisiblePartners();
  }




}