import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Coaching } from 'src/app/models/coaching';
import { CoachingService } from 'src/app/services/coaching.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-coaching',
  templateUrl: './all-coaching.component.html',
  styleUrls: ['./all-coaching.component.css']
})
export class AllCoachingComponent implements OnInit {
  coachings: Coaching[] = [];
  loading = false;
  constructor(private coachingService: CoachingService,private router:Router) {}


  ngOnInit(): void {
    this.fetchcoachings()
  }


fetchcoachings() {
  this.loading = true;
  this.coachingService.getCoaching().subscribe({
    next: (response: any[]) => {
      this.coachings = response.map(data => new Coaching(data));
      this.loading = false;

      console.log('Données reçues: ', this.coachings);

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
