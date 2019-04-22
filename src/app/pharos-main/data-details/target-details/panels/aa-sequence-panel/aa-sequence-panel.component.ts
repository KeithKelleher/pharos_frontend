import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {DynamicPanelComponent} from '../../../../../tools/dynamic-panel/dynamic-panel.component';
import {takeUntil} from 'rxjs/operators';
import * as Protvista from 'ProtVista';
import {NavSectionsService} from "../../../../../tools/sidenav-panel/services/nav-sections.service";

@Component({
  selector: 'pharos-aa-sequence-panel',
  templateUrl: './aa-sequence-panel.component.html',
  styleUrls: ['./aa-sequence-panel.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class AaSequencePanelComponent extends DynamicPanelComponent implements OnInit {

  @ViewChild('protVistaViewer') viewerContainer: ElementRef;

  aasequence: any[];

  residueCounts: any[];
  id: string;

  constructor(
    private navSectionsService: NavSectionsService
  ) {
    super();
  }

  ngOnInit() {
    this._data
    // listen to data as long as term is undefined or null
    // Unsubscribe once term has value
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(x => {
        if (this.data.sequence) {
          this.ngUnsubscribe.next();
          this.setterFunction();
        }
      });
  }

  setterFunction() {
    this.parseSequence();
    const r = new Protvista({
      el: this.viewerContainer.nativeElement,
      uniprotacc: this.id
    });
    this.getCounts();
  }

  getCounts(): void {
    const charMap: Map<string, number> = new Map<string, number>();
    this.data.sequence[0].text.split('').map(char => {
      let count = charMap.get(char);
      if (count) {
        charMap.set(char, ++count);
      } else {
        charMap.set(char, 1);
      }
    });
    this.residueCounts = Array.from(charMap.entries());
  }

  parseSequence(): void {
    const length = 70;
    const split = this.splitString(this.data.sequence[0].text, length);
  const splitseq: any[] = [];
  split.forEach((chunk, index) =>  {
     if (index === 0) {
       splitseq.push({chunk: chunk, residues: index + 1 + '-' + (index + 1) * length});
     } else if (index === split.length - 1) {
       splitseq.push({chunk: chunk, residues: index * length + '-' + this.data.sequence[0].text.length});
     } else {
       splitseq.push({chunk: chunk, residues: index * length + '-' + (index + 1) * length});
     }
   });
    this.aasequence = splitseq;
  }

  /**
   * Split a string into chunks of the given size
   * @param  {String} string is the String to split
   * @param  {Number} size is the size you of the cuts
   * @return {Array} an Array with the strings
   */
  splitString (string: string, size: number): string[] {
    const re: RegExp  = new RegExp('.{1,' + size + '}', 'g');
    return string.match(re);
  }

  active(fragment: string) {
    this.navSectionsService.setActiveSection(fragment);
  }
}
