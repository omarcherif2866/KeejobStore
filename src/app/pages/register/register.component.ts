import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Role, User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

   
  

  constructor(private userservice: AuthService) {
    // Définir le style de fond directement dans le constructeur
    // document.body.style.backgroundImage = 'url(../../assets/images/gymblack.jpg)';
    // document.body.style.backgroundSize = 'cover';
    // document.body.style.height = '100vh';
    // document.body.style.margin = '0';
   
  }

  user: User = new User("", "", "", false, "", Role.SIMPLEU);


  ngOnInit(): void {
  }

  addUser() {
    // Supprimer la propriété Role n'est plus nécessaire
    this.userservice.addUser(this.user).subscribe(
      newUser => {
        this.user = newUser;
        Swal.fire({
          icon: 'success',
          title: 'Utilisateur ajouté avec succès',
          showConfirmButton: false,
          timer: 1500
        });
      },
      error => {
        let errorMessage = 'Erreur lors de l\'ajout de l\'utilisateur';
        if (error.error && error.error.message) {
          if (error.error.message.includes('Username')) {
            errorMessage = 'Username existe déjà!';
          } else if (error.error.message.includes('Email')) {
            errorMessage = 'Email existe déjà!';
          }
        }
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: errorMessage,
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
  }
}
