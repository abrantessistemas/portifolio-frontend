import { BadRequestFieldContractModel } from './bad-request-fields-contract.model';

export class BadRequestContractModel{
    codigo:string;
    mensagem:string;
    campos: BadRequestFieldContractModel[];
}