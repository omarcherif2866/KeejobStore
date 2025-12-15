import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormationCategory, FormationKeejob } from 'src/app/models/formation-keejob';
import { FormationKeejobService } from 'src/app/services/formation-keejob.service';

@Component({
  selector: 'app-formation-keejob-category',
  templateUrl: './formation-keejob-category.component.html',
  styleUrls: ['./formation-keejob-category.component.css']
})
export class FormationKeejobCategoryComponent implements OnInit {


  category!: FormationCategory;
  formations: FormationKeejob[] = [];
  loading = true;

  availableCategories = Object.values(FormationCategory);

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationKeejobService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const cat = params.get('category');
      if (cat) {
        this.category = cat as FormationCategory;
        this.loadEvaluations();
      }
    });
  }

  loadEvaluations(): void {
    this.loading = true;

    this.formationService.getByCategory(this.category).subscribe({
      next: (data) => {
        this.formations = data;
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