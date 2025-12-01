export class ServiceFormateur {
  private id: any;
  private title: string;
  private description: string;
  private formateur: any; // On peut stocker juste l'id du formateur

  constructor(title: string, description: string) {
    this.title = title;
    this.description = description;
  }

  public get Id(): any {
    return this.id;
  }
  public set Id(id: any) {
    this.id = id;
  }

  public get Title(): string {
    return this.title;
  }
  public set Title(title: string) {
    this.title = title;
  }

  public get Description(): string {
    return this.description;
  }
  public set Description(description: string) {
    this.description = description;
  }

  public get Formateur(): any {
    return this.formateur;
  }
  public set Formateur(formateur: any) {
    this.formateur = formateur;
  }
}

