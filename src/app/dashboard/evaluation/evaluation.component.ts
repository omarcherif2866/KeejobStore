import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Evaluation, EvaluationSection, Category, EvaluationCategory, Details } from 'src/app/models/evaluation';
import { EvaluationCatalogue } from 'src/app/models/evaluation-catalogue';
import { Partenaire } from 'src/app/models/partenaire';
import { AuthService } from 'src/app/services/auth.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { PartenaireService } from 'src/app/services/partenaire.service';
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
  evaluationCategoryEnum = EvaluationCategory;
  availableEvaluationCategories = Object.values(EvaluationCategory);
  formData = {
    id: null as any,
    name: '',
    description: '',
    image: '',
    logo: '',
    evaluationCategory: null as EvaluationCategory | null  // NOUVEAU

  };
  
  editId: any = null;
  selectedImage: File | null = null;
  selectedLogo?: File;

  currentModalStep: number = 1;
  sections: EvaluationSection[] = [];
  
  // Enum et catégories disponibles
  categoryEnum = Category;
  availableCategories = Object.values(Category);
  customCategories: string[] = [];
  
  // Partenaires
  allPartenaires: Partenaire[] = [];
  selectedPartenaires: Partenaire[] = [];
  
  // Catalogues
  catalogues: Array<{title: string, image: File | null, imagePreview: string | null}> = [];
  

  availableIcons: string[] = []; // Liste des icônes disponibles depuis Cloudinary
  loadingIcons = false; // État de chargement des icônes
  
  constructor(
    private evaluationservice: EvaluationService, 
    private partenaireService: PartenaireService,
    private authService: AuthService,
    private router: Router,
      private sanitizer: DomSanitizer  // ✅ AJOUTER CECI

  ) {}

  ngOnInit() {
    this.fetchEvaluations();
    this.fetchPartenaires();
    this.fetchAvailableIcons(); // ← AJOUTER CECI

  }

  fetchPartenaires() {
    this.loading = true;
    console.log('📡 Récupération des partenaires...');
    
    this.partenaireService.getPartenaire().subscribe(
      (response: any[]) => {
        console.log('✅ Réponse partenaires:', response);
        
        this.allPartenaires = response.map(p => new Partenaire(
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

  private initializeSections() {
    this.sections = [
      { headline: '', subtitle: '', details: [] },
      { headline: '', subtitle: '', details: [] },
      { headline: '', subtitle: '', details: [] },
      { headline: '', subtitle: '', details: [] }
    ];
  }

  fetchEvaluations() {
    this.loading = true;
    this.evaluationservice.getEvaluation().subscribe({
      next: (response: any[]) => {
        this.evaluations = response.map(data => new Evaluation(data));
        this.loading = false;
        console.log('Données reçuesss: ', this.evaluations);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des évaluations:', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors du chargement des données',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

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

  handleAdd() {
    this.modalMode = 'add';
    this.formData = {
      id: null,
      name: '',
      description: '',
      image: '',
      logo: '',
      evaluationCategory: null  // NOUVEAU
    };
    this.selectedImage = null;
    this.initializeSections();
    this.selectedPartenaires = [];
    this.catalogues = [];
    this.currentModalStep = 1;
    this.showModal = true;
  }

handleEdit(evaluation: Evaluation) {
  this.modalMode = 'edit';
  
  this.formData = {
    id: evaluation.Id,
    name: evaluation.Name || '',
    description: evaluation.Description || '',
    image: evaluation.Image || '',
    logo: evaluation.Logo || '',
    evaluationCategory: evaluation.Category || null
  };
  
  this.editId = evaluation.Id;
  this.selectedImage = null;
  
  // ✅ Correction: Garder les URLs des icônes existantes
  if (evaluation.Sections && evaluation.Sections.length > 0) {
    this.sections = evaluation.Sections.map(section => ({
      headline: section.headline || '',
      subtitle: section.subtitle || '',
      details: (section.details || []).map(detail => ({
        titre: detail.titre || '',
        description: detail.description || '',
        // ✅ CORRECTION ICI: Ne pas convertir les URLs en chaînes vides
        icon: detail.icon || null,  // Garder l'URL ou null
        category: detail.category || null
      }))
    }));
    
    while (this.sections.length < 4) {
      this.sections.push({ headline: '', subtitle: '', details: [] });
    }
  } else {
    this.initializeSections();
  }
  
  this.selectedPartenaires = evaluation.Partenaires ? [...evaluation.Partenaires] : [];
  
  if (evaluation.Catalogues && evaluation.Catalogues.length > 0) {
    this.catalogues = evaluation.Catalogues.map(cat => ({
      title: cat.Title,
      image: null,
      imagePreview: cat.Image
    }));
  } else {
    this.catalogues = [];
  }
  
  this.currentModalStep = 1;
  this.showModal = true;
}

  closeModal() {
    this.showModal = false;
    this.formData = {
      id: null,
      name: '',
      description: '',
      image: '',
      logo: '',
      evaluationCategory: null  // NOUVEAU
    };
    this.selectedImage = null;
    this.editId = null;
    this.sections = [];
    this.selectedPartenaires = [];
    this.catalogues = [];
    this.currentModalStep = 1;
  }

  handleDelete(id: any) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.evaluationservice.deleteEvaluation(id).subscribe({
          next: () => {
            this.evaluations = this.evaluations.filter(item => item.Id !== id);
            Swal.fire({
              title: 'Supprimé!',
              text: 'Évaluation supprimée avec succès',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            Swal.fire({
              icon: 'error',
              title: 'Erreur lors de la suppression',
              text: error.message || 'Une erreur est survenue',
              showConfirmButton: false,
              timer: 1500
            });
          }
        });
      }
    });
  }

addDetailToSection(sectionIndex: number) {
  if (this.sections[sectionIndex]) {
    this.sections[sectionIndex].details.push({
      titre: '',
      description: '',
      icon: null,  // ← CHANGÉ DE '' à null
      category: null
    });
  }
}

  removeDetailFromSection(sectionIndex: number, detailIndex: number) {
    if (this.sections[sectionIndex] && this.sections[sectionIndex].details[detailIndex]) {
      Swal.fire({
        title: 'Supprimer ce détail?',
        text: "Cette action est irréversible",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f44336',
        cancelButtonColor: '#666',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          this.sections[sectionIndex].details.splice(detailIndex, 1);
        }
      });
    }
  }

  addCustomCategory(sectionIndex: number, detailIndex: number) {
    Swal.fire({
      title: 'Ajouter une catégorie',
      input: 'text',
      inputPlaceholder: 'Nom de la catégorie',
      showCancelButton: true,
      confirmButtonText: 'Ajouter',
      cancelButtonText: 'Annuler',
      inputValidator: (value) => {
        if (!value) {
          return 'Veuillez entrer un nom de catégorie!';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const newCategory = result.value.trim();
        if (!this.customCategories.includes(newCategory)) {
          this.customCategories.push(newCategory);
        }
        this.sections[sectionIndex].details[detailIndex].category = newCategory as any;
      }
    });
  }

  getAllCategories(): string[] {
    return [...this.availableCategories, ...this.customCategories];
  }

  // Gestion des partenaires
  togglePartenaireSelection(partenaire: Partenaire) {
    const index = this.selectedPartenaires.findIndex(p => p.Id === partenaire.Id);
    if (index > -1) {
      this.selectedPartenaires.splice(index, 1);
    } else {
      this.selectedPartenaires.push(partenaire);
    }
  }

  isPartenaireSelected(partenaire: Partenaire): boolean {
    return this.selectedPartenaires.some(p => p.Id === partenaire.Id);
  }

  // Gestion des catalogues
  addCatalogue() {
    this.catalogues.push({
      title: '',
      image: null,
      imagePreview: null
    });
  }

  removeCatalogue(index: number) {
    Swal.fire({
      title: 'Supprimer ce catalogue?',
      text: "Cette action est irréversible",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f44336',
      cancelButtonColor: '#666',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.catalogues.splice(index, 1);
      }
    });
  }

  onCatalogueImageSelected(event: any, index: number) {
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
      
      this.catalogues[index].image = file;
      
      // Preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.catalogues[index].imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

handleSubmit() {
    // Vérification des champs obligatoires
    if (!this.formData.name || !this.formData.description || !this.formData.evaluationCategory) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs manquants',
        text: 'Veuillez remplir tous les champs obligatoires (nom, description et catégorie)',
        timer: 2000,
        showConfirmButton: false
      });
      this.currentModalStep = 1;
      return;
    }

    if (this.modalMode === 'add' && !this.selectedImage) {
      Swal.fire({
        icon: 'warning',
        title: 'Image manquante',
        text: 'Veuillez sélectionner une image',
        timer: 2000,
        showConfirmButton: false
      });
      this.currentModalStep = 1;
      return;
    }

    // Création de FormData
    const formData = new FormData();
    formData.append('name', this.formData.name);
    formData.append('description', this.formData.description);
    formData.append('evaluationCategory', this.formData.evaluationCategory!);

    if (this.selectedImage) {
      formData.append('image', this.selectedImage, this.selectedImage.name);
    }

    if (this.selectedLogo) {
      formData.append('logo', this.selectedLogo, this.selectedLogo.name);
    }

    // Collecter les fichiers d'icônes avant de créer le JSON des sections
    const iconFiles: (File | null)[] = [];
    
    this.sections.forEach(section => {
      (section.details || []).forEach(detail => {
        // Vérifier si detail.icon est un File ou une string
        if (detail.icon && typeof detail.icon !== 'string' && detail.icon instanceof File) {
          iconFiles.push(detail.icon);
        } else {
          iconFiles.push(null); // Pas de nouveau fichier pour ce detail
        }
      });
    });

    // Sections sécurisées (sans les fichiers d'icônes dans le JSON)
    const safeSections = this.sections.map(s => ({
      headline: s.headline || '',
      subtitle: s.subtitle || '',
      details: (s.details || []).map(d => ({
        titre: d.titre || '',
        description: d.description || '',
        icon: typeof d.icon === 'string' ? d.icon : '', // Garder l'URL existante ou vide
        category: d.category || null
      }))
    }));
    formData.append('sections', JSON.stringify(safeSections));

    // Ajouter les fichiers d'icônes dans l'ordre
    iconFiles.forEach(iconFile => {
      if (iconFile instanceof File) {
        formData.append('iconFiles', iconFile, iconFile.name);
      } else {
        // Ajouter un placeholder vide pour maintenir l'ordre
        const emptyBlob = new Blob([], { type: 'application/octet-stream' });
        formData.append('iconFiles', emptyBlob, '');
      }
    });

    // Partenaires sécurisés
    (this.selectedPartenaires || []).forEach(p => {
      if (p?.Id != null) formData.append('partenairesIds', p.Id.toString());
    });

    // Catalogues sécurisés
    (this.catalogues || []).forEach(cat => {
      if (cat.title) formData.append('catalogueTitles', cat.title);
      if (cat.image instanceof File) {
        formData.append('catalogueImages', cat.image, cat.image.name);
      }
    });

    // Envoi au service
    const request$ = this.modalMode === 'add' 
      ? this.evaluationservice.addEvaluation(formData) 
      : this.evaluationservice.putEvaluation(this.editId, formData);

    request$.subscribe({
      next: (response: any) => {
        const newEvaluation = new Evaluation({
          id: response.id,
          name: response.name,
          description: response.description,
          image: response.image,
          logo: response.logo,
          sections: response.sections || [],
          evaluationPartenaires: response.evaluationPartenaires || [],
          evaluationCatalogues: response.evaluationCatalogues || [],
          evaluationCategory: response.evaluationCategory || null
        });

        if (this.modalMode === 'add') {
          this.evaluations.push(newEvaluation);
        } else {
          const index = this.evaluations.findIndex(item => item.Id === this.editId);
          if (index !== -1) this.evaluations[index] = newEvaluation;
        }

        this.closeModal();
        Swal.fire({
          title: 'Succès!',
          text: this.modalMode === 'add' ? 'Évaluation ajoutée avec succès' : 'Évaluation modifiée avec succès',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => this.fetchEvaluations());
      },
      error: (error) => {
        console.error('Erreur:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: error?.message || 'Une erreur est survenue',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }



  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.authService.logout();

    Swal.fire({
      icon: 'info',
      title: 'Déconnexion',
      text: 'Vous êtes déconnecté',
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

  sanitizeImage(url: string | null): string {
    if (!url) return '';

    if (url.includes("https://res.cloudinary.com") && url.split("https://res.cloudinary.com").length > 2) {
      const parts = url.split("https://res.cloudinary.com/daxkymr4t/image/upload/");
      return "https://res.cloudinary.com/daxkymr4t/image/upload/" + parts[parts.length - 1];
    }

    return url;
  }

// Modifications dans le component TypeScript

// Dans la méthode handleSubmit(), remplacer la condition finale:
// Ligne: if (this.currentModalStep === 5)
// Par: if (this.currentModalStep === 7)

// 1. Modifier la progression pour inclure 7 steps au lieu de 5
  nextModalStep() {
    if (this.currentModalStep === 1) {
      if (!this.formData.name || !this.formData.description || !this.formData.evaluationCategory) {
        Swal.fire({
          icon: 'warning',
          title: 'Champs manquants',
          text: 'Veuillez remplir le nom, la description et sélectionner une catégorie',
          timer: 2000,
          showConfirmButton: false
        });
        return;
      }

      if (this.modalMode === 'add' && !this.selectedImage) {
        Swal.fire({
          icon: 'warning',
          title: 'Image manquante',
          text: 'Veuillez sélectionner une image',
          timer: 2000,
          showConfirmButton: false
        });
        return;
      }
    }


  // Validation des sections 1-4 (steps 2-5)
  if (this.currentModalStep >= 2 && this.currentModalStep <= 5) {
    const sectionIndex = this.currentModalStep - 2;
    const section = this.sections[sectionIndex];

  }
  
  // Step 7: Validation des catalogues
  if (this.currentModalStep === 7) {
    const incompleteCatalogues = this.catalogues.filter(cat => 
      !cat.title || (!cat.image && !cat.imagePreview)
    );
    
    if (incompleteCatalogues.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Catalogues incomplets',
        text: 'Veuillez remplir tous les champs des catalogues (titre et image)',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }
  }

  if (this.currentModalStep < 7) {
    this.currentModalStep++;
  }
  }

  previousModalStep() {
    if (this.currentModalStep > 1) {
      this.currentModalStep--;
    }
  }

  goToModalStep(step: number) {
    if (step <= this.currentModalStep) {
      this.currentModalStep = step;
    }
  }

countCompletedSections(): number {
  return this.sections.filter((s, index) => {
    // Vérifier seulement headline et details (subtitle est optionnel)
    if (!s.headline || s.details.length === 0) {
      return false;
    }
    
    // Vérifier seulement titre et icon (description et category sont optionnels)
    return s.details.every(d => d.titre && d.icon);
  }).length;
}



formatCategory(category: string): string {
  return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}


// Fonction pour gérer la sélection d'une icône
onIconSelected(event: any, detail: Details) {
  const file = event.target.files[0];
  
  if (file) {
    // Validation du type de fichier
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez sélectionner une image valide',
        timer: 1500,
        showConfirmButton: false
      });
      event.target.value = ''; // Reset input
      return;
    }
    
    // Validation de la taille (max 2MB pour les icônes)
    if (file.size > 200 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'L\'icône ne doit pas dépasser 2MB',
        timer: 1500,
        showConfirmButton: false
      });
      event.target.value = ''; // Reset input
      return;
    }
    
    // Stocker le fichier dans detail.icon
    detail.icon = file;
  }
}

// Fonction pour supprimer une icône
removeIcon(detail: Details) {
  detail.icon = null;
}

// Fonction pour vérifier si l'icône est une image
isImageIcon(icon: any): boolean {
  return icon instanceof File || (typeof icon === 'string' && icon.startsWith('http'));
}

// Fonction pour obtenir l'aperçu de l'icône
getIconPreview(icon: any): SafeUrl | string {
  if (!icon) return '';
  
  if (icon instanceof File) {
    const url = URL.createObjectURL(icon);
    return this.sanitizer.bypassSecurityTrustUrl(url);  // ✅ SANITIZE
  }
  
  if (typeof icon === 'string' && icon.startsWith('http')) {
    return icon;
  }
  
  return '';
}


fetchAvailableIcons() {
    this.loadingIcons = true;
    console.log('📡 Récupération des icônes disponibles...');
    
    this.evaluationservice.getAvailableIcons().subscribe({
      next: (icons: string[]) => {
        this.availableIcons = icons;
        this.loadingIcons = false;
        console.log('✅ Icônes disponibles:', this.availableIcons.length, icons);
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des icônes:', error);
        this.loadingIcons = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les icônes disponibles',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  // ✅ NOUVELLE MÉTHODE: Sélectionner une icône depuis la galerie
  selectIconFromGallery(iconUrl: string, detail: Details) {
    detail.icon = iconUrl;
    console.log('✅ Icône sélectionnée:', iconUrl);
  }

  // ✅ NOUVELLE MÉTHODE: Vérifier si une icône est déjà sélectionnée
  isIconSelected(iconUrl: string, detail: Details): boolean {
    return detail.icon === iconUrl;
  }


}