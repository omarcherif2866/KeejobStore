export enum Role {
    SIMPLEU = "SIMPLEU",
    Admin = "Admin",

}



export class User {
    private id : any
    private email: string;
    private password: string;
    private blocked: Boolean;
    private username: string;
    private role: Role;

  
    constructor(
      id: any,
      email: string,
      password: string,
      blocked: Boolean,
      username: string,
      role: Role,

    ) {
      this.id = id;
      this.email = email;
      this.blocked = blocked;
      this.password = password;
      this.username = username;
      this.role = role;

    }
  
    public get Id(): any {
      return this.id;
    }

  
    public get Email(): string {
      return this.email;
    }
  
    public set Email(email: string) {
      this.email = email;
    }
  
    public get Password(): string {
      return this.password;
    }
  
    public set Password(password: string) {
      this.password = password;
    }
  
    public get Username(): string {
      return this.username;
    }
  
    public set Username(username: string) {
      this.username = username;
    }

    public get Role(): Role {
      return this.role;
    }
  
    public set Role(role: Role) {
      this.role = role;
    }

    
    public get Blocked(): Boolean {
      return this.blocked;
    }
  
    public set Blocked(blocked: Boolean) {
      this.blocked = blocked;
    }


    
  }