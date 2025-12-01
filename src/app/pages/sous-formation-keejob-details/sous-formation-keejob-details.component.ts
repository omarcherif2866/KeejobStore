import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormationKeejob } from 'src/app/models/formation-keejob';
import { Logiciel } from 'src/app/models/logiciel';
import { SousFormationKeejob } from 'src/app/models/sous-formation-keejob';
import { FormationKeejobService } from 'src/app/services/formation-keejob.service';
import { LogicielService } from 'src/app/services/logiciel.service';
import { SousFormationKeejobService } from 'src/app/services/sous-formation-keejob.service';

@Component({
  selector: 'app-sous-formation-keejob-details',
  templateUrl: './sous-formation-keejob-details.component.html',
  styleUrls: ['./sous-formation-keejob-details.component.css']
})
export class SousFormationKeejobDetailsComponent implements OnInit {
  @ViewChild('partnersCarousel', { static: false }) partnersCarousel!: ElementRef;
  @ViewChild('carouselSousContainer', { static: false }) 
  carouselSousContainer!: ElementRef;
  sousFormation: SousFormationKeejob | undefined;
  logiciel: Logiciel[]
  visibleLogiciels: Logiciel[] = [];
  allPartners: any[] = [];
  visiblePartners: any[] = [];
  currentIndexSous = 0;  // index de la première sous-formation affichée
  currentIndexPartners = 0;

  constructor(private logicielService : LogicielService, private route: ActivatedRoute, private sousFormationService: SousFormationKeejobService) { }

  ngOnInit(): void {
    const sousFormationId = this.route.snapshot.params['id'];
    this.getSousFormationDetails(sousFormationId);
  }

  getSousFormationDetails(sousFormationId: string): void {
    this.sousFormationService.getSousFormationKeejobById(sousFormationId).subscribe((data: any) => {
      this.sousFormation = new SousFormationKeejob(
        data.id,
        data.title,
        data.description,
        data.image,
        data.titleLogiciel,
        data.sousFormationPartenaires,
        data.sousFormationLogiciel,
        data.formationKeejob,
        data.details
      );

      // --- PARTENAIRES ---
      this.allPartners = data.sousFormationPartenaires || [];
      this.currentIndexPartners = 0;
      this.updateVisiblePartners();

      // --- SOUS-FORMATIONS ---
      this.logicielService.getLogicielBySousFormationKeejob(Number(sousFormationId))
        .subscribe((logiciel: any[]) => {
          this.logiciel = logiciel || [];
          this.currentIndexSous = 0;
          console.log("logiciel: ", logiciel)
          this.updatevisibleLogiciels();
        });

      console.log("sousFormation :", this.sousFormation);
    });
  }

  // ----- SOUS-FORMATIONS -----
  updatevisibleLogiciels() {
    const total = this.logiciel.length;
    this.visibleLogiciels = [];
    for (let i = 0; i < 3; i++) {
      const index = (this.currentIndexSous + i) % total;
      if (total > 0) this.visibleLogiciels.push(this.logiciel[index]);
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
    this.currentIndexSous = (this.currentIndexSous + 1) % this.logiciel.length;
    this.updatevisibleLogiciels();
  }

  scrollLeftSous() {
    this.currentIndexSous =
      (this.currentIndexSous - 1 + this.logiciel.length) % this.logiciel.length;
    this.updatevisibleLogiciels();
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
