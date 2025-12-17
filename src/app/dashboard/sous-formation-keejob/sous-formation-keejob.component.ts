import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DetailObject, SousFormationKeejob } from 'src/app/models/sous-formation-keejob';
import { Partenaire } from 'src/app/models/partenaire';
import { AuthService } from 'src/app/services/auth.service';
import { PartenaireService } from 'src/app/services/partenaire.service';
import { SousFormationKeejobService } from 'src/app/services/sous-formation-keejob.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sous-formation-keejob',
  templateUrl: './sous-formation-keejob.component.html',
  styleUrls: ['./sous-formation-keejob.component.css']
})
export class SousFormationKeejobComponent implements OnInit {
  @Input() formationId!: any;
@Output() sousFormationSelected = new EventEmitter<any>();

  sidebarOpen = true;
  sousFormationKeejob: SousFormationKeejob[] = [];
  partenaires: Partenaire[] = [];
  selectedPartenaires: any[] = [];
  loading = false;
  // currentPage = 1;
  itemsPerPage = 5;
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';

  formData = {
    id: null,
    title: '',
    description: '',
    image: '',
    logo: '',
    formationKeejobId: null, // ✅ Changé de formationKeejob: [] à formationKeejobId: null
    sousFormationPartenaires: [],
    details: [] as any[], // ✅ Ajout de details
    titleLogiciel: '' // ✅ Ajout de titleLogiciel
  };
iconsFiles: File[] = []; // ⬅️ icônes envoyées au backend

  editId: any = null;
  selectedImage: File | null = null;
  selectedLogo?: File;

  constructor(
    private partenaireservice: PartenaireService,
    private sousFormationKeejobService: SousFormationKeejobService,
    private cdr: ChangeDetectorRef,
    private partenaireService: PartenaireService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('🚀 SousFormationKeejob - Initialisation');
    console.log('📌 formationId reçu:', this.formationId);
    console.log('fetchsousFormationKeejob:',  this.fetchsousFormationKeejob());
    
    this.fetchsousFormationKeejob();
    this.fetchPartenaires();
  }

fetchsousFormationKeejob() {
  this.loading = true;
  console.log('📡 Récupération des sous-formations...');

  this.sousFormationKeejobService.getSousFormationKeejob().subscribe(
    (response: any[]) => {
      console.log('✅ Réponse brute:', response);
      console.log('🔍 Premier objet de response:', response[0]);

      // Pas de filtrage si la réponse ne contient pas formationId
      const filteredResponse = response;

      this.sousFormationKeejob = filteredResponse.map(f => new SousFormationKeejob(
        f.id,
        f.title,
        f.description,
        f.image,
        f.titleLogiciel,
        f.sousFormationPartenaires || [],
        f.sousFormationLogiciel || [],
        this.formationId, // ✅ utiliser l'ID courant manuellement
        f.details
      ));

      this.loading = false;
      console.log('✅ Sous-formations mappées:', this.sousFormationKeejob);
    },
    (error) => {
      console.error('❌ Erreur chargement:', error);
      this.loading = false;
      Swal.fire({
        icon: 'error',
        title: 'Erreur lors du chargement',
        showConfirmButton: false,
        timer: 1500
      });
    }
  );
}


  fetchPartenaires() {
    this.partenaireservice.getPartenaire().subscribe(
      (response: any[]) => {
        this.partenaires = response.map(p => new Partenaire(
          p.id,
          p.title,
          p.description,
          p.image
        ));
        console.log('✅ Partenaires chargés:', this.partenaires.length);
      },
      (error) => {
        console.error('❌ Erreur partenaires:', error);
      }
    );
  }

  // get currentItems(): SousFormationKeejob[] {
  //   const indexOfLastItem = this.currentPage * this.itemsPerPage;
  //   const indexOfFirstItem = indexOfLastItem - this.itemsPerPage;
  //   return this.sousFormationKeejob.slice(indexOfFirstItem, indexOfLastItem);
  // }

