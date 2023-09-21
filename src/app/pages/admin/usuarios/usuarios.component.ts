import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, of, ReplaySubject, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from '../../../../@vex/interfaces/table-column.interface';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import { SelectionModel } from '@angular/cdk/collections';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import { fadeInUp400ms } from '../../../../@vex/animations/fade-in-up.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from '../../../../@vex/animations/stagger.animation';
import { FormControl, AbstractControl } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import icCancel from '@iconify/icons-ic/twotone-cancel';
import icCheckCircleOutline from '@iconify/icons-ic/twotone-check-circle-outline';
import { UsuariosCreateUpdateComponent } from './usuarios-create-update/usuarios-create-update.component';
import { UsuarioModel } from 'src/app/usuarios/usuario.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UsuarioService } from 'src/app/usuarios/usuario.service';
import { PageableContractModel } from 'src/app/common/pageable-contract.model';
import { BadRequestContractModel } from 'src/app/common/bad-request-contract.model';
import { GenericErrorContractModel } from 'src/app/common/generic-error-contract.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuariosChangePasswordComponent } from './usuarios-change-password/usuarios-change-password.component';

@Component({
  selector: 'vex-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class UsuariosComponent implements OnInit, AfterViewInit, OnDestroy {

  layoutCtrl = new FormControl('fullwidth');

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<UsuarioModel[]> = new ReplaySubject<UsuarioModel[]>(1);
  data$: Observable<UsuarioModel[]> = this.subject$.asObservable();

  @Input()
  columns: TableColumn<UsuarioModel>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'Foto', property: 'image', type: 'image', visible: true },
    { label: 'ID', property: 'id_usuario', type: 'text', visible: false, cssClasses: ['font-medium'] },
    { label: 'Login', property: 'login_usuario', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Nome', property: 'nome_completo_usuario', type: 'text', visible: true },
    { label: 'Tenant', property: 'tenant_usuario', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Status', property: 'status', type: 'button', visible: true },
    { label: 'Grupo', property: 'papel_usuario', type: 'text', visible: true },
    { label: 'Expiração', property: 'data_expiracao_usuario', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Criado em', property: 'data_criacao_usuario', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Criado por', property: 'usuario_criacao', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Ações', property: 'actions', type: 'button', visible: true }
  ];

  currentPage = 1;
  pageSize = 20;
  totalItems = 0;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<UsuarioModel> | null;
  selection = new SelectionModel<UsuarioModel>(true, []);
  searchCtrl = new FormControl();
  usuarios: UsuarioModel[];

  icCancel = icCancel;
  icCheckCircleOutline = icCheckCircleOutline;
  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icFilterList = icFilterList;
  icMoreHoriz = icMoreHoriz;

  private subscription: Subscription = new Subscription();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
    private dialog: MatDialog, private usuarioService: UsuarioService, private snackbar: MatSnackBar) {
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }


  onSearch(page: number, pageSize: number) {
    this.router.navigate(['/admin/usuarios'], { queryParams: { page: page, page_size: pageSize } });
  }

  findAllUsuarios(page: number, pageSize: number) {
    this.dataSource = new MatTableDataSource();

    this.subscription.add(this.usuarioService.findAllUsers(page, pageSize).subscribe((result: PageableContractModel<UsuarioModel[]>) => {
      this.usuarios = result.data;
      this.dataSource.data = this.usuarios;
      this.totalItems = result.pagination.total_elements;

      this.subject$.next(this.usuarios);
    }));
  }

  ngOnInit() {
    this.subscription.add(this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.currentPage = params['page'] || 1;
      this.findAllUsuarios(this.currentPage, params['page_size'] || this.pageSize);
    }));

    this.data$.subscribe(usuarios => {
      this.usuarios = usuarios;
      this.dataSource.data = usuarios;
    });

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createUsuario() {
    this.dialog.open(UsuariosCreateUpdateComponent).afterClosed().subscribe((usuario: UsuarioModel) => {
      if (usuario)
        this.findAllUsuarios(this.currentPage, this.pageSize);
    });
  }

  onPage(pageEvent: PageEvent) {
    this.onSearch(pageEvent.pageIndex + 1, pageEvent.pageSize);
  }

  updateUsuario(usuario: UsuarioModel) {
    this.dialog.open(UsuariosCreateUpdateComponent, {
      data: usuario
    }).afterClosed().subscribe(usuario => {
      if (usuario)
        this.findAllUsuarios(this.currentPage, this.pageSize);
    });
  }

  deleteUsuario(usuario: UsuarioModel) {
    this.subscription.add(this.usuarioService.deleteUser(usuario.id_usuario).subscribe((result) => {
      this.findAllUsuarios(this.currentPage, this.pageSize);
    }, (exception: any) => {
      if (exception instanceof BadRequestContractModel) {
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

  deleteUsuarios(usuarios: UsuarioModel[]) {
    usuarios.forEach(c => this.deleteUsuario(c));
  }

  changePassword(usuario: UsuarioModel) {
    this.dialog.open(UsuariosChangePasswordComponent, {
      data: usuario
    })
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  getUserPhotoUrl(id: string): string {
    return this.usuarioService.getUserPhoto(id);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
