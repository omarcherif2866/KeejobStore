import { Partenaire } from "./partenaire";


export interface Details {
  titre: string;
  description: string;
  icon: string;
}

export interface CoachingSection {
  headline: string;
  subtitle: string;
  details: Details[];
}

export interface PriceSection {
  title: string;
  subtitle: string;
  price: any;
  details: Details[];
}

export class Coaching {
  private id: any;
  private name: string | null;
  private titre: string | null;
  private sousTitre: string | null;
  private description: string | null;
  private image: string | null;
  private sections: CoachingSection[];
  private priceSections: PriceSection[];
  private cvPartenaires: Partenaire[] = [];

  constructor(data: any = {}) {
    this.id = data.id ?? null;
    this.name = data.name ?? null;
    this.titre = data.titre ?? null;
    this.sousTitre = data.sousTitre ?? null;
    this.description = data.description ?? null;
    this.image = data.image ?? null;
    this.sections = Array.isArray(data.sections) ? data.sections : [];
    this.priceSections = Array.isArray(data.priceSections) ? data.priceSections : [];
    this.cvPartenaires = Array.isArray(data.cvPartenaires) 
      ? data.cvPartenaires 
      : [];
  }

  // --- GETTERS & SETTERS --- //

  public get Id(): any {
    return this.id;
  }
  public set Id(value: any) {
    this.id = value;
  }

  public get Name(): string | null {
    return this.name;
  }
  public set Name(value: string | null) {
    this.name = value;
  }

  public get Titre(): string | null {
    return this.titre;
  }
  public set Titre(value: string | null) {
    this.titre = value;
  }

  public get SousTitre(): string | null {
    return this.sousTitre;
  }
  public set SousTitre(value: string | null) {
    this.sousTitre = value;
  }

  public get Description(): string | null {
    return this.description;
  }
  public set Description(value: string | null) {
    this.description = value;
  }

  public get Image(): string | null {
    return this.image;
  }
  public set Image(value: string | null) {
    this.image = value;
  }

  public get Sections(): CoachingSection[] {
    return this.sections;
  }
  public set Sections(value: CoachingSection[]) {
    this.sections = value;
  }

    public get PriceSection(): PriceSection[] {
    return this.priceSections;
  }
  public set PriceSection(value: PriceSection[]) {
    this.priceSections = value;
  }

  public get Partenaires(): Partenaire[] {
    return this.cvPartenaires;
  }
  public set Partenaires(cvPartenaires: Partenaire[]) {
    this.cvPartenaires = cvPartenaires;
  }

}
