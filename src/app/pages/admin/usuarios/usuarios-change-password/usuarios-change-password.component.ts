import { Component, Inject, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import icClose from '@iconify/icons-ic/twotone-close';
import { UsuarioModel } from 'src/app/usuarios/usuario.model';
import { UsuarioService } from 'src/app/usuarios/usuario.service';
import icFingerPrint from '@iconify/icons-ic/twotone-fingerprint';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import { Subscription } from 'rxjs';
import { BadRequestContractModel } from 'src/app/common/bad-request-contract.model';
import { GenericErrorContractModel } from 'src/app/common/generic-error-contract.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangePasswordModel } from 'src/app/usuarios/change-password.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'vex-usuarios-change-password',
  templateUrl: './usuarios-change-password.component.html',
  styleUrls: ['./usuarios-change-password.component.scss']
})
export class UsuariosChangePasswordComponent implements OnInit, OnDestroy {

  form: FormGroup;

  icClose = icClose;
  icVisibility = icVisibility;
  icVisibilityOff = icVisibilityOff;
  icFingerPrint = icFingerPrint;

  inputType = 'password';
  passwordVisible = false;
  isMaster = false;

  private subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: UsuarioModel,
    private dialogRef: MatDialogRef<UsuariosChangePasswordComponent>,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar) {
  }

  ngOnInit() {

    this.isMaster = this.authService.isUserInRole('MASTER');

    this.form = this.fb.group({
      senha_atual: (this.isMaster ? 'empty' : ''),
      nova_senha: ''
    });
  }

  togglePassword() {
    if (this.passwordVisible) {
      this.inputType = 'password';
      this.passwordVisible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.passwordVisible = true;
      this.cd.markForCheck();
    }
  }

  changePassword() {
    const passwordModel: ChangePasswordModel = this.form.value;

    this.subscription.add(this.usuarioService.changePassword(this.defaults.id_usuario, passwordModel).subscribe((result) => {
      this.dialogRef.close(this.defaults);
    }, (exception: any) => {
      if (exception instanceof BadRequestContractModel) {
        var formControl: AbstractControl;

        exception.campos.forEach(c => {
          formControl = this.form.get(c.campo);
          if (formControl) {
            formControl.setErrors({
              serverError: c.mensagem
            });
          }
        })

        this.snackbar.open(exception.mensagem, 'OK', {
          duration: 5000
        });
      } else if (exception instanceof GenericErrorContractModel) {
        this.snackbar.open(exception.mensagem, 'OK', {
          duration: 5000
        });
      } else {
        this.snackbar.open(exception, 'OK', {
          duration: 5000
        });
      }
    }));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
