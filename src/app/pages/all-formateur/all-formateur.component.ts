import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Formateur } from 'src/app/models/formateur';
import { FormateurService } from 'src/app/services/formateur.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-formateur',
  templateUrl: './all-formateur.component.html',
  styleUrls: [    './all-formateur.component.css',
    '../home-page/home-page.component.css' ]
})
export class AllFormateurComponent implements OnInit {
    formateurs: Formateur[] = [];
    loading = false;
searchActive = false;

  constructor( private formateurservice: FormateurService, private router:Router) {
  }


    ngOnInit() {
    this.fetchFormateurs();
  }
  fetchFormateurs() {
    this.loading = true;
    this.formateurservice.getFormateur().subscribe(
      (response: any[]) => {
        // Transformer chaque JSON en instance de Formateur
        this.formateurs = response.map(f => new Formateur(
          f.id,
          f.phone,
          f.description,
          f.address,
          f.email,
          f.experience,
          f.poste,
          f.firstName,
          f.lastName,
          f.university,
          f.image,
          f.servicesFormateurs || [],
          f.titleWhyList || []
        ));
        this.formateurs = this.formateurs; // si pagination ou filtrage
        this.loading = false;
        console.log('Données reçues: ', this.formateurs);
      },
      (error) => {
        console.error('Erreur lors du chargement des formateurs:', error);
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
