import { FormationKeejob } from "./formation-keejob";
import { Logiciel } from "./logiciel";
import { Partenaire } from "./partenaire";

// ✅ Créer l'interface DetailObject
export interface DetailObject {
  titre: string;
  description: string;
  icon: string;
}

export class SousFormationKeejob {
    private id: any;
    private title: string;
    private description: string;
    private sousFormationPartenaires: Partenaire[] = [];
    private formationKeejob: FormationKeejob;
    private image: string;
    private titleLogiciel: string
    private sousFormationLogiciel: Logiciel[] = [];
    private details: DetailObject[] = []; // ✅ Ajout de l'attribut details

    constructor(
      id: any,
      title: string,
      description: string,
      image: string,
      titleLogiciel: string,
      sousFormationPartenaires: Partenaire[] = [],
      sousFormationLogiciel: Logiciel[] = [],
      formationKeejob: FormationKeejob,
      details: DetailObject[] = [] // ✅ Ajout dans le constructeur
    ) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.image = image;
      this.sousFormationPartenaires = sousFormationPartenaires;
      this.sousFormationLogiciel = sousFormationLogiciel;
      this.formationKeejob = formationKeejob;
      this.details = details; // ✅ Initialisation
      this.titleLogiciel = titleLogiciel; // ✅ Initialisation

    }

    public get Id(): any {
      return this.id;
    }

    public get Description(): string {
      return this.description;
    }

    public set Description(description: string) {
      this.description = description;
    }

    public get Title(): string {
      return this.title;
    }

    public set Title(title: string) {
      this.title = title;
    }

    public get TitleLogiciel(): string {
      return this.titleLogiciel;
    }

    public set TitleLogiciel(titleLogiciel: string) {
      this.titleLogiciel = titleLogiciel;
    }

    public get Partenaires(): Partenaire[] {
      return this.sousFormationPartenaires;
    }

    public set Partenaires(sousFormationPartenaires: Partenaire[]) {
      this.sousFormationPartenaires = sousFormationPartenaires;
    }

    public get Image(): string {
      return this.image;
    }

    public set Image(image: string) {
      this.image = image;
    }

    public get FormationKeejob(): FormationKeejob {
      return this.formationKeejob;
    }

    public set FormationKeejob(formationKeejob: FormationKeejob) {
      this.formationKeejob = formationKeejob;
    }

    public get Logiciels(): Logiciel[] {
      return this.sousFormationLogiciel;
    }

    public set Logiciels(logiciels: Logiciel[]) {
      this.sousFormationLogiciel = logiciels;
    }

    // ✅ Getter et Setter pour details
    public get Details(): DetailObject[] {
      return this.details;
    }

    public set Details(details: DetailObject[]) {
      this.details = details;
    }
}