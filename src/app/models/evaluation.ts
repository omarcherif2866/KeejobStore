// import { EvaluationDescription } from "./evaluation-description";

import { EvaluationCatalogue } from "./evaluation-catalogue";
import { Partenaire } from "./partenaire";

// export class Evaluation {
//     private id : any
//     private name: string;
//     private description: string;
//     private title: string;
//     private subTitle: string;
//     private evaluationDescriptions: EvaluationDescription[] = [];
//     private image: string;
  
//     constructor(
//       id: any,
//       name: string,
//       description: string,
//       title: string,
//       subTitle: string,
//       image: string,
//       evaluationDescriptions: EvaluationDescription[] = []
//     ) {
//       this.id = id;
//       this.name = name;
//       this.description = description;
//       this.title = title;
//       this.subTitle = subTitle;
//       this.image = image;
//       this.evaluationDescriptions = evaluationDescriptions;
//     }

  
//     public get Id(): any {
//       return this.id;
//     }

  
//     public get Name(): string {
//       return this.name;
//     }
  
//     public set Name(name: string) {
//       this.name = name;
//     }
  
//     public get Description(): string {
//       return this.description;
//     }
  
//     public set Description(description: string) {
//       this.description = description;
//     }
  
//     public get SubTitle(): string {
//       return this.subTitle;
//     }
  
//     public set SubTitle(subTitle: string) {
//       this.subTitle = subTitle;
//     }

    
//     public get Title(): string {
//       return this.title;
//     }
  
//     public set Title(title: string) {
//       this.title = title;
//     }

    
//   public get EvaluationDescriptions(): EvaluationDescription[] { return this.evaluationDescriptions; }
//   public set EvaluationDescriptions(services: EvaluationDescription[]) { this.evaluationDescriptions = services; }


//          public get Image(): string {
//       return this.image;
//     }
  
//     public set Image(image: string) {
//       this.image = image;
//     } 

//   }


export enum Category {
  TEST_PERSONNALITE = 'Test de personnalité',
  TEST_BUREAUTIQUE = 'Test bureautique',
  TEST_APTITUDE = "Test d'aptitude"
}

export interface Details {
  titre: string;
  description: string;
  icon: string;
  category: Category | null;
}

export interface EvaluationSection {
  headline: string;
  subtitle: string;
  details: Details[];
}

export class Evaluation {
  private id: any;
  private name: string | null;
  private description: string | null;
  private image: string | null;
  private sections: EvaluationSection[];
  private evaluationPartenaires: Partenaire[] = [];
  private evaluationCatalogues: EvaluationCatalogue[] = [];

  constructor(data: any = {}) {
    this.id = data.id ?? null;
    this.name = data.name ?? null;
    this.description = data.description ?? null;
    this.image = data.image ?? null;
    this.sections = Array.isArray(data.sections) ? data.sections : [];
    this.evaluationPartenaires = Array.isArray(data.evaluationPartenaires) 
      ? data.evaluationPartenaires 
      : [];
    this.evaluationCatalogues = Array.isArray(data.evaluationCatalogues)
      ? data.evaluationCatalogues.map((cat: any) => {
          const catalogue = new EvaluationCatalogue(cat.title || '', cat.image || '');
          catalogue.Id = cat.id;
          catalogue.EvaluationId = this.id;
          return catalogue;
        })
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

  public get Sections(): EvaluationSection[] {
    return this.sections;
  }
  public set Sections(value: EvaluationSection[]) {
    this.sections = value;
  }

  public get Partenaires(): Partenaire[] {
    return this.evaluationPartenaires;
  }
  public set Partenaires(evaluationPartenaires: Partenaire[]) {
    this.evaluationPartenaires = evaluationPartenaires;
  }

  public get Catalogues(): EvaluationCatalogue[] {
    return this.evaluationCatalogues;
  }
  public set Catalogues(evaluationCatalogues: EvaluationCatalogue[]) {
    this.evaluationCatalogues = evaluationCatalogues;
  }
}