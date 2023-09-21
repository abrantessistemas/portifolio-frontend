import { DataContractModel } from './data-contract.model';
import { PaginationContractModel } from './pagination-contract.model';
import { LinkContractModel } from './link-contract.model';

export class PageableContractModel<T> extends DataContractModel<T> {
    pagination: PaginationContractModel;

    hasNextPage(): boolean {
        return this.pagination != null && this.pagination.hasLink("next");
    }

    hasPreviousPage(): boolean {
        return this.pagination != null && this.pagination.hasLink("previous");
    }

    isFirstPage(): boolean {
        return this.pagination != null && this.pagination.page == 1;
    }

    isLastPage(): boolean {
        return this.pagination != null && this.pagination.page == this.pagination.total_pages;
    }

    getFirstPage(): LinkContractModel {
        if (this.pagination)
            return this.pagination.getLink("first");

        return null;
    }

    getNextPage(): LinkContractModel {
        if (this.pagination && this.hasNextPage())
            return this.pagination.getLink("next");

        return null;
    }

    getPreviousPage(): LinkContractModel {
        if (this.pagination && this.hasPreviousPage())
            return this.pagination.getLink("previous");

        return null;
    }

    getLastPage(): LinkContractModel {
        if (this.pagination)
            return this.pagination.getLink("last");

        return null;
    }
}