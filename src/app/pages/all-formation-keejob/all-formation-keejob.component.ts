import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormationKeejob } from 'src/app/models/formation-keejob';
import { FormationKeejobService } from 'src/app/services/formation-keejob.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-formation-keejob',
  templateUrl: './all-formation-keejob.component.html',
  styleUrls: ['./all-formation-keejob.component.css']
})
export class AllFormationKeejobComponent implements OnInit {
  formations: FormationKeejob[] = [];
  loading = false;
  constructor(private formationService: FormationKeejobService,private router:Router) {}


  ngOnInit(): void {
    this.fetchevaluations()
  }


  fetchevaluations() {
    this.loading = true;
    this.formationService.getFormationKeejob().subscribe(
      (response: any[]) => {
        // Transformer chaque JSON en instance de Evaluation
        this.formations = response.map(f => new FormationKeejob(
          f.id,
          f.description,
          f.title,
          f.image,
          f.logo,

        ));
        this.formations = this.formations; // si pagination ou filtrage
        this.loading = false;
        console.log('Données reçuess: ', this.formations);
      },
      (error) => {
        console.error('Erreur lors du chargement des formations:', error);
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
