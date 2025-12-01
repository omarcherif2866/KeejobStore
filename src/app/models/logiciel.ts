
import { SousFormationKeejob } from "./sous-formation-keejob";

export class Logiciel {
    private id : any
    private name: string;
    private sousFormations: SousFormationKeejob[] = []
    private image: string;
  
    constructor(
      id: any,
      name: string,
      image: string,
      sousFormations: SousFormationKeejob[] = []
    ) {
      this.id = id;
      this.name = name;
      this.image = image;
      this.sousFormations = sousFormations;
    }

  
    public get Id(): any {
      return this.id;
    }


    public get Name(): string {
      return this.name;
    }
  
    public set Name(name: string) {
      this.name = name;
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
