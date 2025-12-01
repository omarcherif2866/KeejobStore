import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormationKeejob } from 'src/app/models/formation-keejob';
import { SousFormationKeejob } from 'src/app/models/sous-formation-keejob';
import { FormationKeejobService } from 'src/app/services/formation-keejob.service';
import { SousFormationKeejobService } from 'src/app/services/sous-formation-keejob.service';

@Component({
  selector: 'app-formation-keejob-details',
  templateUrl: './formation-keejob-details.component.html',
  styleUrls: ['./formation-keejob-details.component.css']
})
export class FormationKeejobDetailsComponent implements OnInit {
  @ViewChild('partnersCarousel', { static: false }) partnersCarousel!: ElementRef;
  @ViewChild('carouselSousContainer', { static: false }) 
  carouselSousContainer!: ElementRef;
  formation: FormationKeejob | undefined;
  sousFormations: SousFormationKeejob[]
  visibleSousFormations: SousFormationKeejob[] = [];
  allPartners: any[] = [];
  visiblePartners: any[] = [];
currentIndexSous = 0;  // index de la première sous-formation affichée
  currentIndexPartners = 0;

  constructor(private formationService : FormationKeejobService, private route: ActivatedRoute, private sousFormationService: SousFormationKeejobService) { }

  ngOnInit(): void {
    const formationId = this.route.snapshot.params['id'];
    this.getFormationDetails(formationId);
  }

  getFormationDetails(formationId: string): void {
    this.formationService.getFormationKeejobById(formationId).subscribe((data: any) => {
      this.formation = new FormationKeejob(
        data.id,
        data.title,
        data.description,
        data.image,
        data.partenaires,
        data.sousFormations
      );

      // --- PARTENAIRES ---
      this.allPartners = data.partenaires || [];
      this.currentIndexPartners = 0;
      this.updateVisiblePartners();

      // --- SOUS-FORMATIONS ---
      this.sousFormationService.getSousFormationKeejobByFormationKeejob(Number(formationId))
        .subscribe((sousFormations: any[]) => {
          this.sousFormations = sousFormations || [];
          this.currentIndexSous = 0;
          this.updateVisibleSousFormations();
        });

      console.log("Formation :", this.formation);
    });
  }

  // ----- SOUS-FORMATIONS -----
  updateVisibleSousFormations() {
    const total = this.sousFormations.length;
    this.visibleSousFormations = [];
    for (let i = 0; i < 3; i++) {
      const index = (this.currentIndexSous + i) % total;
      if (total > 0) this.visibleSousFormations.push(this.sousFormations[index]);
    }
  }

  updateVisiblePartners() {
    const total = this.allPartners.length;
    this.visiblePartners = [];
    for (let i = 0; i < 4; i++) { // 4 visibles
      const index = (this.currentIndexPartners + i) % total;
      if (total > 0) this.visiblePartners.push(this.allPartners[index]);
    }
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

getCardClass(index: number): string {
  const classes = ['card-ref', 'card-pub', 'card-social', 'card-content'];
  return classes[index % 4]; // répète les 4 classes pour chaque ligne
}


  scrollRightSous() {
    this.currentIndexSous = (this.currentIndexSous + 1) % this.sousFormations.length;
    this.updateVisibleSousFormations();
  }

  scrollLeftSous() {
    this.currentIndexSous =
      (this.currentIndexSous - 1 + this.sousFormations.length) % this.sousFormations.length;
    this.updateVisibleSousFormations();
  }


  scrollRightPartners() {
    this.currentIndexPartners = (this.currentIndexPartners + 1) % this.allPartners.length;
    this.updateVisiblePartners();
  }

  scrollLeftPartners() {
    this.currentIndexPartners =
      (this.currentIndexPartners - 1 + this.allPartners.length) % this.allPartners.length;
    this.updateVisiblePartners();
  }


}
