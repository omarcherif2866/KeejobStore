import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Coaching, CoachingSection } from 'src/app/models/coaching';
import { PriceSection } from 'src/app/models/cv';
import { Partenaire } from 'src/app/models/partenaire';
import { AuthService } from 'src/app/services/auth.service';
import { CoachingService } from 'src/app/services/coaching.service';
import { PartenaireService } from 'src/app/services/partenaire.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-coaching',
  templateUrl: './coaching.component.html',
  styleUrls: ['./coaching.component.css']
})
export class CoachingComponent implements OnInit {
  sidebarOpen = true;
  coachings: Coaching[] = [];
  loading = false;
  currentPage = 1;
  itemsPerPage = 5;
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';

  formData = {
    id: null as any,
    name: '',
    titre: '',
    sousTitre: '',
    description: '',
    image: ''
  };
  
  editId: any = null;
  selectedImage: File | null = null;
  currentModalStep: number = 1;
  sections: CoachingSection[] = [];
  
  // NOUVEAU : Gestion des PriceSections
  priceSections: PriceSection[] = [];
  
  // Partenaires
  allPartenaires: Partenaire[] = [];
  selectedPartenaires: Partenaire[] = [];

  constructor(
    private coachingservice: CoachingService, 
    private partenaireService: PartenaireService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchCoachings();
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
    // 4 sections normales + 1 section pour les prix
    this.sections = [
      { headline: '', subtitle: '', details: [] },
      { headline: '', subtitle: '', details: [] },
      { headline: '', subtitle: '', details: [] },
      { headline: '', subtitle: '', details: [] }
    ];
  }

  // NOUVEAU : Initialiser les priceSections
  private initializePriceSections() {
    this.priceSections = [
      {
        title: '',
        subtitle: '',
        price: '',
        details: []
      }
    ];
  }

