import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Logiciel } from 'src/app/models/logiciel';
import { LogicielService } from 'src/app/services/logiciel.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-logiciel',
  templateUrl: './logiciel.component.html',
  styleUrls: ['./logiciel.component.css']
})
export class LogicielComponent implements OnInit, OnChanges {
  @Input() sousFormationId!: number;
  @Input() showAllLogiciels: boolean = true; // ✅ true = tous les logiciels, false = filtrés
  @Output() logicielSelected = new EventEmitter<any[]>();
  @Output() addModeChanged = new EventEmitter<boolean>();
  
  loading = false;
  logiciels: any[] = [];
  selectedLogiciels: any[] = [];
  newLogicielName = '';
  selectedImage: File | null = null;
  modalMode: 'add' | 'edit' = 'add';
  
  formData = {
    id: null,
    name: '',
    image: '',
  };
  
  showModal = false;
showGridOnlyInModal: boolean = false; // ✅ par défaut, la grille n'apparaît pas

  constructor(private logicielService: LogicielService) {}

  ngOnInit() {
    console.log('🚀 LogicielComponent ngOnInit');
    console.log('   - sousFormationId:', this.sousFormationId);
    console.log('   - showAllLogiciels:', this.showAllLogiciels);
    this.loadLogiciels();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Recharger si showAllLogiciels change
    if (changes['showAllLogiciels']) {
      console.log('🔄 showAllLogiciels changé:', changes['showAllLogiciels'].currentValue);
      this.loadLogiciels();
    }
    
    // Recharger si sousFormationId change (uniquement si on ne veut pas tous les logiciels)
    if (changes['sousFormationId'] && changes['sousFormationId'].currentValue && !this.showAllLogiciels) {
      console.log('🔄 sousFormationId changé:', changes['sousFormationId'].currentValue);
      this.loadLogiciels();
    }
  }

handleAdd() {
  this.modalMode = 'add';
  this.formData = { id: null, name: '', image: '' };
  this.selectedImage = null;
  this.showModal = true;

  // ✅ La grille ne s'affiche PAS immédiatement dans le modal
  this.showGridOnlyInModal = false;
  this.addModeChanged.emit(true);
}

closeModal() {
  this.showModal = false;
  this.formData = { id: null, name: '', image: '' };
  this.selectedImage = null;

  this.showGridOnlyInModal = false;
  this.addModeChanged.emit(false);
}


  loadLogiciels() {
    // ✅ OPTION 1 : Si showAllLogiciels = true, charger TOUS les logiciels
    if (this.showAllLogiciels) {
      console.log('📡 Chargement de TOUS les logiciels (sans filtre)');
      this.loading = true;
      
      this.logicielService.getLogiciel().subscribe({
        next: (res) => {
          console.log('✅ Tous les logiciels récupérés:', res);
          this.logiciels = res || [];
          this.loading = false;
        },
        error: (err) => {
          console.error('❌ Erreur chargement logiciels:', err);
          this.logiciels = [];
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Impossible de charger les logiciels',
            timer: 2000
          });
        }
      });
      return;
    }

    // ✅ OPTION 2 : Charger les logiciels filtrés par sousFormationId
    if (!this.sousFormationId) {
      console.warn('⚠️ Aucun sousFormationId fourni, chargement de tous les logiciels par défaut');
      this.loading = true;
      
      this.logicielService.getLogiciel().subscribe({
        next: (res) => {
          console.log('✅ Tous les logiciels récupérés (par défaut):', res);
          this.logiciels = res || [];
          this.loading = false;
        },
        error: (err) => {
          console.error('❌ Erreur chargement logiciels:', err);
          this.logiciels = [];
          this.loading = false;
        }
      });
      return;
    }

    console.log('📡 Chargement des logiciels pour sousFormationId:', this.sousFormationId);
    this.loading = true;

    this.logicielService.getLogicielBySousFormationKeejob(this.sousFormationId).subscribe({
      next: (res) => {
        console.log('✅ Logiciels filtrés récupérés:', res);
        this.logiciels = res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Erreur chargement logiciels filtrés:', err);
        // Fallback: charger tous les logiciels
        this.logicielService.getLogiciel().subscribe({
          next: (allRes) => {
            console.log('⚠️ Fallback: tous les logiciels chargés');
            this.logiciels = allRes || [];
            this.loading = false;
          },
          error: () => {
            this.logiciels = [];
            this.loading = false;
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Impossible de charger les logiciels',
              timer: 2000
            });
          }
        });
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Veuillez sélectionner une image valide',
          timer: 2000
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'L\'image ne doit pas dépasser 5MB',
          timer: 2000
        });
        return;
      }
      
      this.selectedImage = file;
    }
  }

  addLogiciel() {
    if (!this.newLogicielName.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Nom du logiciel requis',
        timer: 2000
      });
      return;
    }

    const fd = new FormData();
    fd.append('name', this.newLogicielName.trim());
    
    // ✅ Si on a un sousFormationId, on l'ajoute (sinon logiciel global)
    if (this.sousFormationId) {
      fd.append('sousFormationKeejobId', this.sousFormationId.toString());
    }
    
    if (this.selectedImage) {
      fd.append('image', this.selectedImage, this.selectedImage.name);
    }

    this.logicielService.addLogiciel(fd).subscribe({
      next: (res) => {
        console.log('✅ Logiciel ajouté:', res);
        
        // Ajouter à la liste locale
        this.logiciels.push(res);
        
        // Sélectionner automatiquement le nouveau logiciel
        this.toggleLogiciel(res);
        
        // Réinitialiser le formulaire
        this.newLogicielName = '';
        this.selectedImage = null;
        this.closeModal();
        
        Swal.fire({
          icon: 'success',
          title: 'Logiciel ajouté!',
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: (err) => {
        console.error('❌ Erreur ajout:', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: err.error?.message || 'Impossible d\'ajouter le logiciel',
          timer: 2000
        });
      }
    });
  }

  toggleLogiciel(log: any) {
    const index = this.selectedLogiciels.findIndex(l => l.id === log.id);
    
    if (index > -1) {
      // Désélectionner
      this.selectedLogiciels.splice(index, 1);
    } else {
      // Sélectionner
      this.selectedLogiciels.push(log);
    }

    console.log('📋 Logiciels sélectionnés:', this.selectedLogiciels);
    this.logicielSelected.emit(this.selectedLogiciels);
  }

  isSelected(log: any): boolean {
    return this.selectedLogiciels.some(l => l.id === log.id);
  }

  editlogicielFromParent(logiciel: any) {
    console.log('📝 Edition logiciel:', logiciel);
    
    this.modalMode = 'edit';
    
    this.formData = {
      id: logiciel.id,
      name: logiciel.name,
      image: logiciel.image,
    };
    
    this.newLogicielName = logiciel.name;
    
    if (this.formData.image) {
      this.selectedImage = { name: 'Image existante' } as any;
    }
    
    this.showModal = true;
  }

  // ✅ Méthode publique pour forcer le rechargement (appelée depuis le parent)
  public refreshLogiciels() {
    console.log('🔄 Rechargement forcé des logiciels');
    this.loadLogiciels();
  }
}