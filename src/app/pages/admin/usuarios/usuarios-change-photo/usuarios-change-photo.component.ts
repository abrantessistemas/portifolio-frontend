import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import icClose from '@iconify/icons-ic/twotone-close';
import { UsuarioModel } from 'src/app/usuarios/usuario.model';
import { UsuarioService } from 'src/app/usuarios/usuario.service';
import { Subscription } from 'rxjs';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { BadRequestContractModel } from 'src/app/common/bad-request-contract.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenericErrorContractModel } from 'src/app/common/generic-error-contract.model';

@Component({
    selector: 'vex-usuarios-change-photo',
    templateUrl: './usuarios-change-photo.component.html',
    styleUrls: ['./usuarios-change-photo.component.scss']
})
export class UsuariosChangePhotoComponent implements OnInit, OnDestroy {

    icClose = icClose;
    imageChangedEvent: any = '';
    croppedImage: any = '';

    private subscription: Subscription = new Subscription();

    constructor(@Inject(MAT_DIALOG_DATA) public defaults: UsuarioModel,
        private dialogRef: MatDialogRef<UsuariosChangePhotoComponent>,
        private snackbar: MatSnackBar,
        private usuarioService: UsuarioService) {
    }

    ngOnInit() {

    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }
    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
    }
    imageLoaded() {
    }
    cropperReady() {
    }
    loadImageFailed() {
    }

    sendPhoto() {
        fetch(this.croppedImage)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], this.defaults.id_usuario + ".png");

                this.subscription.add(this.usuarioService.uploadUserPhoto(this.defaults.id_usuario, file).subscribe((result) => {
                    this.dialogRef.close(this.defaults);
                }, (exception: any) => {
                    if (exception instanceof BadRequestContractModel || exception instanceof GenericErrorContractModel) {
                        this.snackbar.open(exception.mensagem, 'OK', {
                            duration: 5000
                        });
                    } else {
                        this.snackbar.open(exception, 'OK', {
                            duration: 5000
                        });
                    }
                }));
            });
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
