import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cv } from 'src/app/models/cv';
import { CvService } from 'src/app/services/cv.service';
import { PartenaireService } from 'src/app/services/partenaire.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cv-details',
  templateUrl: './cv-details.component.html',
  styleUrls: ['./cv-details.component.css']
})
export class CvDetailsComponent implements OnInit {
  cvId!: number;
  loading = false;
  cvs: Cv[] = [];

  constructor(
    private cvService: CvService, private partenaireService: PartenaireService,  private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.cvId = Number(this.route.snapshot.paramMap.get('id'));
    
    // Charger l'évaluation spécifique
    this.fetchCvById(this.cvId);   
  }


    fetchCvById(id: number) {
      this.loading = true;
      this.cvService.getCvById(id).subscribe({
        next: (response: any) => {
          // Mettre UNE SEULE évaluation dans le tableau
          this.cvs = [new Cv(response)];
          this.loading = false;
          console.log('cvs chargée:', this.cvs[0]);
          
        },
        error: (error) => {
          console.error('Erreur lors du chargement de cv:', error);
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

}
