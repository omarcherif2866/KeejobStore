import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Evaluation, EvaluationSection, Category } from 'src/app/models/evaluation';
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

  formData = {
    id: null as any,
    name: '',
    description: '',
    image: ''
  };
  
  editId: any = null;
  selectedImage: File | null = null;
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
  


  
  constructor(
    private evaluationservice: EvaluationService, 
    private partenaireService: PartenaireService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchEvaluations();
    this.fetchPartenaires();
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
      image: ''
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
      image: evaluation.Image || ''
    };
    
    this.editId = evaluation.Id;
    this.selectedImage = null;
    
    if (evaluation.Sections && evaluation.Sections.length > 0) {
      this.sections = [...evaluation.Sections];
      while (this.sections.length < 4) {
        this.sections.push({ headline: '', subtitle: '', details: [] });
      }
    } else {
      this.initializeSections();
    }
    
    // Charger les partenaires sélectionnés
    this.selectedPartenaires = evaluation.Partenaires ? [...evaluation.Partenaires] : [];
    
    // Charger les catalogues existants
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
      image: ''
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
        icon: '',
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
  if (!this.formData.name || !this.formData.description) {
    Swal.fire({
      icon: 'warning',
      title: 'Champs manquants',
      text: 'Veuillez remplir tous les champs obligatoires',
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

  // Vérification des sections complètes
  const incompleteSections = this.sections.filter((s) => {
    if (!s.headline || !s.details || s.details.length === 0) return true;
    return s.details.some(d => !d.titre || !d.icon);
  });

  // if (incompleteSections.length > 0) {
  //   Swal.fire({
  //     icon: 'warning',
  //     title: 'Sections incomplètes',
  //     text: `Il reste ${incompleteSections.length} section(s) à compléter`,
  //     timer: 2000,
  //     showConfirmButton: false
  //   });
  //   return;
  // }

  // Création de FormData
  const formData = new FormData();
  formData.append('name', this.formData.name);
  formData.append('description', this.formData.description);

  if (this.selectedImage) {
    formData.append('image', this.selectedImage, this.selectedImage.name);
  }

  // Sections sécurisées
  const safeSections = this.sections.map(s => ({
    headline: s.headline || '',
    subtitle: s.subtitle || '',
    details: (s.details || []).map(d => ({
      titre: d.titre || '',
      description: d.description || '',
      icon: d.icon || '',
      category: d.category || null
    }))
  }));
  formData.append('sections', JSON.stringify(safeSections));

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
        sections: response.sections || [],
        evaluationPartenaires: response.evaluationPartenaires || [],
        evaluationCatalogues: response.evaluationCatalogues || []
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
    if (!this.formData.name || !this.formData.description) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs manquants',
        text: 'Veuillez remplir le nom et la description',
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
    
    // Vérifier seulement le headline (subtitle est optionnel maintenant)
    // if (!section.headline) {
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'Section incomplète',
    //     text: `Veuillez remplir le champ headline de la section ${sectionIndex + 1}`,
    //     timer: 2000,
    //     showConfirmButton: false
    //   });
    //   return;
    // }

    // if (section.details.length === 0) {
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'Détails manquants',
    //     text: `Veuillez ajouter au moins un détail à la section ${sectionIndex + 1}`,
    //     timer: 2000,
    //     showConfirmButton: false
    //   });
    //   return;
    // }

    // Vérification des champs - seulement titre et icône sont obligatoires
    // description et category sont optionnels
    // const missingFields = section.details.some(d => !d.titre || !d.icon);
    
    // if (missingFields) {
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'Détails incomplets',
    //     text: `Veuillez remplir les champs titre et icône pour la section ${sectionIndex + 1}`,
    //     timer: 2000,
    //     showConfirmButton: false
    //   });
    //   return;
    // }
  }

  // Step 6: Pas de validation obligatoire pour les partenaires (optionnel)
  
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
}