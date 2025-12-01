import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Evaluation } from 'src/app/models/evaluation';
import { AuthService } from 'src/app/services/auth.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {
 sidebarOpen = true;
  evaluations: Evaluation[] = [];
  loading = false;
  currentPage = 1;
  itemsPerPage = 5;
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';

  formData = {
    id: null,
    name: '',
    description: '',
    title: '',
    subTitle: '',
    image:''
  };
  
  editId: any = null;
  selectedImage: File | null = null;

  constructor(private evaluationservice: EvaluationService, private authService: AuthService,private router:Router) {}

  ngOnInit() {
    this.fetchevaluations();
  }

  // Récupérer les actualités depuis le backend
  fetchevaluations() {
    this.loading = true;
    this.evaluationservice.getEvaluation().subscribe(
      (response: any[]) => {
        // Transformer chaque JSON en instance de Evaluation
        this.evaluations = response.map(f => new Evaluation(
          f.id,
          f.name,
          f.description,
          f.title,
          f.subTitle,
          f.image,
          f.evaluationDescription || [],

        ));
        this.evaluations = this.evaluations; // si pagination ou filtrage
        this.loading = false;
        console.log('Données reçues: ', this.evaluations);
      },
      (error) => {
        console.error('Erreur lors du chargement des evaluations:', error);
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
  get currentItems(): Evaluation[] {
    const indexOfLastItem = this.currentPage * this.itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - this.itemsPerPage;
    return this.evaluations.slice(indexOfFirstItem, indexOfLastItem);
  }

  get totalPages(): number {
    return Math.ceil(this.evaluations.length / this.itemsPerPage);
  }

  get pagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  handlePageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }

// Ajouter un Evaluation
handleAdd() {
  this.modalMode = 'add';
  this.formData = {
    id: null,
    name: '',
    description: '',
    title: '',
    subTitle: '',
    image: ''

  };
  this.showModal = true;
}

// Éditer un Evaluation
handleEdit(Evaluation: Evaluation) {
  this.modalMode = 'edit';
  this.formData = {
    id: Evaluation.Id,
    name: Evaluation.Name,
    description: Evaluation.Description,
    title: Evaluation.Title,
    subTitle: Evaluation.SubTitle,
    image: Evaluation.Image
  };
  this.editId = Evaluation.Id;
  this.showModal = true;
}


  // Supprimer une actualité
  handleDelete(id: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
      this.evaluationservice.deleteEvaluation(id).subscribe(
        () => {
          this.evaluations = this.evaluations.filter(item => item.Id !== id);
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
    !this.formData.name  || !this.formData.description || !this.formData.title || !this.formData.subTitle 
  ) {
    alert('Veuillez remplir tous les champs obligatoires');
    return;
  }

  // Créer FormData pour envoyer les données + l'image
  const formData = new FormData();
  formData.append('name', this.formData.name);
  formData.append('title', this.formData.title);
  formData.append('description', this.formData.description);
  formData.append('subTitle', this.formData.subTitle);
  
  // Ajouter l'image si elle existe
  if (this.selectedImage) {
    formData.append('image', this.selectedImage, this.selectedImage.name);
  }

  if (this.modalMode === 'add') {
    this.evaluationservice.addEvaluation(formData).subscribe(
      (response) => {
        const newEvaluation = new Evaluation(
            response.Id,
            response.Description,
            response.Title,
            response.SubTitle,
            response.Name,
            response.Image // Ajouter l'image
        );

        this.evaluations.push(newEvaluation);
        this.showModal = false;
        this.selectedImage = null; // Réinitialiser

        Swal.fire({
          title: 'Success!',
          text: 'Evaluation ajouté avec succès',
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
    this.evaluationservice.putEvaluation(this.editId, formData).subscribe(
      (response) => {
        const index = this.evaluations.findIndex(item => item.Id === this.editId);
        if (index !== -1) {
          this.evaluations[index] = new Evaluation(
            response.Id,
            response.Description,
            response.Title,
            response.SubTitle,
            response.Name,
            response.Image // Ajouter l'image
          );
        }
        this.showModal = false;
        this.selectedImage = null; // Réinitialiser

        Swal.fire({
          title: 'Success!',
          text: 'Evaluation modifié avec succès',
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

getServicesTitles(Evaluation: any): string {
  if (!Evaluation.servicesevaluations) return '';
  return Evaluation.servicesevaluations.map(s => s.title).join(', ');
}

getTitleWhy(Evaluation: any): string {
  if (!Evaluation.titleWhy) return '';
  return Evaluation.titleWhy.map(s => s.title).join(', ');
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