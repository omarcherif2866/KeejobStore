import { FormationKeejob } from "./formation-keejob";

export class Partenaire {
    private id : any
    private name: string;
    private description: string;
    private formations: FormationKeejob[] = [];
    private image: string;
  
    constructor(
      id: any,
      name: string,
      description: string,
      image: string,
      formations: FormationKeejob[] = []
    ) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.image = image;
      this.formations = formations;
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

    
    public get Name(): string {
      return this.name;
    }
  
    public set Name(name: string) {
      this.name = name;
    }

    
  public get FormationKeejob(): FormationKeejob[] { return this.formations; }
  public set FormationKeejob(formations: FormationKeejob[]) { this.formations = formations; }


         public get Image(): string {
      return this.image;
    }
  
    public set Image(image: string) {
      this.image = image;
    } 

  }
