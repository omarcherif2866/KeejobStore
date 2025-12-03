import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cv } from 'src/app/models/cv';
import { CvService } from 'src/app/services/cv.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cv-lettre',
  templateUrl: './cv-lettre.component.html',
  styleUrls: ['./cv-lettre.component.css']
})
export class CvLettreComponent implements OnInit {
  cvs: Cv[] = [];
  loading = false;
  constructor(private cvservice: CvService,private router:Router) {}
  currentIndex = 0; // index de départ
  visiblecvs: Cv[] = [];

  ngOnInit(): void {
    this.fetchcvs()
  }


fetchcvs() {
  this.loading = true;
  this.cvservice.getCv().subscribe({
    next: (response: any[]) => {
      this.cvs = response.map(data => new Cv(data));
      this.loading = false;

      console.log('Données reçues: ', this.cvs);

      // 👉 AJOUT ICI
      if (this.cvs.length > 0) {
        this.currentIndex = 0;
        this.updateVisiblecvs();
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
updateVisiblecvs() {
    this.visiblecvs = [];

    for (let i = 0; i < 3; i++) {
      const index = (this.currentIndex + i) % this.cvs.length;
      this.visiblecvs.push(this.cvs[index]);
    }
  }

  scrollRight() {
    this.currentIndex = (this.currentIndex + 1) % this.cvs.length;
    this.updateVisiblecvs();
  }

  scrollLeft() {
    this.currentIndex =
      (this.currentIndex - 1 + this.cvs.length) %
      this.cvs.length;

    this.updateVisiblecvs();
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
