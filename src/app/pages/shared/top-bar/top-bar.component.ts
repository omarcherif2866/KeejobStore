import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
searchActive = false;
  isLoggedIn: boolean = false;
  username: string = '';
  showDropdown: boolean = false;
    constructor(private authService: AuthService,private router:Router, private cdr: ChangeDetectorRef
    ) { }



ngOnInit(): void {
  this.authService.isLoggedIn.subscribe(status => {
    this.isLoggedIn = status;

    if (status) {
      const userData = localStorage.getItem('userAuth');
      if (userData) {
        const parsed = JSON.parse(userData);
        const token = parsed.accessToken;

        if (token) {
          const decoded: any = jwtDecode(token);
          this.username = decoded.sub || 'Utilisateur'; // 'sub' contient le username dans ton token
        }
      }
    } else {
      this.username = '';
    }

    this.cdr.detectChanges();
  });
}

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }


  toggleSearch() {
  this.searchActive = !this.searchActive;
}


    logout(): void {
        this.authService.logout();
    
        Swal.fire({
          icon: 'error',
          title: 'Vous êtes deconnecté',
          showConfirmButton: false,
          timer: 1500
        }); 
        

        this.router.navigate(['/']);
      }

}