  fetchCoachings() {
    this.loading = true;
    this.coachingservice.getCoaching().subscribe({
      next: (response: any[]) => {
        this.coachings = response.map(data => new Coaching(data));
        this.loading = false;
        console.log('Données reçues: ', this.coachings);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des Coaching:', error);
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

  get currentItems(): Coaching[] {
    const indexOfLastItem = this.currentPage * this.itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - this.itemsPerPage;
    return this.coachings.slice(indexOfFirstItem, indexOfLastItem);
  }

  get totalPages(): number {
    return Math.ceil(this.coachings.length / this.itemsPerPage);
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
    titre: '',
    sousTitre: '',
    description: '',
    image: ''
    };
    this.selectedImage = null;
    this.initializeSections();
    this.initializePriceSections(); // NOUVEAU
    this.selectedPartenaires = [];
    this.currentModalStep = 1;
    this.showModal = true;
  }

  handleEdit(Coaching: Coaching) {
    this.modalMode = 'edit';
    
    this.formData = {
      id: Coaching.Id,
      name: Coaching.Name || '',
      titre: Coaching.Titre || '',
      sousTitre: Coaching.SousTitre || '',

      description: Coaching.Description || '',
      image: Coaching.Image || ''
    };
    
    this.editId = Coaching.Id;
    this.selectedImage = null;
    
    if (Coaching.Sections && Coaching.Sections.length > 0) {
      this.sections = [...Coaching.Sections];
      while (this.sections.length < 4) {
        this.sections.push({ headline: '', subtitle: '', details: [] });
      }
    } else {
      this.initializeSections();
    }
    
    // NOUVEAU : Charger les priceSections
    if (Coaching.PriceSection && Coaching.PriceSection.length > 0) {
      this.priceSections = [...Coaching.PriceSection];
    } else {
      this.initializePriceSections();
    }
    
    this.selectedPartenaires = Coaching.Partenaires ? [...Coaching.Partenaires] : [];
    
    this.currentModalStep = 1;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.formData = {
      id: null,
    name: '',
    titre: '',
    sousTitre: '',
    description: '',
    image: ''
    };
    this.selectedImage = null;
    this.editId = null;
    this.sections = [];
    this.priceSections = []; // NOUVEAU
    this.selectedPartenaires = [];
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
        this.coachingservice.deleteCoaching(id).subscribe({
          next: () => {
            this.coachings = this.coachings.filter(item => item.Id !== id);
            Swal.fire({
              title: 'Supprimé!',
              text: 'Coaching supprimé avec succès',
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
        icon: ''
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

  // NOUVEAU : Méthodes pour gérer les PriceSections
  addPriceSection() {
    this.priceSections.push({
      title: '',
      subtitle: '',
      price: '',
      details: []
    });
  }

  removePriceSection(index: number) {
    Swal.fire({
      title: 'Supprimer ce pack?',
      text: "Cette action est irréversible",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f44336',
      cancelButtonColor: '#666',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.priceSections.splice(index, 1);
      }
    });
  }

  addDetailToPriceSection(priceSectionIndex: number) {
    if (this.priceSections[priceSectionIndex]) {
      this.priceSections[priceSectionIndex].details.push({
        titre: '',
        description: '',
        icon: ''
      });
    }
  }

  removeDetailFromPriceSection(priceSectionIndex: number, detailIndex: number) {
    if (this.priceSections[priceSectionIndex] && 
        this.priceSections[priceSectionIndex].details[detailIndex]) {
      Swal.fire({
        title: 'Supprimer cette fonctionnalité?',
        text: "Cette action est irréversible",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f44336',
        cancelButtonColor: '#666',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          this.priceSections[priceSectionIndex].details.splice(detailIndex, 1);
        }
      });
    }
  }

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

handleSubmit() {
  if (!this.formData.name) {
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

  const formData = new FormData();
  formData.append('name', this.formData.name);
  formData.append('titre', this.formData.titre);
  formData.append('sousTitre', this.formData.sousTitre);

  formData.append('description', this.formData.description);

  if (this.selectedImage) {
    formData.append('image', this.selectedImage, this.selectedImage.name);
  }

  // 🔍 LOG 1: Vérifier this.sections AVANT mapping
  console.log('🔍 this.sections AVANT mapping:', this.sections);
  

  this.priceSections = this.priceSections.map(ps => ({
    ...ps,
    price: ps.price
      ? parseFloat(ps.price.toString().replace(',', '.'))
      : 0
  }));

  // Sections normales (4 premières) - avec "headline"
  const safeSections = this.sections.map(s => ({
    headline: s.headline || '',
    subtitle: s.subtitle || '',
    details: (s.details || []).map(d => ({
      titre: d.titre || '',
      description: d.description || '',
      icon: d.icon || ''
    }))
  }));
  
  // 🔍 LOG 2: Vérifier safeSections APRÈS mapping
  console.log('📦 safeSections (DOIT avoir headline):', JSON.stringify(safeSections, null, 2));
  formData.append('sections', JSON.stringify(safeSections));

  // 🔍 LOG 3: Vérifier this.priceSections AVANT mapping
  console.log('🔍 this.priceSections AVANT mapping:', this.priceSections);
  
  // PriceSections - avec "title" (PAS headline)
  const safePriceSections = this.priceSections.map(ps => ({
    title: ps.title || '',
    subtitle: ps.subtitle || '',
    price: ps.price || '',
    details: (ps.details || []).map(d => ({
      titre: d.titre || '',
      description: d.description || '',
      icon: d.icon || ''
    }))
  }));
  
  // 🔍 LOG 4: Vérifier safePriceSections APRÈS mapping
  console.log('💰 safePriceSections (DOIT avoir title):', JSON.stringify(safePriceSections, null, 2));
  formData.append('priceSections', JSON.stringify(safePriceSections));

  // 🔍 LOG 5: Afficher TOUT le FormData
  console.log('📤 === CONTENU COMPLET DU FORMDATA ===');
  formData.forEach((value, key) => {
    if (key === 'sections') {
      console.log(`  ✅ sections:`, JSON.parse(value as string));
    } else if (key === 'priceSections') {
      console.log(`  ✅ priceSections:`, JSON.parse(value as string));
    } else if (key === 'image') {
      console.log(`  ✅ ${key}:`, value);
    } else {
      console.log(`  ✅ ${key}:`, value);
    }
  });

  // Partenaires
  (this.selectedPartenaires || []).forEach(p => {
    if (p?.Id != null) formData.append('partenairesIds', p.Id.toString());
  });

  const request$ = this.modalMode === 'add' 
    ? this.coachingservice.addCoaching(formData) 
    : this.coachingservice.putCoaching(this.editId, formData);

  request$.subscribe({
    next: (response: any) => {
      console.log('✅ Réponse backend:', response);
      
      const newCoaching = new Coaching({
        id: response.id,
        name: response.name,
        titre: response.titre,
        sousTitre: response.sousTitre,

        description: response.description,
        image: response.image,
        sections: response.sections || [],
        priceSection: response.priceSections || [],
        evaluationPartenaires: response.CoachingPartenaires || []
      });

      if (this.modalMode === 'add') {
        this.coachings.push(newCoaching);
      } else {
        const index = this.coachings.findIndex(item => item.Id === this.editId);
        if (index !== -1) this.coachings[index] = newCoaching;
      }

      this.closeModal();
      Swal.fire({
        title: 'Succès!',
        text: this.modalMode === 'add' ? 'Coaching ajouté avec succès' : 'Coaching modifié avec succès',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      }).then(() => this.fetchCoachings());
    },
    error: (error) => {
      console.error('❌ === ERREUR DÉTAILLÉE ===');
      console.error('❌ Error object:', error);
      console.error('❌ Error message:', error?.error?.message || error?.message);
      console.error('❌ Error status:', error?.status);
      console.error('❌ Full error:', JSON.stringify(error, null, 2));
      
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error?.error?.message || error?.message || 'Une erreur est survenue',
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

  nextModalStep() {
    if (this.currentModalStep === 1) {
      if (!this.formData.name) {
        Swal.fire({
          icon: 'warning',
          title: 'Champs manquants',
          text: 'Veuillez remplir le nom',
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
    return this.sections.filter((s) => {
      if (!s.headline || s.details.length === 0) {
        return false;
      }
      return s.details.every(d => d.titre && d.icon);
    }).length;
  }

  countCompletedPriceSections(): number {
    return this.priceSections.filter((ps) => {
      return ps.title && ps.price;
    }).length;
  }
}