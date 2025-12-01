import { Partenaire } from "./partenaire";
import { SousFormationKeejob } from "./sous-formation-keejob";

export class FormationKeejob {
    private id : any
    private title: string;
    private description: string;
    private partenaires: Partenaire[] = [];
    private image: string;
    private sousFormations: SousFormationKeejob[] = []
  
    constructor(
      id: any,
      title: string,
      description: string,
      image: string,
      partenaires: Partenaire[] = [],
      sousFormations: SousFormationKeejob[] = []

    ) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.image = image;
      this.partenaires = partenaires;
      this.sousFormations = sousFormations;

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

    
  public get Partenaires(): Partenaire[] {
    return this.partenaires;
  }
  public set Partenaires(partenaires: Partenaire[]) {
    this.partenaires = partenaires;
  }

    public get SousFormationKeejob(): SousFormationKeejob[] {
    return this.sousFormations;
  }
  public set SousFormationKeejob(sousFormations: SousFormationKeejob[]) {
    this.sousFormations = sousFormations;
  }


         public get Image(): string {
      return this.image;
    }
  
    public set Image(image: string) {
      this.image = image;
    } 

  }

