import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Partenaire } from 'src/app/models/partenaire';
import { AuthService } from 'src/app/services/auth.service';
import { PartenaireService } from 'src/app/services/partenaire.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-partenaire',
  templateUrl: './partenaire.component.html',
  styleUrls: ['./partenaire.component.css']
})
export class PartenaireComponent implements OnInit {
 sidebarOpen = true;
  partenaires: Partenaire[] = [];
  loading = false;
  currentPage = 1;
  itemsPerPage = 5;
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';

  formData = {
    id: null,
    name: '',
    description: '',
    image:''
  };
  
  editId: any = null;
  selectedImage: File | null = null;

  constructor(private partenaireservice: PartenaireService, private authService: AuthService,private router:Router) {}

  ngOnInit() {
    this.fetchPartenaires();
  }

  // Récupérer les actualités depuis le backend
  fetchPartenaires() {
    this.loading = true;
    this.partenaireservice.getPartenaire().subscribe(
      (response: any[]) => {
        // Transformer chaque JSON en instance de Partenaire
        this.partenaires = response.map(f => new Partenaire(
          f.id,
          f.name,
          f.description,
          f.image,
        ));
        this.partenaires = this.partenaires; // si pagination ou filtrage
        this.loading = false;
        console.log('Données reçues: ', this.partenaires);
      },
      (error) => {
        console.error('Erreur lors du chargement des partenaires:', error);
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
  get currentItems(): Partenaire[] {
    const indexOfLastItem = this.currentPage * this.itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - this.itemsPerPage;
    return this.partenaires.slice(indexOfFirstItem, indexOfLastItem);
  }

  get totalPages(): number {
    return Math.ceil(this.partenaires.length / this.itemsPerPage);
  }

  get pagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  handlePageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }

// Ajouter un Partenaire
handleAdd() {
  this.modalMode = 'add';
  this.formData = {
    id: null,
    name: '',
    description: '',
    image: ''

  };
  this.showModal = true;
}

// Éditer un Partenaire
handleEdit(Partenaire: Partenaire) {
  this.modalMode = 'edit';
  this.formData = {
    id: Partenaire.Id,
    name: Partenaire.Name,
    description: Partenaire.Description,
    image: Partenaire.Image
  };
  this.editId = Partenaire.Id;
  this.showModal = true;
}


  // Supprimer une actualité
  handleDelete(id: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
      this.partenaireservice.deletePartenaire(id).subscribe(
        () => {
          this.partenaires = this.partenaires.filter(item => item.Id !== id);
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
    !this.formData.description || !this.formData.name   ) {
    alert('Veuillez remplir tous les champs obligatoires');
    return;
  }

  // Créer FormData pour envoyer les données + l'image
  const formData = new FormData();
  formData.append('name', this.formData.name);
  formData.append('description', this.formData.description);
  
  // Ajouter l'image si elle existe
  if (this.selectedImage) {
    formData.append('image', this.selectedImage, this.selectedImage.name);
  }

  if (this.modalMode === 'add') {
    this.partenaireservice.addPartenaire(formData).subscribe(
      (response) => {
        const newPartenaire = new Partenaire(
            response.Id,
            response.Name,
            response.Description,
            response.Image // Ajouter l'image
        );

        this.partenaires.push(newPartenaire);
        this.showModal = false;
        this.selectedImage = null; // Réinitialiser

        Swal.fire({
          title: 'Success!',
          text: 'Partenaire ajouté avec succès',
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
    this.partenaireservice.putPartenaire(this.editId, formData).subscribe(
      (response) => {
        const index = this.partenaires.findIndex(item => item.Id === this.editId);
        if (index !== -1) {
          this.partenaires[index] = new Partenaire(
            response.Id,
            response.Name,
            response.Description,
            response.Image // Ajouter l'image
          );
        }
        this.showModal = false;
        this.selectedImage = null; // Réinitialiser

        Swal.fire({
          title: 'Success!',
          text: 'Partenaire modifié avec succès',
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