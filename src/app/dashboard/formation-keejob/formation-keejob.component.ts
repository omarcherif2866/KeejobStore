import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormationKeejob } from 'src/app/models/formation-keejob';
import { Partenaire } from 'src/app/models/partenaire';
import { AuthService } from 'src/app/services/auth.service';
import { FormationKeejobService } from 'src/app/services/formation-keejob.service';
import { PartenaireService } from 'src/app/services/partenaire.service';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { SousFormationKeejobService } from 'src/app/services/sous-formation-keejob.service';
import { Logiciel } from 'src/app/models/logiciel';
import { SousFormationKeejob } from 'src/app/models/sous-formation-keejob';
import { SousFormationKeejobComponent } from '../sous-formation-keejob/sous-formation-keejob.component';
import { LogicielService } from 'src/app/services/logiciel.service';
import { LogicielComponent } from '../logiciel/logiciel.component';

@Component({
  selector: 'app-formation-keejob',
  templateUrl: './formation-keejob.component.html',
  styleUrls: ['./formation-keejob.component.css']
})
export class FormationKeejobComponent implements OnInit {
  @ViewChild(SousFormationKeejobComponent) sousFormationChild!: SousFormationKeejobComponent;
  @ViewChild(LogicielComponent) logicielChild!: LogicielComponent;
  showLogicielGridInModal = true;

  selectedLogiciels: any[] = [];
  sidebarOpen = true;
  formationsKeejob: FormationKeejob[] = [];
  partenaires: Partenaire[] = [];
  selectedPartenaires: any[] = [];
  loading = false;
  currentPage = 1;
  itemsPerPage = 5;
  
  // Modals
  showModal = false;
  showSousFormationModal = false;
  showLogicielModal = false;
  
  modalMode: 'add' | 'edit' = 'add';

  formData = {
    id: null,
    title: '',
    description: '',
    image:'',
    partenaires: []
  };
  
  formDataSF = {
    id: null,
    title: '',
    description: '',
    image: '',
    formationKeejobId: null,
    sousFormationPartenaires: []
  };

  editId: any = null;
  selectedImage: File | null = null;

  currentStep = 1;
  createdFormation: FormationKeejob | null = null;
  selectedSousFormation: any = null;
  availableSousFormations: any[] = [];
  selectedLogiciel: Logiciel | null = null;
  
  // Pour les modals
  currentFormation: FormationKeejob | null = null;
  currentSousFormation: any | null = null;
  
  // Maps pour stocker les données
  sousFormationsMap: { [formationId: number]: SousFormationKeejob[] } = {};
  logicielMap: { [sfId: number]: Logiciel[] } = {};