  get totalPages(): number {
    return Math.ceil(this.sousFormationKeejob.length / this.itemsPerPage);
  }

  get pagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  // handlePageChange(pageNumber: number) {
  //   this.currentPage = pageNumber;
  // }

handleAdd() {
  this.modalMode = 'add';
  this.formData = {
    id: null,
    title: '',
    description: '',
    image: '',
      logo: '',
    formationKeejobId: this.formationId, // ✅ Utiliser directement l'ID
    sousFormationPartenaires: [],
    details: [], // ✅ Réinitialiser details
    titleLogiciel: '' // ✅ Ajout


  };
  this.selectedPartenaires = [];
  this.selectedImage = null;
  this.showModal = true;
}

handleEdit(sousFormation: SousFormationKeejob) {
  this.modalMode = 'edit';
  this.formData = {
    id: sousFormation.Id,
    title: sousFormation.Title,
    description: sousFormation.Description,
    image: sousFormation.Image,
    logo: sousFormation.Logo,
    formationKeejobId: sousFormation.FormationKeejob?.Id || this.formationId, // ✅ Extraire l'ID
    sousFormationPartenaires: sousFormation.Partenaires || [],
    details: sousFormation.Details ? [...sousFormation.Details] : [], // ✅ Copier les détails existants
    titleLogiciel: sousFormation.TitleLogiciel,


  };
  this.editId = sousFormation.Id;
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
        this.sousFormationKeejobService.deleteSousFormationKeejob(id).subscribe(
          () => {
            this.sousFormationKeejob = this.sousFormationKeejob.filter(item => item.Id !== id);
            Swal.fire({
              title: 'Supprimé!',
              text: 'Sous-formation supprimée avec succès',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
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

  const formData = new FormData();
  
  // ✅ Validation: s'assurer que les valeurs sont des strings
  formData.append('title', String(this.formData.title));
  formData.append('description', String(this.formData.description));

  if (this.formationId) {
    formData.append('formationKeejobId', String(this.formationId));
  }

  // ✅ Vérifier que titleLogiciel existe et est une string
  if (this.formData.titleLogiciel) {
    formData.append('titleLogiciel', String(this.formData.titleLogiciel));
  }

  // ✅ Vérifier que selectedImage est bien un File
  if (this.selectedImage && this.selectedImage instanceof File) {
    formData.append('image', this.selectedImage, this.selectedImage.name);
  }

  if (this.selectedLogo) {
      formData.append('logo', this.selectedLogo, this.selectedLogo.name);
  }

  // ✅ Vérifier que les partenaires ont des IDs valides
  if (this.selectedPartenaires && this.selectedPartenaires.length > 0) {
    this.selectedPartenaires.forEach(p => {
      if (p && p.id != null) {
        formData.append("partenairesIds", String(p.id));
      }
    });
  }

  // ✅ Validation des details
  const safeDetails = (this.formData.details || []).map(d => ({
    titre: String(d.titre || ''),
    description: String(d.description || '')
  }));
  
  formData.append('details', JSON.stringify(safeDetails));

  // ✅ CRITIQUE: Vérifier que iconsFiles contient bien des Files
  if (this.iconsFiles && Array.isArray(this.iconsFiles)) {
    this.iconsFiles.forEach((file, index) => {
      // Vérifier que c'est vraiment un File
      if (file && file instanceof File) {
        formData.append('icons', file, file.name);
      } else {
        console.warn(`⚠️ Icon at index ${index} is not a File:`, file);
        // Ajouter un fichier vide si nécessaire pour maintenir l'ordre
        const emptyFile = new File([], '', { type: 'application/octet-stream' });
        formData.append('icons', emptyFile);
      }
    });
  }

  const afterSuccess = (response: any) => {
    Swal.fire({
      title: 'Succès!',
      text: this.modalMode === 'add' ? 'Sous-formation ajoutée avec succès' : 'Sous-formation modifiée avec succès',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
    this.closeModal();
    this.fetchsousFormationKeejob();

    if (this.modalMode === 'add') {
      this.sousFormationSelected.emit(response);
    }
  }

  const onError = (error: any) => {
    console.error('Erreur:', error);
    Swal.fire({
      icon: 'error',
      title: `Erreur lors de ${this.modalMode === 'add' ? 'l\'ajout' : 'la modification'}`,
      timer: 1500
    });
  };

  if (this.modalMode === 'add') {
    this.sousFormationKeejobService.addSousFormationKeejob(formData).subscribe(
      afterSuccess,
      onError
    );
  } else {
    this.sousFormationKeejobService.putSousFormationKeejob(this.editId, formData).subscribe(
      afterSuccess,
      onError
    );
  }
}


  addDetail() {
    this.formData.details.push({
      titre: '',
      description: '',
      icon: '',
      iconPreview: ''

    });
  }

  // ✅ Supprimer un détail
removeDetail(i: number) {
  this.formData.details.splice(i, 1);
  this.iconsFiles.splice(i, 1);
}


closeModal() {
  this.showModal = false;
  this.formData = {
    id: null,
    title: '',
    description: '',
    image: '',
    logo:'',
    formationKeejobId: null, // ✅ Changé
    sousFormationPartenaires: [],
    details: [], // ✅ Réinitialiser details
    titleLogiciel: '' // ✅ Ajout


  };
  this.selectedPartenaires = [];
  this.selectedImage = null;
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
    // Retirer le partenaire
    this.selectedPartenaires.splice(index, 1);
  } else {
    // Ajouter le partenaire
    this.selectedPartenaires.push(p);
  }
  
  // ✅ Synchroniser avec formData
  this.formData.sousFormationPartenaires = [...this.selectedPartenaires];
  
  console.log('Partenaires sélectionnés:', this.selectedPartenaires);
}

  isSelected(p: Partenaire): boolean {
    return this.selectedPartenaires.some(x => x.id === p.Id);
  }


editSousFormationFromParent(sf: any) {
  console.log('Edition SF:', sf);
  
  this.modalMode = 'edit';
  
  // ✅ IMPORTANT: Définir editId AVANT tout
  this.editId = sf.id || sf.Id;
  
  // Charger les données de base
  this.formData = {
    id: sf.id || sf.Id,
    title: sf.title || sf.Title,
    description: sf.description || sf.Description,
    image: sf.image || sf.Image,
    logo: sf.logo || sf.Logo,
    formationKeejobId: sf.formationKeejobId || sf.FormationKeejob?.Id,
    sousFormationPartenaires: [],
    details: sf.details || sf.Details || [],
    titleLogiciel: sf.titleLogiciel || sf.TitleLogiciel || ''
  };
  
  console.log('✅ editId défini:', this.editId); // ← Vérification
  console.log('✅ formData.id:', this.formData.id); // ← Vérification
  
  if (this.formData.image) {
    this.selectedImage = { name: 'Image existante' } as any;
  }
  
  this.showModal = true;
  
  // Charger les partenaires associés depuis l'API
  if (this.formData.id) {
    this.partenaireService.getPartenaireBySousFormationKeejob(this.formData.id)
      .subscribe({
        next: (partenaires) => {
          console.log('Partenaires récupérés:', partenaires);
          
          this.selectedPartenaires = partenaires;
          this.formData.sousFormationPartenaires = partenaires;
          
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erreur lors du chargement des partenaires:', error);
          this.selectedPartenaires = [];
          this.formData.sousFormationPartenaires = [];
        }
      });
  } else {
    this.selectedPartenaires = [];
  }
}

onIconSelected(event: any, index: number) {
  const file = event.target.files[0];

  if (file) {
    // Stocker dans le tableau des fichiers
    this.iconsFiles[index] = file;

    // Prévisualisation
    const reader = new FileReader();
    reader.onload = () => {
      this.formData.details[index].iconPreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}


  onLogoSelected(event: any) {
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
      
      this.selectedLogo = file;
    }
}


}