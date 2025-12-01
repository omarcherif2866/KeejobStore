import { EvaluationDescription } from "./evaluation-description";

export class Evaluation {
    private id : any
    private name: string;
    private description: string;
    private title: string;
    private subTitle: string;
    private evaluationDescriptions: EvaluationDescription[] = [];
    private image: string;
  
    constructor(
      id: any,
      name: string,
      description: string,
      title: string,
      subTitle: string,
      image: string,
      evaluationDescriptions: EvaluationDescription[] = []
    ) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.title = title;
      this.subTitle = subTitle;
      this.image = image;
      this.evaluationDescriptions = evaluationDescriptions;
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
  
    public get Description(): string {
      return this.description;
    }
  
    public set Description(description: string) {
      this.description = description;
    }
  
    public get SubTitle(): string {
      return this.subTitle;
    }
  
    public set SubTitle(subTitle: string) {
      this.subTitle = subTitle;
    }

    
    public get Title(): string {
      return this.title;
    }
  
    public set Title(title: string) {
      this.title = title;
    }

    
  public get EvaluationDescriptions(): EvaluationDescription[] { return this.evaluationDescriptions; }
  public set EvaluationDescriptions(services: EvaluationDescription[]) { this.evaluationDescriptions = services; }


         public get Image(): string {
      return this.image;
    }
  
    public set Image(image: string) {
      this.image = image;
    } 

  }