  constructor(
    private partenaireservice: PartenaireService, 
    private formationsKeejobervice: FormationKeejobService, 
    private sousFormationService: SousFormationKeejobService, 
    private partenaireService: PartenaireService,
    private logicielService: LogicielService,
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngAfterViewInit() {
    console.log('Child component sous-formation:', this.sousFormationChild);
    console.log('Child component logiciel:', this.logicielChild);
  }

  ngOnInit() {
    console.log('🚀 Initialisation - currentStep:', this.currentStep);
    this.fetchformationsKeejob();
    this.fetchPartenaires();
  }

  // ==================== RÉCUPÉRATION DES DONNÉES ====================
  
  fetchformationsKeejob() {
    this.loading = true;
    console.log('📡 Récupération des formations...');
    
    this.formationsKeejobervice.getFormationKeejob().subscribe(
      (response: any[]) => {
        console.log('✅ Réponse brute du backend:', response);
        
        this.formationsKeejob = response.map(f => new FormationKeejob(
          f.id,
          f.title,
          f.description,
          f.image,
          f.partenaires || []
        ));
        
        this.loading = false;
      },
      (error) => {
        console.error('❌ Erreur lors du chargement des formations:', error);
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

  fetchPartenaires() {
    this.loading = true;
    console.log('📡 Récupération des partenaires...');
    
    this.partenaireservice.getPartenaire().subscribe(
      (response: any[]) => {
        console.log('✅ Réponse partenaires:', response);
        
        this.partenaires = response.map(p => new Partenaire(
          p.id,
          p.title,
          p.description,
          p.image
        ));
        
        this.loading = false;
      },
      (error) => {
        console.error('❌ Erreur lors du chargement des partenaires:', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors du chargement des partenaires',
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
  }

  // ==================== PAGINATION ====================
  
  get currentItems(): FormationKeejob[] {
    const indexOfLastItem = this.currentPage * this.itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - this.itemsPerPage;
    return this.formationsKeejob.slice(indexOfFirstItem, indexOfLastItem);
  }

  get totalPages(): number {
    return Math.ceil(this.formationsKeejob.length / this.itemsPerPage);
  }

  get pagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  handlePageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  // ==================== GESTION FORMATIONS ====================
  
  handleAdd() {
    this.modalMode = 'add';
    this.formData = {
      id: null,
      title: '',
      description: '',
      image: '',
      partenaires: []
    };
    this.selectedPartenaires = [];
    this.selectedImage = null;
    this.showModal = true;
  }

  handleEdit(formation: FormationKeejob) {
    this.modalMode = 'edit';
    this.editId = formation.Id;
    
    this.formData = {
      id: formation.Id,
      title: formation.Title,
      description: formation.Description,
      image: formation.Image,
      partenaires: []
    };

    this.partenaireService.getPartenaireByFormationKeejob(formation.Id).subscribe(
      (partenaires) => {
        this.selectedPartenaires = partenaires;
        this.formData.partenaires = [...partenaires];
        console.log('Partenaires chargés pour édition:', partenaires);
      },
      (error) => {
        console.error('Erreur chargement partenaires:', error);
        this.selectedPartenaires = [];
      }
    );

    this.showModal = true;
  }

  handleDelete(id: any) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Cette action est irréversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.formationsKeejobervice.deleteFormationKeejob(id).subscribe(
          () => {
            this.formationsKeejob = this.formationsKeejob.filter(item => item.Id !== id);
            Swal.fire({
              title: 'Supprimé!',
              text: 'Formation supprimée avec succès',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            }).then(() => {
              this.fetchformationsKeejob();
            });
          },
          (error) => {
            console.error('Erreur suppression:', error);
            Swal.fire({
              icon: 'error',
              title: 'Erreur lors de la suppression',
              showConfirmButton: false,
              timer: 1500
            });
          }
        );
      }
    });
  }

  private mapToFormationKeejob(data: any): FormationKeejob {
    return new FormationKeejob(
      data.id || data.Id,
      data.title || data.Title,
      data.description || data.Description,
      data.image || data.Image,
      data.partenaires || data.Partenaires || []
    );
  }

  handleSubmit() {
    if (!this.formData.title || !this.formData.description) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Veuillez remplir tous les champs obligatoires',
        timer: 2000
      });
      return;
    }

    if (!this.selectedImage && this.modalMode === 'add') {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Veuillez sélectionner une image',
        timer: 2000
      });
      return;
    }

    const fd = new FormData();
    fd.append('title', this.formData.title);
    fd.append('description', this.formData.description);

    if (this.selectedImage) {
      fd.append('image', this.selectedImage, this.selectedImage.name);
    }

    if (this.selectedPartenaires.length > 0) {
      this.selectedPartenaires.forEach(p => {
        fd.append("partenairesIds", p.Id.toString());
      });
    }

    if (this.modalMode === 'add') {
      this.formationsKeejobervice.addFormationKeejob(fd).subscribe(
        res => {
          console.log('✅ Formation créée:', res);
          
          this.createdFormation = this.mapToFormationKeejob(res);
          
          console.log('📦 createdFormation:', this.createdFormation);
          console.log('🔑 formationId (via getter):', this.createdFormation.Id);
          
          this.showModal = false;
          this.currentStep = 2;
          
          Swal.fire({
            icon: 'success',
            title: 'Formation créée!',
            text: 'Vous pouvez maintenant ajouter des sous-formations',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error => {
          console.error('❌ Erreur création:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Impossible de créer la formation',
            timer: 2000
          });
        }
      );
    } else {
      this.formationsKeejobervice.putFormationKeejob(this.editId, fd).subscribe(
        res => {
          Swal.fire({
            icon: 'success',
            title: 'Formation modifiée!',
            timer: 1500,
            showConfirmButton: false
          });
          this.closeModal();
          this.fetchformationsKeejob();
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Impossible de modifier la formation',
            timer: 2000
          });
        }
      );
    }
  }

  // ==================== MODALS SOUS-FORMATIONS ====================
  
  openSousFormationsModal(formation: FormationKeejob) {
    this.currentFormation = formation;
    this.loading = true;
    
    console.log('📡 Chargement sous-formations pour formation:', formation.Id);
    
    this.sousFormationService.getSousFormationKeejobByFormationKeejob(formation.Id).subscribe(
      (sousFormations) => {
        console.log('✅ Sous-formations chargées:', sousFormations);
        this.sousFormationsMap[formation.Id] = sousFormations;
        this.showSousFormationModal = true;
        this.loading = false;
      },
      (error) => {
        console.error('❌ Erreur chargement sous-formations:', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les sous-formations',
          timer: 2000
        });
      }
    );
  }

  closeSousFormationModal() {
    this.showSousFormationModal = false;
    this.currentFormation = null;
  }

  openSousFormationModal(sf: any) {
    console.log('Données SF pour édition:', sf);
    
    if (this.sousFormationChild) {
      this.sousFormationChild.editSousFormationFromParent(sf);
    } else {
      console.error('Le child component n\'est pas disponible');
    }
  }

  handleDeleteSF(id: any) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Cette action est irréversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sousFormationService.deleteSousFormationKeejob(id).subscribe(
          () => {
            Swal.fire({
              title: 'Supprimé!',
              text: 'Sous-formation supprimée avec succès',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
            
            // Recharger les sous-formations du modal actuel
            if (this.currentFormation) {
              this.openSousFormationsModal(this.currentFormation);
            }
          },
          (error) => {
            console.error('Erreur suppression:', error);
            Swal.fire({
              icon: 'error',
              title: 'Erreur lors de la suppression',
              timer: 1500
            });
          }
        );
      }
    });
  }

  // ==================== MODALS LOGICIELS ====================
  
