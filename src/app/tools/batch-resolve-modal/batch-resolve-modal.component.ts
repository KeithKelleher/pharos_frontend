import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ResolverService} from '../../pharos-services/resolver.service';
import {PharosProperty} from '../../models/pharos-property';
import {DataProperty} from '../generic-table/components/property-display/data-property';

@Component({
  selector: 'pharos-batch-resolve-modal',
  templateUrl: './batch-resolve-modal.component.html',
  styleUrls: ['./batch-resolve-modal.component.scss']
})
export class BatchResolveModalComponent implements OnInit {

  resolvedInputs: any[];
  resolvedInputProps: any[];
  loading = false;

  fields: PharosProperty[] = [
    new PharosProperty({
      name: 'input',
      label: 'Input'
    }),
    new PharosProperty({
      name: 'match',
      label: 'Matching Term'
    }),
    new PharosProperty( {
      name: 'success',
      label: 'Success',
      checkbox: true
    }),
    new PharosProperty({
      name: 'save',
      label: 'Output'
    })];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BatchResolveModalComponent>,
    private resolverService: ResolverService
  ) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.resolverService.resolveLychis(this.data.targetList).then(res => {
      this.resolvedInputs = res;
      this.resolvedInputProps = this.resolvedInputs.map(i => this._mapField(i));
      this.loading = false;
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }

  submitList() {
    this.dialogRef.close({
      targetList: this.resolvedInputs.map(f => f.save)
    });
  }


  private _mapField(obj: any) {
    const retObj: {} = Object.assign({}, obj);
    Object.keys(obj).map(objField => {
      if (Array.isArray(obj[objField])) {
        retObj[objField] = obj[objField].map(arrObj => this._mapField(arrObj));
      } else {
        const val = obj[objField];
        const trimmed = val.length > 50 ? val.substring(0, 50) + '...' : val;
        retObj[objField] = new DataProperty({name: objField, label: objField, term: trimmed});
      }
    });
    return retObj;
  }
}
