import {Component, Input, OnInit} from '@angular/core';
import {GeneDetailsComponent} from "../gene-details/gene-details.component";
import {SelectedFacetService} from "../../../filter-panel/selected-facet.service";
import {VennDiagramData} from "../../../../../tools/visualizations/venn-diagram/venn-diagram.component";
import {Target} from "../../../../../models/target";

@Component({
  selector: 'pharos-similarity-details',
  templateUrl: './similarity-details.component.html',
  styleUrls: ['../long-target-card.component.scss']
})
export class SimilarityDetailsComponent extends GeneDetailsComponent implements OnInit {
  @Input() similarityTarget: Target;
  similarityFacet: string = "";
  constructor(private selectedFacetService: SelectedFacetService) {
    super();
  }
  vennData: VennDiagramData = new VennDiagramData();
  ngOnInit(): void {
    const facetValue = this.selectedFacetService.getFacetByName('similarity')?.values[0]?.name?.split(',');
    if(facetValue && facetValue.length > 1) {
      const similarityFacet = facetValue[1].trim();
      if (similarityFacet[similarityFacet.length - 1] === ')') {
        this.similarityFacet = similarityFacet.slice(0, similarityFacet.length - 1).trim();
      }
    }
    this.vennData.sizeA = this.target.similarityDetails.testSize;
    this.vennData.nameA = this.target.gene || this.target.accession;
    this.vennData.colorA = this.tdl2color(this.target.idgTDL);

    this.vennData.sizeB = this.target.similarityDetails.baseSize;
    this.vennData.nameB = this.similarityTarget.gene || this.similarityTarget.accession;
    this.vennData.colorB = this.tdl2color(this.similarityTarget.idgTDL);

    this.vennData.overlap = this.target.similarityDetails.overlap;
    this.vennData.facetName = this.similarityFacet;
  }

  tdl2color(tdl: string){
    switch (tdl) {
      case 'Tdark':
        return 'red';
      case 'Tbio':
        return '#ffb259';
      case 'Tchem':
        return '#5bc0de';
      case 'Tclin':
        return '#337ab7';
    }
    return 'white';
  }
}
