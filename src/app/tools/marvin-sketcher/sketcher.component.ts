import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {FormControl} from '@angular/forms';
import {LoadingService} from "../../pharos-services/loading.service";
import {MolConverterService} from "./services/mol-converter.service";


@Component({
  selector: 'app-sketcher',
  templateUrl: './sketcher.component.html',
  styleUrls: ['./sketcher.component.css']
})
export class SketcherComponent implements OnInit {
  marvinSketcherInstance;
  url: SafeResourceUrl;
  modelCtrl: FormControl = new FormControl();
  models: any[] = [];
  drawn = false;
  molecule = false;
  selected = false;
marvin: any;

  constructor(
    private molConverter: MolConverterService,
    private sanitizer: DomSanitizer,
    private loadingService: LoadingService,
    private ngZone: NgZone,
    private ref: ChangeDetectorRef) {
    // todo : try to load sketcher without an iframe
    /*    this.marvin = window['MarvinJSUtil'];
        window.addEventListener("message", function(event) {
          try {
            var externalCall = JSON.parse(event.data);
           this.marvin.onReady(function() {
              this.marvin.sketcherInstance[externalCall.method].apply(this.marvin.sketcherInstance, externalCall.args);
            });
          } catch (e) {
          }
        }, false);*/
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl('./assets/vendor/marvin/editor.html');
  }

  ngOnInit() {
    console.log(window);
    window['MarvinJSUtil'].getPackage('#sketcher').then((marvin) => {
      this.marvinSketcherInstance = marvin.sketcherInstance;
      this.marvinSketcherInstance.on('molchange', () => {
        this.marvinSketcherInstance.exportStructure('mol').then((mol: any) => {
          // solution and explanation from here: https://stackoverflow.com/a/48528672
          // basically, the marvin callbacks aren't run within angular, so they can't update the scope data
          this.ngZone.run(() => {
            console.log(mol);
            console.log(this);
           // / this.molConverter.convertMol(mol);
           // this.drawn = false;
          });
          /* this.molecule = true;
           this.drawn = true;
           if (this.marvinSketcherInstance.isEmpty()) {
             this.molecule = false;
             this.drawn = false;
           }*/
        });
        this.ref.detectChanges();
      });
      }).catch(err => console.log(err));
  }


  setSelect(): void {
    this.selected = true;
    if (this.molecule) {
      this.drawn = true;
    }
  }

  submit(): void {
  //  this.loadingService.toggleVisible(true);
    this.marvinSketcherInstance.exportStructure('mol').then((mol: any) => {
      // solution and explanation from here: https://stackoverflow.com/a/48528672
      // basically, the marvin callbacks aren't run within angular, so they can't update the scope data
      this.ngZone.run(() => {
      //  this.predictorService.getPredictions(mol, this.modelCtrl.value);
        this.drawn = false;
      });
    });
  }
}
