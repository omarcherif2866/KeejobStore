import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Formateur } from 'src/app/models/formateur';
import { AuthService } from 'src/app/services/auth.service';
import { FormateurService } from 'src/app/services/formateur.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formateur',
  templateUrl: './formateur.component.html',
  styleUrls: ['./formateur.component.css']
})
export class FormateurComponent implements OnInit {
  sidebarOpen = true;
  formateurs: Formateur[] = [];
  loading = false;
  currentPage = 1;
  itemsPerPage = 5;
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';

  formData = {
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    experience: '',
    poste: '',
    university: '',
    image:''
  };
  
  editId: any = null;
  selectedImage: File | null = null;

  constructor(private formateurservice: FormateurService, private authService: AuthService,private router:Router) {}

  ngOnInit() {
    this.fetchFormateurs();
  }

  // Récupérer les actualités depuis le backend
  fetchFormateurs() {
    this.loading = true;
    this.formateurservice.getFormateur().subscribe(
      (response: any[]) => {
        // Transformer chaque JSON en instance de Formateur
        this.formateurs = response.map(f => new Formateur(
          f.id,
          f.phone,
          f.description,
          f.address,
          f.email,
          f.experience,
          f.poste,
          f.firstName,
          f.lastName,
          f.university,
          f.image,
          f.servicesFormateurs || [],
          f.titleWhyList || []
        ));
        this.formateurs = this.formateurs; // si pagination ou filtrage
        this.loading = false;
        console.log('Données reçues: ', this.formateurs);
      },
      (error) => {
        console.error('Erreur lors du chargement des formateurs:', error);
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
  get currentItems(): Formateur[] {
    const indexOfLastItem = this.currentPage * this.itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - this.itemsPerPage;
    return this.formateurs.slice(indexOfFirstItem, indexOfLastItem);
  }

  get totalPages(): number {
    return Math.ceil(this.formateurs.length / this.itemsPerPage);
  }

  get pagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  handlePageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }

// Ajouter un formateur
handleAdd() {
  this.modalMode = 'add';
  this.formData = {
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    experience: '',
    poste: '',
    university: '',
    image: ''

  };
  this.showModal = true;
}

// Éditer un formateur
handleEdit(formateur: Formateur) {
  this.modalMode = 'edit';
  this.formData = {
    id: formateur.Id,
    firstName: formateur.FirstName,
    lastName: formateur.LastName,
    email: formateur.Email,
    phone: formateur.Phone,
    address: formateur.Address,
    description: formateur.Description,
    experience: formateur.Experience,
    poste: formateur.Poste,
    university: formateur.University,
    image: formateur.Image
  };
  this.editId = formateur.Id;
  this.showModal = true;
}


  // Supprimer une actualité
  handleDelete(id: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
      this.formateurservice.deleteFormateur(id).subscribe(
        () => {
          this.formateurs = this.formateurs.filter(item => item.Id !== id);
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
    !this.formData.firstName || !this.formData.lastName || !this.formData.email ||
    !this.formData.phone || !this.formData.address || !this.formData.description || 
    !this.formData.university || !this.formData.experience || !this.formData.poste 
  ) {
    alert('Veuillez remplir tous les champs obligatoires');
    return;
  }

  // Créer FormData pour envoyer les données + l'image
  const formData = new FormData();
  formData.append('firstName', this.formData.firstName);
  formData.append('lastName', this.formData.lastName);
  formData.append('email', this.formData.email);
  formData.append('phone', this.formData.phone);
  formData.append('address', this.formData.address);
  formData.append('university', this.formData.university);
  formData.append('experience', this.formData.experience);
  formData.append('description', this.formData.description);
  formData.append('poste', this.formData.poste);
  
  // Ajouter l'image si elle existe
  if (this.selectedImage) {
    formData.append('image', this.selectedImage, this.selectedImage.name);
  }

  if (this.modalMode === 'add') {
    this.formateurservice.addFormateur(formData).subscribe(
      (response) => {
        const newFormateur = new Formateur(
            response.Id,
            response.Phone,
            response.Description,
            response.Address,
            response.Email,
            response.Experience,
            response.Poste,
            response.FirstName,
            response.LastName,
            response.University,
            response.Image // Ajouter l'image
        );

        this.formateurs.push(newFormateur);
        this.showModal = false;
        this.selectedImage = null; // Réinitialiser

        Swal.fire({
          title: 'Success!',
          text: 'Formateur ajouté avec succès',
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
    this.formateurservice.putFormateur(this.editId, formData).subscribe(
      (response) => {
        const index = this.formateurs.findIndex(item => item.Id === this.editId);
        if (index !== -1) {
          this.formateurs[index] = new Formateur(
            response.Id,
            response.Phone,
            response.Description,
            response.Address,
            response.Email,
            response.Experience,
            response.Poste,
            response.FirstName,
            response.LastName,
            response.University,
            response.Image // Ajouter l'image
          );
        }
        this.showModal = false;
        this.selectedImage = null; // Réinitialiser

        Swal.fire({
          title: 'Success!',
          text: 'Formateur modifié avec succès',
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

getServicesTitles(formateur: any): string {
  if (!formateur.servicesFormateurs) return '';
  return formateur.servicesFormateurs.map(s => s.title).join(', ');
}

getTitleWhy(formateur: any): string {
  if (!formateur.titleWhy) return '';
  return formateur.titleWhy.map(s => s.title).join(', ');
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