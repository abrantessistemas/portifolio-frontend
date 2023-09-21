import { Component, Inject, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import icClose from '@iconify/icons-ic/twotone-close';
import icSecurity from '@iconify/icons-ic/twotone-security';
import icPerson from '@iconify/icons-ic/twotone-person';
import icLocationCity from '@iconify/icons-ic/twotone-location-city';
import { UsuarioModel } from 'src/app/usuarios/usuario.model';
import { UsuarioService } from 'src/app/usuarios/usuario.service';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import { Subscription } from 'rxjs';
import { BadRequestContractModel } from 'src/app/common/bad-request-contract.model';
import { GenericErrorContractModel } from 'src/app/common/generic-error-contract.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuariosChangePhotoComponent } from '../usuarios-change-photo/usuarios-change-photo.component';

@Component({
  selector: 'vex-usuarios-create-update',
  templateUrl: './usuarios-create-update.component.html',
  styleUrls: ['./usuarios-create-update.component.scss']
})
export class UsuariosCreateUpdateComponent implements OnInit, OnDestroy {

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  icClose = icClose;
  icPerson = icPerson;
  icLocationCity = icLocationCity;
  icSecurity = icSecurity;
  icVisibility = icVisibility;
  icVisibilityOff = icVisibilityOff;

  inputType = 'password';
  passwordVisible = false;
  userPhotoUrl: string;

  private subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: UsuarioModel,
    private dialogRef: MatDialogRef<UsuariosCreateUpdateComponent>,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private photoDialog: MatDialog) {
  }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
      this.userPhotoUrl = this.usuarioService.getUserPhoto(this.defaults.id_usuario);
    } else {
      this.defaults = {} as UsuarioModel;
      this.userPhotoUrl = null;
    }

    this.form = this.fb.group({
      id: this.defaults.id_usuario || '',
      mustChangePassword: this.defaults.alterar_senha_proximo_acesso || false,
      expiresAt: this.defaults.data_expiracao_usuario || new Date(),
      username: this.defaults.login_usuario || '',
      name: this.defaults.nome_completo_usuario || '',
      role: this.defaults.papel_usuario || '',
      password: this.defaults.senha_usuario || '',
      tenant: this.defaults.tenant_usuario || '',
      active: this.defaults.usuario_ativo || false
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

  save() {
    const usuario: UsuarioModel = new UsuarioModel();
    usuario.id_usuario = this.form.get('id').value;
    usuario.alterar_senha_proximo_acesso = this.form.get('mustChangePassword').value;
    usuario.login_usuario = this.form.get('username').value;
    usuario.nome_completo_usuario = this.form.get('name').value;
    usuario.papel_usuario = this.form.get('role').value;
    usuario.senha_usuario = this.form.get('password').value;
    usuario.tenant_usuario = this.form.get('tenant').value;
    usuario.usuario_ativo = this.form.get('active').value;
    usuario.data_expiracao_usuario = this.form.get('expiresAt').value;

    if (this.mode === 'create') {
      this.createUsuario(usuario);
    } else if (this.mode === 'update') {
      this.updateUsuario(usuario);
    }
  }

  createUsuario(usuario: UsuarioModel) {
    this.subscription.add(this.usuarioService.createUser(usuario).subscribe((result) => {
      this.dialogRef.close(usuario);
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

  updateUsuario(usuario: UsuarioModel) {
    this.subscription.add(this.usuarioService.updateUser(usuario.id_usuario, usuario).subscribe((result) => {
      this.dialogRef.close(usuario);
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

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  changePhoto() {
    this.photoDialog.open(UsuariosChangePhotoComponent, { data: this.defaults }).afterClosed().subscribe((usuario: UsuarioModel) => {
      this.dialogRef.close(usuario);
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
