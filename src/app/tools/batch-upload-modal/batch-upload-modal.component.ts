import {ChangeDetectorRef, Component, Inject, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * modal component for batch search/upload
 */
@Component({
  selector: 'pharos-batch-upload-modal',
  templateUrl: './batch-upload-modal.component.html',
  styleUrls: ['./batch-upload-modal.component.scss']
})

/**
 * batch upload modal class
 */
export class BatchUploadModalComponent implements OnInit {

  @Input() nameable = false;

  saveToProfile = false;

  /**
   * target input form
   */
  targetListCtrl: FormControl = new FormControl();
  collectionNameCtrl: FormControl = new FormControl();
  descriptionCtrl: FormControl = new FormControl();

  /**
   * add dialog controller
   * @param data
   * @param dialogRef
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BatchUploadModalComponent>,
    private changeRef: ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    this.nameable = this.data.nameable;
    this.targetListCtrl.setValue(this.data.selection);
    this.changeRef.detectChanges();
  }

  /**
   * cancel and close modal
   */
  cancel(): void {
    this.dialogRef.close(null);
  }


  /**
   * submit control value and close modal
   */
  submitList(): void {
    let retArr;
    if (Array.isArray(this.targetListCtrl.value)) {
      retArr = this.targetListCtrl.value.map(val => val = val.trim());
    } else {
      retArr = this.targetListCtrl.value.trim().split(/[\t\n,;]+/).map(val => val.trim());
    }

    this.dialogRef.close({
        targetList: retArr,
        collectionName: this.collectionNameCtrl.value,
        description: this.descriptionCtrl.value,
        saveList: this.saveToProfile
  });
  }

}
