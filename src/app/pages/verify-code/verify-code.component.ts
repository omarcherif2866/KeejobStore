import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.css']
})
export class VerifyCodeComponent implements OnInit {
  userId: string = '';
  code: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

    constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

ngOnInit(): void {
    // Récupérer l'userId depuis les paramètres de route
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'] || '';
      if (!this.userId) {
        this.router.navigate(['/forgot-password']);
      }
    });
  }

  onSubmit(): void {
    if (!this.code) {
      this.errorMessage = 'Veuillez entrer le code de vérification.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.verifyCode(this.userId, this.code).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = response.message;
        // Rediriger vers la page de réinitialisation
        setTimeout(() => {
          this.router.navigate(['/reset-password'], { 
            queryParams: { userId: this.userId } 
          });
        }, 1500);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Code incorrect ou expiré.';
      }
    });
  }

  resendCode(): void {
    this.router.navigate(['/forgot-password']);
  }
}
