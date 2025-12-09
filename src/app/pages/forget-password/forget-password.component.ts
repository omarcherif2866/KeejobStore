import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  email: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';


  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

   onSubmit(): void {
    if (!this.email) {
      this.errorMessage = 'Veuillez entrer votre email.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = response.message;
        // Rediriger vers la page de vérification avec l'userId
        setTimeout(() => {
          this.router.navigate(['/verify-code'], { 
            queryParams: { userId: response.userId } 
          });
        }, 1500);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Une erreur est survenue.';
      }
    });
  }

}
