import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = "http://localhost:9090/api/auth";
  private localStorageKey = "userAuth";   // stockage principal
  private loggedIn = new BehaviorSubject<boolean>(false);
  private jwtHelper = new JwtHelperService();

  constructor(private httpClient: HttpClient) {

    const userData = localStorage.getItem(this.localStorageKey);
    if (userData) {
      const parsed = JSON.parse(userData);
      this.loggedIn.next(!!parsed.accessToken);
    }
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  // -------------------- LOGIN --------------------
  login(loginData: { username: string; password: string }): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/login`, loginData).pipe(
      tap(response => {
        localStorage.setItem(this.localStorageKey, JSON.stringify(response));
        this.loggedIn.next(true);
      }),
      catchError(error => {
        console.error("Erreur de connexion:", error);
        return throwError(() => error);
      })
    );
  }

  // -------------------- LOGOUT --------------------
logout(): void {
  // Déclarer toutes les clés à supprimer
  const keysToRemove = ['userAuth', 'accessToken', 'userId', 'userRole'];

  // Boucler et supprimer chaque clé
  keysToRemove.forEach(key => localStorage.removeItem(key));

  // Mettre à jour l'état de connexion
  this.loggedIn.next(false);
}


  // -------------------- REGISTER --------------------
  addUser(user: any): Observable<User> {
    return this.httpClient.post<User>(`${this.apiUrl}/register`, user);
  }

  // -------------------- TOKEN --------------------
  getToken(): string | null {
    const userData = localStorage.getItem(this.localStorageKey);
    return userData ? JSON.parse(userData).accessToken : null;
  }

  getRoleFromToken(): string {
    const token = this.getToken();
    if (!token) return "vide";
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded?.role || "";
  }

  // -------------------- USER ID --------------------
  getUserIdFromToken(): number | null {
    const token = this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decoded = this.jwtHelper.decodeToken(token);
      return decoded?.id || null;
    }
    return null;
  }

  storeUserIdFromToken(): void {
    const id = this.getUserIdFromToken();
    if (id !== null) {
      localStorage.setItem('userId', id.toString());
    }
  }

  getUserId(): number | null {
    const id = localStorage.getItem('userId');
    return id ? Number(id) : null;
  }

  // -------------------- UPDATE USER --------------------
  updateUser(id: number, user: User): Observable<User> {
    return this.httpClient.put<User>(`${this.apiUrl}/${id}`, user, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }
}
