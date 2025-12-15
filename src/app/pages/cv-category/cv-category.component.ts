import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cv, CVCategory } from 'src/app/models/cv';
import { CvService } from 'src/app/services/cv.service';

@Component({
  selector: 'app-cv-category',
  templateUrl: './cv-category.component.html',
  styleUrls: ['./cv-category.component.css']
})
export class CvCategoryComponent implements OnInit {


  category!: CVCategory;
  cvs: Cv[] = [];
  loading = true;

  availableCategories = Object.values(CVCategory);

  constructor(
    private route: ActivatedRoute,
    private cvService: CvService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const cat = params.get('category');
      if (cat) {
        this.category = cat as CVCategory;
        this.loadEvaluations();
      }
    });
  }

  loadEvaluations(): void {
    this.loading = true;

    this.cvService.getByCategory(this.category).subscribe({
      next: (data) => {
        this.cvs = data;
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