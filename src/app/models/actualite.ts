export class Actualite {
    private id : any
    private date: string;
    private description: string;
    private heure: string;
    private title: string;
    private image: string;

  
    constructor(
      id: any,
      title: string,
      description: string,
      date: string,
      heure: string,
      image: string,

    ) {
      this.id = id;
      this.date = date;
      this.heure = heure;
      this.description = description;
      this.title = title;
      this.image = image;

    }
  
    public get Id(): any {
      return this.id;
    }

  
    public get Date(): string {
      return this.date;
    }
  
    public set Date(date: string) {
      this.date = date;
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

    
    public get Heure(): string {
      return this.heure;
    }
  
    public set Heure(heure: string) {
      this.heure = heure;
    }

         public get Image(): string {
      return this.image;
    }
  
    public set Image(image: string) {
      this.image = image;
    } 

    
  }