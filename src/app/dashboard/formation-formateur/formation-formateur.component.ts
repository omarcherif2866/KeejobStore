import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormationFormateur } from 'src/app/models/formation-formateur';
import { AuthService } from 'src/app/services/auth.service';
import { FormationFormateurService } from 'src/app/services/formation-formateur.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formation-formateur',
  templateUrl: './formation-formateur.component.html',
  styleUrls: ['./formation-formateur.component.css']
})
export class FormationFormateurComponent implements OnInit {

  sidebarOpen = true;
  formations: FormationFormateur[] = [];
  loading = false;
  currentPage = 1;
  itemsPerPage = 5;
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';

  formData = {
    id: null,
    title: '',
    description: [] as string[]

  };
  
  editId: any = null;
  selectedImage: File | null = null;

  constructor(private formationFormateur: FormationFormateurService, private authService: AuthService,private router:Router) {}

  ngOnInit() {
    this.fetchFormations()
  }

  // Récupérer les actualités depuis le backend
fetchFormations() {
  this.loading = true;

  // Récupérer l'ID du formateur depuis le localStorage
  const id = localStorage.getItem("userId");
  if (!id) {
    console.error("ID du formateur introuvable dans le localStorage !");
    this.loading = false;
    return;
  }

  // Appel au service
  this.formationFormateur.getByFormateur(id).subscribe(
    (response: any[]) => {
      this.formations = response; // stocker les formations récupérées
      console.log("Formations récupéréess :", this.formations);
      this.loading = false;
    },
    (error) => {
      console.error("Erreur lors du chargement des formations", error);
      this.loading = false;
    }
  );
}



  // Pagination
  get currentItems(): FormationFormateur[] {
    const indexOfLastItem = this.currentPage * this.itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - this.itemsPerPage;
    return this.formations.slice(indexOfFirstItem, indexOfLastItem);
  }

  get totalPages(): number {
    return Math.ceil(this.formations.length / this.itemsPerPage);
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
    title: '',
    description: ['']   // 👈 crée le premier textarea automatiquement
  };
  this.showModal = true;
}

// Éditer un formateur
handleEdit(formations: any) {
  console.log('Formation à éditer:', formations);

  this.modalMode = 'edit';

  // Champs principaux
  this.formData.id = formations?.id || null;
  this.formData.title = formations?.title || '';

  // Description dynamiques
  this.formData.description.length = 0; // vider le tableau
  if (formations?.description) {
    if (Array.isArray(formations.description)) {
      this.formData.description.push(...formations.description);
    } else {
      this.formData.description.push(formations.description);
    }
  } else {
    this.formData.description.push(''); // toujours au moins un textarea
  }

  // ID pour l'édition
  this.editId = formations?.id || null;

  this.showModal = true;

  console.log('FormData après init:', this.formData);
}




trackByIndex(index: number, item: any) {
  return index;
}




  // Supprimer une actualité
  // handleDelete(id: any) {
  //   if (confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
  //     this.formationFormateur.(id).subscribe(
  //       () => {
  //         this.formateurs = this.formateurs.filter(item => item.Id !== id);
  //         Swal.fire({
  //           title: 'Success!',
  //           text: 'Actualité supprimée avec succès',
  //           icon: 'success',
  //           confirmButtonText: 'OK',
  //           timer: 1500,
  //         }).then(() => {
  //           window.location.reload();
  //         });         
  //       },
  //       (error) => {
  //         Swal.fire({
  //         icon: 'error',
  //         title: 'Erreur lors de la suppression',
  //         showConfirmButton: false,
  //         timer: 1500
  //       });          
  //       }
  //     );
  //   }
  // }

  // Soumettre le formulaire
handleSubmit() {
  const id = localStorage.getItem("userId");
  
  console.log("User ID:", id); // Debug

  const formationData = {
    title: this.formData.title,
    description: this.formData.description.filter(d => d.trim() !== ''), // Enlever les description vides
    formateur: { id: Number(id) }
  };

  console.log("Formation à envoyer:", formationData); // Debug
  console.log("Mode:", this.modalMode); // Debug

  // ✅ Vérifier le mode (ajout ou modification)
  if (this.modalMode === 'add') {
    // MODE AJOUT
    this.formationFormateur.add(formationData).subscribe(
      (res) => {
        console.log('Formation ajoutée', res);
        Swal.fire({
          icon: 'success',
          title: 'Formation ajoutée',
          showConfirmButton: false,
          timer: 1500
        });        
        this.showModal = false;
        this.fetchFormations();
      },
      (err) => {
        console.error('Erreur ajout', err);
        console.error('Détails:', err.error);
      }
    );
  } else if (this.modalMode === 'edit') {
    // MODE MODIFICATION
    this.formationFormateur.update(this.editId, formationData).subscribe(
      (res) => {
        console.log('Formation modifiée', res);
        Swal.fire({
          icon: 'success',
          title: 'Formation modifiée',
          showConfirmButton: false,
          timer: 1500
        });           
        this.showModal = false;
        this.fetchFormations();
      },
      (err) => {
        console.error('Erreur modification', err);
        console.error('Détails:', err.error);
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


addDescription() {
  this.formData.description.push('');
}

removeDescription(index: number) {
  this.formData.description.splice(index, 1);
}




}