import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // ← IMPORT IMPORTANT
import { Role, User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User = new User("", '', '', false, '', Role.SIMPLEU);

    
    constructor(private authService:AuthService, private router:Router ){

    }
    

  ngOnInit(): void {
  }


login() {
    const loginData = { username: this.user.Username, password: this.user.Password };
  this.authService.login(loginData).subscribe(
    (response: any) => {
      console.log('Response received:', response);

      if (response && response.role && response.accessToken) {
        // Store user role and access token in localStorage
        localStorage.setItem("userRole", response.role);
        localStorage.setItem("accessToken", response.accessToken);

        // Store user ID from token in localStorage
        this.authService.storeUserIdFromToken();

        // Redirect based on user role (assuming role is determined from response)
        const role = response.role;
        if (role === 'Admin') {
          // this.router.navigate(['profil/', this.authService.getUserId()]); // Redirect to admin profile with user ID
        } else if (role === 'SIMPLEU') {
          this.router.navigate(['/actualites']); // Redirect to normal user profile with user ID
        }

        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Connected',
          showConfirmButton: false,
          timer: 1500 // Auto hide after 1.5 seconds
        });

        console.log("Connected");
      } else {
        // Handle errors if role or necessary data is missing in the response
        console.error("Role or essential data missing in login response", response);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred during login'
        });
      }
    },
    error => {
      // Handle HTTP errors
      if (error.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Incorrect username or password'
        });
      } else if (error.status === 403) {
        // Handle account blocked scenario
        Swal.fire({
          icon: 'warning',
          title: 'Votre Compte est bloqué',
          text: 'Votre compte a été bloqué. Veuillez contacter l’assistance.'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred during login'
        });
      }
      console.error("Login error", error);
    }
  );
}

}
