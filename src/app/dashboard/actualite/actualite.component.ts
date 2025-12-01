import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actualite } from 'src/app/models/actualite';
import { Role, User } from 'src/app/models/user';
import { ActualiteService } from 'src/app/services/actualite.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualite',
  templateUrl: './actualite.component.html',
  styleUrls: ['./actualite.component.css']
})
export class ActualiteComponent implements OnInit {
  sidebarOpen = true;
  actualites: Actualite[] = [];
  loading = false;
  currentPage = 1;
  itemsPerPage = 5;
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';
  selectedImage: File | null = null;
  formData = {
    id: null,
    title: '',
    description: '',
    date: '',
    heure: ''
  };
  
  editId: any = null;

  constructor(private actualiteService: ActualiteService, private authService: AuthService,private router:Router) {}

  ngOnInit() {
    this.fetchActualites();
  }

  // Récupérer les actualités depuis le backend
  fetchActualites() {
    this.loading = true;
    this.actualiteService.getActualite().subscribe(
      (response: any[]) => {
        // Transformer chaque JSON en instance de Formateur
        this.actualites = response.map(f => new Actualite(
          f.id,
          f.title,
          f.description,
          f.date,
          f.heure,
          f.image,
        ));
        this.actualites = this.actualites; // si pagination ou filtrage
        this.loading = false;
        console.log('Données reçues: ', this.actualites);
      },
      (error) => {
        console.error('Erreur lors du chargement des actualites:', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors du chargement des données',
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
  }

  // Pagination
  get currentItems(): Actualite[] {
    const indexOfLastItem = this.currentPage * this.itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - this.itemsPerPage;
    return this.actualites.slice(indexOfFirstItem, indexOfLastItem);
  }

  get totalPages(): number {
    return Math.ceil(this.actualites.length / this.itemsPerPage);
  }

  get pagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  handlePageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  // Ajouter une actualité
  handleAdd() {
    this.modalMode = 'add';
    this.formData = {
      id: null,
      title: '',
      description: '',
      date: '',
      heure: ''
    };
    this.showModal = true;
  }

  // Éditer une actualité
  handleEdit(actualite: Actualite) {
    this.modalMode = 'edit';
    this.formData = {
      id: actualite.Id,
      title: actualite.Title,
      description: actualite.Description,
      date: actualite.Date,
      heure: actualite.Heure
    };
    this.editId = actualite.Id;
    this.showModal = true;
  }

  // Supprimer une actualité
  handleDelete(id: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
      this.actualiteService.deleteActualite(id).subscribe(
        () => {
          this.actualites = this.actualites.filter(item => item.Id !== id);
          Swal.fire({
            title: 'Success!',
            text: 'Actualité supprimée avec succès',
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 1500,
          }).then(() => {
            window.location.reload();
          });         
        },
        (error) => {
          Swal.fire({
          icon: 'error',
          title: 'Erreur lors de la suppression',
          showConfirmButton: false,
          timer: 1500
        });          
        }
      );
    }
  }

  // Soumettre le formulaire
handleSubmit() {
  // Vérification des champs obligatoires
  if (
    !this.formData.title || !this.formData.description || !this.formData.date ||
    !this.formData.heure ) {
    alert('Veuillez remplir tous les champs obligatoires');
    return;
  }

  // Créer FormData pour envoyer les données + l'image
  const formData = new FormData();
  formData.append('title', this.formData.title);
  formData.append('description', this.formData.description);
  formData.append('date', this.formData.date);
  formData.append('heure', this.formData.heure);
  
  // Ajouter l'image si elle existe
  if (this.selectedImage) {
    formData.append('image', this.selectedImage, this.selectedImage.name);
  }

  if (this.modalMode === 'add') {
    this.actualiteService.addActualite(formData).subscribe(
      (response) => {
        const newActualite = new Actualite(
            response.Id,
            response.Title,
            response.Description,
            response.Date,
            response.Heure,
            response.Image // Ajouter l'image
        );

        this.actualites.push(newActualite);
        this.showModal = false;
        this.selectedImage = null; // Réinitialiser

        Swal.fire({
          title: 'Success!',
          text: 'Actualite ajouté avec succès',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          window.location.reload();
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors de l\'ajout',
          text: error,
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
  } else {
    this.actualiteService.putActualite(this.editId, formData).subscribe(
      (response) => {
        const index = this.actualites.findIndex(item => item.Id === this.editId);
        if (index !== -1) {
          this.actualites[index] = new Actualite(
            response.Id,
            response.Title,
            response.Description,
            response.Date,
            response.Heure,
            response.Image // Ajouter l'image
          );
        }
        this.showModal = false;
        this.selectedImage = null; // Réinitialiser

        Swal.fire({
          title: 'Success!',
          text: 'Actualite modifié avec succès',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          window.location.reload();
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors de la modification',
          text: error,
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
  }
}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
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


onImageSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez sélectionner une image valide',
        timer: 1500,
        showConfirmButton: false
      });
      return;
    }
    
    // Vérifier la taille (par exemple, max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'L\'image ne doit pas dépasser 5MB',
        timer: 1500,
        showConfirmButton: false
      });
      return;
    }
    
    this.selectedImage = file;
  }
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