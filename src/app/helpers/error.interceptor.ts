import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { BadRequestContractModel } from '../common/bad-request-contract.model';
import { GenericErrorContractModel } from '../common/generic-error-contract.model';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(public router: Router,
        private authenticationService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                return throwError(err.error.mensagem);
            }
            if (err.status === 403) {
                this.authenticationService.logout();
                location.reload(true);
            }
            else if (err.status === 400) {
                var badRequestModel = new BadRequestContractModel();
                badRequestModel.campos = err.error.campos;
                badRequestModel.codigo = err.error.codigo;
                badRequestModel.mensagem = err.error.mensagem;

                return throwError(badRequestModel);
            } else if (err.status === 500) {
                var genericError = new GenericErrorContractModel();
                genericError.codigo = err.error.codigo;
                genericError.mensagem = err.error.mensagem;

                return throwError(genericError);
            } else {
                const error = err.message || err.statusText;
                return throwError(error);
            }
        }
        ))
    }
}