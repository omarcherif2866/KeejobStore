import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Coaching } from 'src/app/models/coaching';
import { CoachingService } from 'src/app/services/coaching.service';

@Component({
  selector: 'app-coaching-emploi',
  templateUrl: './coaching-emploi.component.html',
  styleUrls: ['./coaching-emploi.component.css']
})
export class CoachingEmploiComponent implements OnInit {

  coachings: Coaching[] = [];
  visiblecoachings: Coaching[] = [];
  loading = false;

  currentIndex = 0; // index de départ
    constructor(private coachingService: CoachingService,private router:Router) {}
  
    ngOnInit(): void {
      this.fetchFormation()
    }

  fetchFormation() {
    this.loading = true;

    this.coachingService.getCoaching().subscribe(
      (response: any[]) => {
        this.coachings = response.map(f => new Coaching({
          id: f.id,
          name: f.name,
          titre: f.title,
          sousTitre: f.sousTitre,
          description: f.description,
          image: f.image,
          sections: f.sections,
          priceSections: f.priceSections,
          cvPartenaires: f.cvPartenaires
        }));


        this.updateVisiblecoachings();
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

    
updateVisiblecoachings() {
    this.visiblecoachings = [];

    for (let i = 0; i < 3; i++) {
      const index = (this.currentIndex + i) % this.coachings.length;
      this.visiblecoachings.push(this.coachings[index]);
    }
  }

  scrollRight() {
    this.currentIndex = (this.currentIndex + 1) % this.coachings.length;
    this.updateVisiblecoachings();
  }

  scrollLeft() {
    this.currentIndex =
      (this.currentIndex - 1 + this.coachings.length) %
      this.coachings.length;

    this.updateVisiblecoachings();
  }

}
