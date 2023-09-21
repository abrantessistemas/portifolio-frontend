import { HateOASModel } from './hateoas-contract.model';

export class PaginationContractModel extends HateOASModel {
    page: number;
    page_size: number;
    total_elements: number;
    total_pages: number;
}