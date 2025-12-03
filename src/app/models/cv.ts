import { Partenaire } from "./partenaire";


export interface Details {
  titre: string;
  description: string;
  icon: string;
}

export interface CvSection {
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

export class Cv {
  private id: any;
  private name: string | null;
  private description: string | null;
  private image: string | null;
  private sections: CvSection[];
  private priceSections: PriceSection[];
  private cvPartenaires: Partenaire[] = [];

  constructor(data: any = {}) {
    this.id = data.id ?? null;
    this.name = data.name ?? null;
    this.description = data.description ?? null;
    this.image = data.image ?? null;
    this.sections = Array.isArray(data.sections) ? data.sections : [];
    this.priceSections = Array.isArray(data.priceSection) ? data.priceSection : [];
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

  public get Sections(): CvSection[] {
    return this.sections;
  }
  public set Sections(value: CvSection[]) {
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
