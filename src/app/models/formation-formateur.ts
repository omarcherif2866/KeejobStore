export class FormationFormateur {
    private id : any
    private title: string;
    private description: string[];
    private formateur:any
  
    constructor(
      id: any,
      title: string,
      description: string[] = [],
      formateur: any,

    ) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.formateur = formateur;

    }
  
    public get Id(): any {
      return this.id;
    }

  
    public get Title(): string {
      return this.title;
    }
  
    public set Title(title: string) {
      this.title = title;
    }

    public get Formateur(): any {
      return this.formateur;
    }
  
    public set Formateur(formateur: any) {
      this.formateur = formateur;
    }

  public get Description(): string[] { return this.description; }
  public set Description(description: string[]) { this.description = description; }

  }

