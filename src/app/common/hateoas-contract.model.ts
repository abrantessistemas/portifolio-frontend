import { LinkContractModel } from './link-contract.model';

export class HateOASModel{
    links: LinkContractModel[];

    hasLinks(): boolean {
        return (this.links && this.links.length > 0);
    }

    hasLink(rel: string): boolean {
        return this.getLink(rel) != null;
    }

    getLink(rel: string): LinkContractModel {
        if (this.links) {
            var filteredLinks = this.links.filter(l => l.rel === rel);

            if (filteredLinks.length > 0) return filteredLinks[0];
        }

        return null;
    }

}