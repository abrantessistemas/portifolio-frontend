import { HateOASModel } from '../common/hateoas-contract.model';

export class UsuarioModel extends HateOASModel {
    alterar_senha_proximo_acesso: boolean;
    data_criacao_usuario: Date;
    data_expiracao_usuario: Date;
    id_usuario: string;
    login_usuario: string;
    nome_completo_usuario: string;
    papel_usuario: string;
    senha_usuario: string;
    tenant_usuario: string;
    usuario_ativo: boolean;
    usuario_criacao: string;
}