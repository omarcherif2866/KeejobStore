import { FormationFormateur } from "./formation-formateur";
import { ServiceFormateur } from "./service-formateur";
import { TitleWhy } from "./title-why";

export class Formateur {
    private id : any
    private address: string;
    private description: string;
    private email: string;
    private phone: string;
    private experience: string;
    private poste: string;
    private firstName: string;
    private lastName: string;
    private university: string;
    private image: string;
    private servicesFormateurs: ServiceFormateur[] = [];
    private titleWhyList: TitleWhy[] = [];
    private formationFormateurs: FormationFormateur[] = [];
  
    constructor(
      id: any,
      phone: string,
      description: string,
      address: string,
      email: string,
      experience: string,
      poste: string,
      firstName: string,
      lastName: string,
      university: string,
      image: string,
      servicesFormateurs: ServiceFormateur[] = [],
      titleWhyList: TitleWhy[] = [],
      formationFormateurs: FormationFormateur[] = []

    ) {
      this.id = id;
      this.address = address;
      this.email = email;
      this.description = description;
      this.phone = phone;
      this.address = address;
      this.experience = experience;
      this.poste = poste;
      this.firstName = firstName;
      this.lastName = lastName;
      this.university = university;
      this.image = image;
    this.servicesFormateurs = servicesFormateurs;
    this.titleWhyList = titleWhyList;
    this.formationFormateurs = formationFormateurs;

    }
  
    public get Id(): any {
      return this.id;
    }

  
    public get Address(): string {
      return this.address;
    }
  
    public set Address(address: string) {
      this.address = address;
    }
  
    public get Description(): string {
      return this.description;
    }
  
    public set Description(description: string) {
      this.description = description;
    }
  
    public get Phone(): string {
      return this.phone;
    }
  
    public set Phone(phone: string) {
      this.phone = phone;
    }

    
    public get Email(): string {
      return this.email;
    }
  
    public set Email(email: string) {
      this.email = email;
    }

    public get Experience(): string {
      return this.experience;
    }
  
    public set Experience(experience: string) {
      this.experience = experience;
    }    

        public get Poste(): string {
      return this.poste;
    }
  
    public set Poste(poste: string) {
      this.poste = poste;
    }    

        public get LastName(): string {
      return this.lastName;
    }
  
    public set LastName(lastName: string) {
      this.lastName = lastName;
    }    

        public get FirstName(): string {
      return this.firstName;
    }
  
    public set FirstName(firstName: string) {
      this.firstName = firstName;
    }    

         public get University(): string {
      return this.university;
    }
  
    public set University(university: string) {
      this.university = university;
    } 
    
  public get ServicesFormateurs(): ServiceFormateur[] { return this.servicesFormateurs; }
  public set ServicesFormateurs(services: ServiceFormateur[]) { this.servicesFormateurs = services; }

  public get TitleWhyList(): TitleWhy[] { return this.titleWhyList; }
  public set TitleWhyList(titleWhyList: TitleWhy[]) { this.titleWhyList = titleWhyList; }

  public get FormationFormateur(): FormationFormateur[] { return this.formationFormateurs; }
  public set FormationFormateur(formationFormateurs: FormationFormateur[]) { this.formationFormateurs = formationFormateurs; }

         public get Image(): string {
      return this.image;
    }
  
    public set Image(image: string) {
      this.image = image;
    } 

  }
