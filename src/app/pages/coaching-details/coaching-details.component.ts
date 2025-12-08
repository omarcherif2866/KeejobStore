import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Coaching } from 'src/app/models/coaching';
import { Partenaire } from 'src/app/models/partenaire';
import { CoachingService } from 'src/app/services/coaching.service';
import { PartenaireService } from 'src/app/services/partenaire.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-coaching-details',
  templateUrl: './coaching-details.component.html',
  styleUrls: ['./coaching-details.component.css']
})
export class CoachingDetailsComponent implements OnInit {

  coachingId!: number;
  loading = false;
  coachings: Coaching[] = [];
  partenaires: Partenaire[] = [];
  currentIndexPartners = 0;
  visiblePartners: any[] = [];
  constructor(
    private coachingService: CoachingService, private partenaireService: PartenaireService,  private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.coachingId = Number(this.route.snapshot.paramMap.get('id'));
    
    // Charger l'évaluation spécifique
    this.fetchCoachingById(this.coachingId);   
  }


fetchCoachingById(id: number) {
  this.loading = true;

  this.coachingService.getCoachingById(id).subscribe({
    next: (response: any) => {

      // Mettre une seule coaching dans le tableau
      this.coachings = [new Coaching(response)];

      // ⬇️ AJOUTE CETTE LIGNE POUR LE CARROUSEL
      this.partenaires = response.coachingPartenaires || [];

      // ⬇️ MET À JOUR POUR AFFICHER LES 4 PREMIERS
      this.updateVisiblePartners();

      this.loading = false;
      console.log("Partenaires reçus :", this.partenaires);
    },
    error: (error) => {
      console.error('Erreur chargement Coaching:', error);
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

getColorClass(i: number): string {
  const colors = ['card-blue', 'card-yellow', 'card-green'];
  return colors[i % 3];   // cycle automatiquement
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
