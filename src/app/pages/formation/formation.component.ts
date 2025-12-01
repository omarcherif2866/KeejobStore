import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormationKeejob } from 'src/app/models/formation-keejob';
import { FormationKeejobService } from 'src/app/services/formation-keejob.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formation',
  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.css']
})
export class FormationComponent implements OnInit {
  formations: FormationKeejob[] = [];
  visibleFormations: FormationKeejob[] = [];
  loading = false;

  currentIndex = 0; // index de départ
    constructor(private formationService: FormationKeejobService,private router:Router) {}
  
    ngOnInit(): void {
      this.fetchFormation()
    }

  fetchFormation() {
    this.loading = true;

    this.formationService.getFormationKeejob().subscribe(
      (response: any[]) => {
        this.formations = response.map(f => new FormationKeejob(
          f.id,
          f.title,
          f.description,
          f.image
        ));

        this.updateVisibleFormations();
        this.loading = false;
      },
      (error) => {
        console.error('Erreur :', error);
        this.loading = false;
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

    
updateVisibleFormations() {
    this.visibleFormations = [];

    for (let i = 0; i < 3; i++) {
      const index = (this.currentIndex + i) % this.formations.length;
      this.visibleFormations.push(this.formations[index]);
    }
  }

  scrollRight() {
    this.currentIndex = (this.currentIndex + 1) % this.formations.length;
    this.updateVisibleFormations();
  }

  scrollLeft() {
    this.currentIndex =
      (this.currentIndex - 1 + this.formations.length) %
      this.formations.length;

    this.updateVisibleFormations();
  }

}
