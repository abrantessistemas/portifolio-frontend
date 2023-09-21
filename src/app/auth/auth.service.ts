import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { TokenInfo } from './token-info.model';
import { JwtPayload } from './jwt-payload.model';
import * as jwt_decode from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private authenticationSubject: BehaviorSubject<JwtPayload>;
    public authentication: Observable<JwtPayload>;

    constructor(private http: HttpClient) {
        this.authenticationSubject = new BehaviorSubject<JwtPayload>(this.decodeToken());
        this.authentication = this.authenticationSubject.asObservable();
    }

    public getToken(): string {
        const token: string = localStorage.getItem('token');

        return token;
    }

    public getUsername(): string {
        let decodedToken: JwtPayload = this.decodeToken();

        return decodedToken.user_name;
    }

    public getUserId(): string {
        let decodedToken: JwtPayload = this.decodeToken();

        return decodedToken.user_id;
    }

    public getUserFullname(): string {
        let decodedToken: JwtPayload = this.decodeToken();

        return decodedToken.name;
    }

    public getUserRoles(): string[] {
        let decodedToken: JwtPayload = this.decodeToken();

        if (decodedToken)
            return decodedToken.authorities;
        else
            return [];
    }

    public isUserInRole(role: string): boolean {
        let roles = this.getUserRoles();

        if (roles) {
            return roles.filter(r => r === role).length > 0;
        } else
            return false;
    }

    public getTokenExpirationDate(token: string): Date {
        const decoded = this.decodeToken();

        if (decoded.exp === undefined) return null;

        const date = new Date(0);
        date.setUTCSeconds(decoded.exp);
        return date;
    }

    public isTokenExpired(): boolean {
        let token = this.getToken();
        if (!token) return true;

        const date = this.getTokenExpirationDate(token);
        if (date === undefined) return false;
        return !(date.valueOf() > new Date().valueOf());
    }

    public isMustChangePassword(): boolean {
        const decoded = this.decodeToken();

        return decoded.must_change_password;
    }

    logout() {
        localStorage.removeItem('token');
        this.authenticationSubject.next(null);
    }

    public isAuthenticated(): boolean {
        const decodedToken = this.decodeToken();
        // Check whether the token is expired and return
        // true or false
        return decodedToken != null && !this.isTokenExpired();
    }

    private decodeToken(): JwtPayload {
        let token = this.getToken();

        if (token) {
            let decodedToken = jwt_decode(token);

            return decodedToken;
        } else
            return null;
    }

    login(username: string, password: string) {
        let body = `grant_type=password&username=${username}&password=${password}&client_id=${environment.clientId}&client_secret=${environment.clientSecret}`;

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        };

        return this.http.post<any>(`${environment.oAuthTokenUrl}`, body, httpOptions)
            .pipe(map((data: TokenInfo) => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('token', data.access_token);
                this.authenticationSubject.next(data);

                return data;
            }));
    }
}