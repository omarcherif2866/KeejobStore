import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actualite } from 'src/app/models/actualite';
import { ActualiteService } from 'src/app/services/actualite.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-international',
  templateUrl: './international.component.html',
  styleUrls: ['./international.component.css']
})
export class InternationalComponent implements OnInit {

  actualites: Actualite[] = [];
  loading = false;

  constructor(private actualiteService: ActualiteService,private router:Router) {}

  ngOnInit(): void {
    this.fetchActualites() 
  }


  fetchActualites() {
    this.loading = true;
    this.actualiteService.getActualite().subscribe(
      (response: any[]) => {
        // Transformer chaque JSON en instance de Formateur
        this.actualites = response.map(f => new Actualite(
          f.id,
          f.title,
          f.description,
          f.date,
          f.heure,
          f.image,
        ));
        this.actualites = this.actualites; // si pagination ou filtrage
        this.loading = false;
        console.log('Données reçues: ', this.actualites);
      },
      (error) => {
        console.error('Erreur lors du chargement des actualites:', error);
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
