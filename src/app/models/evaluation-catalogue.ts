export class EvaluationCatalogue {
  private id: any;
  private title: string;
  private image: string;
  private evaluationId: any; // On peut stocker juste l'id du formateur

  constructor(title: string, image: string) {
    this.title = title;
    this.image = image;
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

  public get Image(): string {
    return this.image;
  }
  public set Image(image: string) {
    this.image = image;
  }

  public get EvaluationId(): any {
    return this.evaluationId;
  }
  public set EvaluationId(evaluationId: any) {
    this.evaluationId = evaluationId;
  }
}


