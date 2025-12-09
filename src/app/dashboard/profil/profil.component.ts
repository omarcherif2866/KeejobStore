import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
user: any = {};  
userId!: number;
sidebarOpen = true;

passwordData = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
};


  constructor(private userService: AuthService, private router:Router ) { }

ngOnInit() {
  this.userId = Number(localStorage.getItem('userId')); // ⭐ récup ID
  this.loadUser();                                      // ⭐ charger données
}

loadUser() {
  this.userService.getUserById(this.userId).subscribe({
    next: (data) => {
      this.user = data;                // ⭐ charge l'utilisateur dans le form
      console.log("Utilisateur chargé :", this.user);
    },
    error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur chargement user',
          showConfirmButton: false,
          timer: 1500
        }); 
    }
  });
}


update() {
  this.userService.updateUser(this.userId, this.user).subscribe({
    next: (updatedUser) => {
      console.log("Profil mis à jour :", updatedUser);
          Swal.fire({
            title: 'Success!',
            text: 'Votre profil à été modifié avec succès !',
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 1500,
          })
    },
    error: () => {
      console.error("Erreur lors de la mise à jour");
          Swal.fire({
          icon: 'error',
          title: 'Erreur lors de la modification',
          showConfirmButton: false,
          timer: 1500
        }); 
    }
  });
}


    logout(): void {
        this.userService.logout();
    
        Swal.fire({
          icon: 'error',
          title: 'Vous êtes deconnecté',
          showConfirmButton: false,
          timer: 1500
        }); 
        

        this.router.navigate(['/']);
      }

updatePassword() {
  if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Les mots de passe ne correspondent pas !'
    });
    return;
  }

  const id = Number(localStorage.getItem("userId"));

  const body = {
    oldPassword: this.passwordData.oldPassword,
    newPassword: this.passwordData.newPassword
  };

  this.userService.changePassword(id, body).subscribe(
    (response: any) => {
      Swal.fire({
        title: 'Success!',
        text: response.message, // "Mot de passe mis à jour !"
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 1500,
      });
    },
    (error) => {
      console.error("Erreur API :", error);
      // afficher le message renvoyé par le backend
      const message = error.error?.message || "Erreur lors de la mise à jour du mot de passe";
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: message
      });
    }
  );
}




}
