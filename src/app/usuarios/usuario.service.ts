import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from './usuario.model';
import { environment } from '../../environments/environment';
import { PageableContractModel } from '../common/pageable-contract.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { ChangePasswordModel } from './change-password.model';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsuarioService {

    constructor(private http: HttpClient,
        private authService: AuthService) { }

    findAllUsers(page: number, pageSize: number): Observable<PageableContractModel<UsuarioModel[]>> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.get<any>(`${environment.usuariosUrl}?page=${page}&page_size=${pageSize}`, httpOptions)
            .pipe(map((data: any) => {
                return data;
            }));
    }

    updateUser(id_usuario: string, usuario: UsuarioModel): Observable<UsuarioModel> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.put<any>(`${environment.usuariosUrl}/${id_usuario}`, usuario, httpOptions)
            .pipe(map((response: any) => {
                return response.data;
            }));
    }

    createUser(usuario: UsuarioModel): Observable<UsuarioModel> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post<any>(`${environment.usuariosUrl}`, usuario, httpOptions)
            .pipe(map((response: any) => {
                return response.data;
            }));
    }

    deleteUser(id_usuario: string): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.delete<any>(`${environment.usuariosUrl}/${id_usuario}`, httpOptions)
            .pipe(map((response: any) => {
                return response;
            }));
    }

    getUser(id_usuario: string): Observable<UsuarioModel> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.get<any>(`${environment.usuariosUrl}/${id_usuario}`, httpOptions)
            .pipe(map((response: any) => {
                return response.data;
            }));
    }

    changePassword(id_usuario: string, senha: ChangePasswordModel): Observable<boolean> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.put<any>(`${environment.usuariosUrl}/${id_usuario}/password`, senha, httpOptions)
            .pipe(map((response: any) => {
                return true;
            }));
    }

    uploadUserPhoto(id_usuario: string, image: File): Observable<boolean> {

        const formdata = new FormData();
        formdata.append('file', image)

        return this.http.post<any>(`${environment.usuariosUrl}/${id_usuario}/photo`, formdata)
            .pipe(map((response: any) => {
                return true;
            }));
    }

    getUserPhoto(id_usuario: string): string {
        return `${environment.usuariosUrl}/${id_usuario}/photo?Authorization=${this.authService.getToken()}`
    }
}