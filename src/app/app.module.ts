import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router'

import { ComponentsModule } from './components/components.module'
import { AppComponent } from './app.component'
import { BrowserModule } from '@angular/platform-browser'
import { SharedModule } from './pages/shared/shared.module';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { EvaluationCategoryComponent } from './pages/evaluation-category/evaluation-category.component';



const routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/home-page/home-page.module').then(
        (m) => m.HomePageModule
      ),
  },
{
  path: 'evaluation',
  loadChildren: () =>
    import('./pages/evaluation/evaluation.module').then(
      (m) => m.EvaluationModule
    ),
},
{
  path: 'centralTest',
  loadChildren: () =>
    import('./pages/central-test/central-test.module').then(
      (m) => m.CentralTestModule
    ),
},
{
  path: 'e-learning',
  loadChildren: () =>
    import('./pages/e-learning/e-learning.module').then(
      (m) => m.ELearningModule
    ),
},
{
  path: 'formation',
  loadChildren: () =>
    import('./pages/formation/formation.module').then(
      (m) => m.FormationModule
    ),
},
{
  path: 'certifications',
  loadChildren: () =>
    import('./pages/certifications/certifications.module').then(
      (m) => m.CertificationsModule
    ),
},
{
  path: 'cv_et_lettre_de_mottivation',
  loadChildren: () =>
    import('./pages/cv-lettre/cv-lettre.module').then(
      (m) => m.CvLettreModule
    ),
},
{
  path: 'coaching_emploi',
  loadChildren: () =>
    import('./pages/coaching-emploi/coaching-emploi.module').then(
      (m) => m.CoachingEmploiModule
    ),
},
{
  path: 'partenaires',
  loadChildren: () =>
    import('./pages/partenaires/partenaires.module').then(
      (m) => m.PartenairesModule
    ),
},
{
  path: 'international',
  loadChildren: () =>
    import('./pages/international/international.module').then(
      (m) => m.InternationalModule
    ),
},
{
  path: 'centre_formation',
  loadChildren: () =>
    import('./pages/centre-formation/centre-formation.module').then(
      (m) => m.CentreFormationModule
    ),
},
{
  path: 'formation_partenaire',
  loadChildren: () =>
    import('./pages/formation-partner/formation-partner.module').then(
      (m) => m.FormationPartnerModule
    ),
},
{
  path: 'register',
  loadChildren: () =>
    import('./pages/register/register.module').then(
      (m) => m.RegisterModule
    ),
},
{
  path: 'login',
  loadChildren: () =>
    import('./pages/login/login.module').then(
      (m) => m.LoginModule
    ),
},
{
  path: 'actualites',
  loadChildren: () =>
    import('./dashboard/actualite/actualite.module').then(
      (m) => m.ActualiteModule
    ),
},
{
  path: 'formateurs',
  loadChildren: () =>
    import('./dashboard/formateur/formateur.module').then(
      (m) => m.FormateurModule
    ),
},
{
  path: 'evaluations',
  loadChildren: () =>
    import('./dashboard/evaluation/evaluation.module').then(
      (m) => m.EvaluationModule
    ),
},
{
  path: 'cv',
  loadChildren: () =>
    import('./dashboard/cv/cv.module').then(
      (m) => m.CvModule
    ),
},
{
  path: 'coaching',
  loadChildren: () =>
    import('./dashboard/coaching/coaching.module').then(
      (m) => m.CoachingModule
    ),
},
{
  path: 'formationFormateur',
  loadChildren: () =>
    import('./dashboard/formation-formateur/formation-formateur.module').then(
      (m) => m.FormationFormateurModule
    ),
},
{
  path: 'serviceFormateur',
  loadChildren: () =>
    import('./dashboard/service-formateur/service-formateur.module').then(
      (m) => m.ServiceFormateurModule
    ),
},
{
  path: 'partenaire',
  loadChildren: () =>
    import('./dashboard/partenaire/partenaire.module').then(
      (m) => m.PartenaireModule
    ),
},
{
  path: 'formationKeejob',
  loadChildren: () =>
    import('./dashboard/formation-keejob/formation-keejob.module').then(
      (m) => m.FormationKeejobModule
    ),
},
{
  path: 'formateur',
  loadChildren: () =>
    import('./pages/all-formateur/all-formateur.module').then(
      (m) => m.AllFormateurModule
    ),
},
{
  path: 'formateur/:id',
  loadChildren: () =>
    import('./pages/formateur-details/formateur-details.module').then(
      (m) => m.FormateurDetailsModule
    ),
},
{
  path: 'evaluation/:id',
  loadChildren: () =>
    import('./pages/evaluation-details/evaluation-details.module').then(
      (m) => m.EvaluationDetailsModule
    ),
},
{
  path: 'cv/:id',
  loadChildren: () =>
    import('./pages/cv-details/cv-details.module').then(
      (m) => m.CvDetailsModule
    ),
},
{
  path: 'coachingDetails/:id',
  loadChildren: () =>
    import('./pages/coaching-details/coaching-details.module').then(
      (m) => m.CoachingDetailsModule
    ),
},
{
  path: 'allFormation',
  loadChildren: () =>
    import('./pages/all-formation-keejob/all-formation-keejob.module').then(
      (m) => m.AllFormationKeejobModule
    ),
},
{
  path: 'allCv',
  loadChildren: () =>
    import('./pages/all-cv/all-cv.module').then(
      (m) => m.AllCvModule
    ),
},
{
  path: 'allCoaching',
  loadChildren: () =>
    import('./pages/all-coaching/all-coaching.module').then(
      (m) => m.AllCoachingModule
    ),
},
{
  path: 'formation/:id',
  loadChildren: () =>
    import('./pages/formation-keejob-details/formation-keejob-details.module').then(
      (m) => m.FormationKeejobDetailsModule
    ),
},
{
  path: 'sousFormationKeejob',
  loadChildren: () =>
    import('./pages/sous-formation-keejob/sous-formation-keejob.module').then(
      (m) => m.SousFormationKeejobModule
    ),
},
{
  path: 'sousFormationKeejob/:id',
  loadChildren: () =>
    import('./pages/sous-formation-keejob-details/sous-formation-keejob-details.module').then(
      (m) => m.SousFormationKeejobDetailsModule
    ),
},
{
  path: 'profil',
  loadChildren: () =>
    import('./dashboard/profil/profil.module').then(
      (m) => m.ProfilModule
    ),
},
{
  path: 'forgot-password',
  loadChildren: () =>
    import('./pages/forget-password/forget-password.module').then(
      (m) => m.ForgetPasswordModule
    ),
},
{
  path: 'verify-code',
  loadChildren: () =>
    import('./pages/verify-code/verify-code.module').then(
      (m) => m.VerifyCodeModule
    ),
},
{
  path: 'reset-password',
  loadChildren: () =>
    import('./pages/reset-password/reset-password.module').then(
      (m) => m.ResetPasswordModule
    ),
},

{
  path: 'evaluation/category/:category',
  loadChildren: () =>
    import('./pages/evaluation-category/evaluation-category.module').then(
      (m) => m.EvaluationCategoryModule
    ),
},
  {
    path: '**',
    loadChildren: () =>
      import('./pages/not-found/not-found.module').then(
        (m) => m.NotFoundModule
      ),
  },
]

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    RouterModule.forRoot(routes), 
    ComponentsModule, 
    SharedModule,
    HttpClientModule, // <--- indispensable pour les services HttpClient
    FormsModule       // <--- indispensable pour [(ngModel)]
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
