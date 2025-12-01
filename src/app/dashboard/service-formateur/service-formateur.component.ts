import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceFormateur } from 'src/app/models/service-formateur';
import { TitleWhy } from 'src/app/models/title-why';
import { AuthService } from 'src/app/services/auth.service';
import { ServiceFormateurService } from 'src/app/services/service-formateur.service';
import { TitleWhyService } from 'src/app/services/title-why.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-service-formateur',
  templateUrl: './service-formateur.component.html',
  styleUrls: ['./service-formateur.component.css']
})
export class ServiceFormateurComponent implements OnInit {


  sidebarOpen = true;
  services: ServiceFormateur[] = [];
  loading = false;
  currentPage = 1;
  itemsPerPage = 5;
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';

  formData = {
    id: null,
    title: '',
    description: ''

  };


formDataTitleWhy= {
    id: null,
    title: '',
    description: ''

  };
listTitleWhy: TitleWhy[] = [];
savedTitleWhy: TitleWhy[] = []; // liste des TitleWhy déjà enregistrés



  
  editId: any = null;
  selectedImage: File | null = null;

  constructor(private ServiceFormateur: ServiceFormateurService, private authService: AuthService,private router:Router, private titleWhyService: TitleWhyService) {}

  ngOnInit() {
    this.fetchservices()
  }

  // Récupérer les actualités depuis le backend
fetchservices() {
  this.loading = true;

  // Récupérer l'ID du formateur depuis le localStorage
  const id = localStorage.getItem("userId");
  if (!id) {
    console.error("ID du formateur introuvable dans le localStorage !");
    this.loading = false;
    return;
  }

  // Appel au service
  this.ServiceFormateur.getServicesByFormateur(id).subscribe(
    (response: any[]) => {
      this.services = response; // stocker les services récupérées
      console.log("services récupéréess :", this.services);
      this.loading = false;
    },
    (error) => {
      console.error("Erreur lors du chargement des services", error);
      this.loading = false;
    }
  );
}



  // Pagination
  get currentItems(): ServiceFormateur[] {
    const indexOfLastItem = this.currentPage * this.itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - this.itemsPerPage;
    return this.services.slice(indexOfFirstItem, indexOfLastItem);
  }

  get totalPages(): number {
    return Math.ceil(this.services.length / this.itemsPerPage);
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
    description: ''  // 👈 crée le premier textarea automatiquement
  };
  this.showModal = true;
}


addTitleWhy() {
  const why = new TitleWhy('', ''); // constructeur obligatoire

  why.Id = null;
  why.Formateur = null;
  // Title et Description sont déjà '' grâce au constructeur

  this.listTitleWhy.push(why);
}

removeTitleWhy(index: number) {
  this.listTitleWhy.splice(index, 1);
}


// Éditer un formateur
handleEdit(services: any) {
  console.log('Formation à éditer:', services);

  this.modalMode = 'edit';

  // Champs principaux
  this.formData.id = services?.id || null;
  this.formData.title = services?.title || '';
  this.formData.description = services?.description || '';


  // ID pour l'édition
  this.editId = services?.id || null;

  this.showModal = true;

  console.log('FormData après init:', this.formData);
}



  // Supprimer une actualité
  // handleDelete(id: any) {
  //   if (confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
  //     this.ServiceFormateur.(id).subscribe(
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

  const serviceData = {
    title: this.formData.title,
    description: this.formData.description,
    formateur: { id: Number(id) }
  };

  console.log("Formation à envoyer:", serviceData); // Debug
  console.log("Mode:", this.modalMode); // Debug

  // ✅ Vérifier le mode (ajout ou modification)
  if (this.modalMode === 'add') {
    // MODE AJOUT
    this.ServiceFormateur.add(serviceData).subscribe(
      (res) => {
        console.log('Formation ajoutée', res);
        Swal.fire({
          icon: 'success',
          title: 'Formation ajoutée',
          showConfirmButton: false,
          timer: 1500
        });        
        this.showModal = false;
        this.fetchservices();
      },
      (err) => {
        console.error('Erreur ajout', err);
        console.error('Détails:', err.error);
      }
    );
  } else if (this.modalMode === 'edit') {
    // MODE MODIFICATION
    this.ServiceFormateur.update(this.editId, serviceData).subscribe(
      (res) => {
        console.log('Formation modifiée', res);
        Swal.fire({
          icon: 'success',
          title: 'Formation modifiée',
          showConfirmButton: false,
          timer: 1500
        });           
        this.showModal = false;
        this.fetchservices();
      },
      (err) => {
        console.error('Erreur modification', err);
        console.error('Détails:', err.error);
      }
    );
  }
}


saveTitleWhy(event?: Event) {
  if (event) {
    event.preventDefault(); // empêche le refresh si bouton submit
  }

  const formateurId = localStorage.getItem("userId");

  this.listTitleWhy.forEach((why, index) => {
    const payload = {
      title: why.Title,
      description: why.Description,
      formateur: { id: Number(formateurId) }
    };

    this.titleWhyService.add(payload).subscribe(
      (res: any) => {
        console.log(`TitleWhy #${index + 1} enregistré :`, res);
        this.savedTitleWhy.push(res);
      },
      (err) => {
        console.error(`Erreur enregistrement TitleWhy #${index + 1} :`, err);
      }
    );
  });

  // Réinitialisation des inputs dynamiques
  this.listTitleWhy = [];

  // Affichage Swal sans refresh
  Swal.fire('Tous les TitleWhy ont été enregistrés !', '', 'success');
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


      


}
