import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Formateur } from 'src/app/models/formateur';
import { FormateurService } from 'src/app/services/formateur.service';
import { FormationFormateurService } from 'src/app/services/formation-formateur.service';

@Component({
  selector: 'app-formateur-details',
  templateUrl: './formateur-details.component.html',
  styleUrls: ['./formateur-details.component.css']
})
export class FormateurDetailsComponent implements OnInit {
  formateur: Formateur | undefined;
  formations: FormationFormateurService[]
  constructor(private formateurService : FormateurService, private route: ActivatedRoute, private formationFormateurService: FormationFormateurService) { }

  ngOnInit(): void {
    const formateurId = this.route.snapshot.params['id'];
    this.getFormateurDetails(formateurId);
  }


getFormateurDetails(formateurId: string): void {

  // 1 — Récupérer le formateur
  this.formateurService.getFormateurById(formateurId).subscribe((data: any) => {

    this.formateur = new Formateur(
      data.id,
      data.phone,
      data.description,
      data.address,
      data.email,
      data.experience,
      data.poste,
      data.firstName,
      data.lastName,
      data.university,
      data.image,
      data.servicesFormateurs,
      data.titleWhyList
    );

    console.log("Détails du formateur converti :", this.formateur);

    // 2 — Récupérer ses formations
    this.formationFormateurService.getByFormateur(Number(formateurId)).subscribe((formations: any[]) => {
      this.formations = formations;
      console.log("Formations du formateur :", this.formations);
    });
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

getCardClass(index: number): string {
  const classes = ['card-ref', 'card-pub', 'card-social', 'card-content'];
  return classes[index % 4]; // répète les 4 classes pour chaque ligne
}


}
