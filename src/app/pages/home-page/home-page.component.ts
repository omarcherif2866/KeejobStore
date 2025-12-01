import { Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { Router } from '@angular/router';
import { Formateur } from 'src/app/models/formateur';
import { FormateurService } from 'src/app/services/formateur.service';
import Swal from 'sweetalert2';
export interface Expert {
  name: string;
  profession: string;
  hours: string;
  mode: string;
  avatarColor: string;
  
}
@Component({
  selector: 'home-page',
  templateUrl: 'home-page.component.html',
  styleUrls: ['home-page.component.css'],
})
export class HomePage implements OnInit{
    formateurs: Formateur[] = [];
    loading = false;
searchActive = false;

experts = [
  { name: "David Aplegate", profession: "Professeur en MBA", hours: "24+ h taught", mode: "video chat", color: "#F5F5F5", avatarColor: "#B5C4DE", avatar: "../../assets/image3077112-6q95-300h.png"},
  { name: "Maria Vawda", profession: "Expert en finance d'entreprise", hours: "24+ h taught", mode: "video chat", color: "#F5F5F5", avatarColor: "#9ED4DC", avatar: "../../assets/image3097112-8rce-300w.png"},
  { name: "Angelina Elrick", profession: "Experte en Marketing ", hours: "24+ h taught", mode: "video chat", color: "#F5F5F5", avatarColor: "#DFF5A0", avatar: "../../assets/image3117112-vsbr-300w.png"},
  { name: "Helina Sue", profession: "coach en développement personnel", hours: "20+ h taught", mode: "video chat", color: "#F5F5F5", avatarColor: "#AD96EF", avatar: "../../assets/image3107112-1gss-300h.png"}
];


coursPopulaires = [
  {
    titre: 'Cours Populaires',
    description: 'Ces cours sont généralement suivis par les demandeurs d’emploi qui cherchent à améliorer leurs compétences',
    icone: '../../assets/book.svg',
    couleur: 'rgba(78, 142, 201, 1)'
  },
  {
    titre: 'Meilleurs Formations',
    description: 'Ces formations conçues pour vous fournir une base solide.',
    icone: '../../assets/formationIcon.svg',
    couleur: '#72B656'
  },
  {
    titre: 'Certifications',
    description: 'Egestas faucibus nisl et ultricies. Tempus lectus condimentum tristique mauris id vitae. Id pulvinar eget vitae.',
    icone: '../../assets/certifIcon.svg',
    couleur: '#EE7F50'
  }
];


  constructor(private title: Title, private formateurservice: FormateurService, private router:Router) {
    this.title.setTitle('Keejob Store')
  }


    ngOnInit() {
    this.fetchFormateurs();
  }
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
sanitizeImage(url: string): string {
  if (!url) return '';

  // Cas où l'URL est en double
  if (url.includes("https://res.cloudinary.com") && url.split("https://res.cloudinary.com").length > 2) {
    const parts = url.split("https://res.cloudinary.com/daxkymr4t/image/upload/");
    return "https://res.cloudinary.com/daxkymr4t/image/upload/" + parts[parts.length - 1];
  }

  return url;
}

  toggleSearch() {
  this.searchActive = !this.searchActive;
}
}
