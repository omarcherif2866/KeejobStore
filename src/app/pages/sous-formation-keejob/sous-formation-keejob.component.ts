import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SousFormationKeejobService } from 'src/app/services/sous-formation-keejob.service';

@Component({
  selector: 'app-sous-formation-keejob',
  templateUrl: './sous-formation-keejob.component.html',
  styleUrls: ['./sous-formation-keejob.component.css']
})
export class SousFormationKeejobComponent implements OnInit {
sousFormations: any[] = [];

constructor(
  private route: ActivatedRoute,
  private sousFormationService: SousFormationKeejobService
) {}
ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    console.log("Params reçus =", params);

    const formationId = params['formationId'];

    if (!formationId) {
      console.warn("⚠ Aucun formationId reçu !");
      return;
    }

    console.log("ID formation reçu =", formationId);
    this.loadSousFormations(formationId);
  });
}



loadSousFormations(formationId: number) {
  this.sousFormationService.getSousFormationKeejobByFormationKeejob(formationId).subscribe(
    data => {
      console.log("Sous-formations récupérées :", data);
      this.sousFormations = data;
    },
    error => {
      console.error("Erreur API :", error);
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
