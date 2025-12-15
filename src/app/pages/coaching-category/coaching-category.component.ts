import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Coaching, CoachingCategory } from 'src/app/models/coaching';
import { CoachingService } from 'src/app/services/coaching.service';

@Component({
  selector: 'app-coaching-category',
  templateUrl: './coaching-category.component.html',
  styleUrls: ['./coaching-category.component.css']
})
export class CoachingCategoryComponent implements OnInit {


  category!: CoachingCategory;
  coachings: Coaching[] = [];
  loading = true;

  availableCategories = Object.values(CoachingCategory);

  constructor(
    private route: ActivatedRoute,
    private coachingService: CoachingService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const cat = params.get('category');
      if (cat) {
        this.category = cat as CoachingCategory;
        this.loadEvaluations();
      }
    });
  }

  loadEvaluations(): void {
    this.loading = true;

    this.coachingService.getByCategory(this.category).subscribe({
      next: (data) => {
        this.coachings = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.loading = false;
      }
    });
  }

  onCategoryChange(event: any) {
    this.category = event.target.value;
    this.loadEvaluations();
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