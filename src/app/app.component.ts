
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Keejob Store';
  showTopBar = true;
  showFooter = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Masquer TopBar sur ActualiteComponent et FormateurComponent
        this.showTopBar = !(
          event.url.includes('/actualites') || event.url.includes('/formateurs')|| event.url.includes('/evaluations')|| event.url.includes('/formationFormateur')
          || event.url.includes('/serviceFormateur')||   event.url.match(/\/partenaire(\/|$)/) || event.url.includes('/formationKeejob')|| event.url === '/cv'
          || event.url === '/coaching'
        );
        this.showFooter = !(
          event.url.includes('/actualites') || event.url.includes('/formateurs')|| event.url.includes('/evaluations')|| event.url.includes('/formationFormateur')
          || event.url.includes('/serviceFormateur')||   event.url.match(/\/partenaire(\/|$)/) || event.url.includes('/formationKeejob')|| event.url === '/cv'
          || event.url === '/coaching'
        );
      }
    });
  }
}