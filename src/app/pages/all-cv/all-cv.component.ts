import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cv } from 'src/app/models/cv';
import { CvService } from 'src/app/services/cv.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-cv',
  templateUrl: './all-cv.component.html',
  styleUrls: ['./all-cv.component.css']
})
export class AllcvComponent implements OnInit {
  cvs: Cv[] = [];
  loading = false;
  constructor(private cvService: CvService,private router:Router) {}


  ngOnInit(): void {
    this.fetchcvs()
  }


fetchcvs() {
  this.loading = true;
  this.cvService.getCv().subscribe({
    next: (response: any[]) => {
      this.cvs = response.map(data => new Cv(data));
      this.loading = false;

      console.log('Données reçues: ', this.cvs);

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


}