openLogicielsModal(sf: any) {
  console.log('🔍 Ouverture modal logiciels pour:', sf);
  console.log('🔑 ID de la sous-formation:', sf.id); // ✅ Vérifier cette ligne
  
  this.currentSousFormation = sf;
  const sfId = sf.id;
  this.showLogicielGridInModal = true;

  if (!sfId) {
    console.error('❌ ID manquant');
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'ID de sous-formation manquant',
      timer: 2000
    });
    return;
  }

  this.loading = true;

  this.logicielService.getLogicielBySousFormationKeejob(sfId).subscribe(
    (logiciels) => {
      console.log('✅ Logiciels chargés:', logiciels);
      this.logicielMap[sfId] = logiciels;
      this.showLogicielModal = true;
      this.loading = false;
    },
    (error) => {
      console.error('❌ Erreur chargement logiciels:', error);
      this.loading = false;
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les logiciels',
        timer: 2000
      });
    }
  );
}
  closeLogicielModal() {
    this.showLogicielModal = false;
    this.currentSousFormation = null;
  }

  openlogicielModal(log: any) {
    console.log('Données logiciel pour édition:', log);
    
    if (this.logicielChild) {
      this.logicielChild.editlogicielFromParent(log);
    } else {
      console.error('Le child component logiciel n\'est pas disponible');
    }
  }

  deleteLogiciel(logicielId: number) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Cette action est irréversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.logicielService.deleteLogiciel(logicielId).subscribe(
          () => {
            Swal.fire({
              title: 'Supprimé!',
              text: 'Logiciel supprimé avec succès',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
            
            // Recharger les logiciels du modal actuel
            if (this.currentSousFormation) {
              this.openLogicielsModal(this.currentSousFormation);
            }
          },
          (error) => {
            console.error('Erreur suppression logiciel:', error);
            Swal.fire({
              icon: 'error',
              title: 'Erreur lors de la suppression',
              timer: 1500
            });
          }
        );
      }
    });
  }

  // ==================== UTILITAIRES ====================
  
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.authService.logout();
    Swal.fire({
      icon: 'info',
      title: 'Vous êtes déconnecté',
      showConfirmButton: false,
      timer: 1500
    });
    this.router.navigate(['/']);
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
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

    if (url.includes("https://res.cloudinary.com") && url.split("https://res.cloudinary.com").length > 2) {
      const parts = url.split("https://res.cloudinary.com/daxkymr4t/image/upload/");
      return "https://res.cloudinary.com/daxkymr4t/image/upload/" + parts[parts.length - 1];
    }

    return url;
  }

  togglePartenaire(p: Partenaire) {
    const index = this.selectedPartenaires.findIndex(x => x.Id === p.Id);
    
    if (index > -1) {
      this.selectedPartenaires.splice(index, 1);
    } else {
      this.selectedPartenaires.push(p);
    }
    
    this.formData.partenaires = [...this.selectedPartenaires];
    console.log('Partenaires sélectionnés:', this.selectedPartenaires);
  }

  isSelected(p: Partenaire): boolean {
    return this.selectedPartenaires.some(x => x.Id === p.Id);
  }

  closeModal() {
    this.showModal = false;
    this.formData = {
      id: null,
      title: '',
      description: '',
      image: '',
      partenaires: []
    };
    this.selectedPartenaires = [];
    this.selectedImage = null;
  }

  // ==================== STEPS (WORKFLOW CRÉATION) ====================
  
  backToStep1() {
    Swal.fire({
      title: 'Retour à la liste?',
      text: "Les sous-formations ont été ajoutées avec succès",
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Oui, retourner',
      cancelButtonText: 'Rester ici'
    }).then((result) => {
      if (result.isConfirmed) {
        this.currentStep = 1;
        this.createdFormation = null;
        this.fetchformationsKeejob();
      }
    });
  }

  goToStep3() {
    this.loadAvailableSousFormations();
    this.currentStep = 3;
  }

  backToStep2() {
    this.currentStep = 2;
    this.selectedSousFormation = null;
  }

  loadAvailableSousFormations() {
    if (!this.createdFormation) return;

    this.sousFormationService.getSousFormationKeejobById(this.createdFormation.Id)
      .subscribe({
        next: (data: any) => {
          this.availableSousFormations = Array.isArray(data) ? data : [data];
          this.selectedSousFormation = this.availableSousFormations[0] || null;
          console.log("SousFormationKeejob reçu:", this.selectedSousFormation);
        },
        error: (err) => {
          console.error('Erreur lors du chargement des sous-formations:', err);
          this.availableSousFormations = [];
        }
      });
  }

  onSousFormationSelected(sousFormation: any) {
    console.log('SousFormation reçue dans step3:', sousFormation);
    this.selectedSousFormation = sousFormation;
    this.currentStep = 3;
  }

  onSousFormationChange() {
    console.log('Sous-formation sélectionnée:', this.selectedSousFormation);
  }

  finishProcess() {
    if (!this.selectedSousFormation || this.selectedLogiciels.length === 0) {
      alert("Veuillez sélectionner au moins un logiciel.");
      return;
    }

    const payload = {
      sousFormationId: this.selectedSousFormation.id,
      logiciels: this.selectedLogiciels.map(l => l.id)
    };

    this.sousFormationService.assignLogicielsToSousFormation(payload)
      .subscribe({
        next: () => {
          alert("Logiciels assignés avec succès !");
        },
        error: (err) => {
          console.error(err);
        }
      });
    this.backToStep1();
  }

  onLogicielSelected(list: any[]) {
    this.selectedLogiciels = list;
  }
}