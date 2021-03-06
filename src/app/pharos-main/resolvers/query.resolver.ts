import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import { Observable } from 'rxjs';
import {PharosApiService} from '../../pharos-services/pharos-api.service';
import {LoadingService} from '../../pharos-services/loading.service';
import {PharosBase, Serializer} from '../../models/pharos-base';
import {map} from 'rxjs/internal/operators';

/**
 * resolves the details for a specific object
 */
@Injectable({
  providedIn: 'root'
})
export class QueryResolver implements Resolve<any> {

  /**
   * create services
   * @param {LoadingService} loadingService
   * @param {PharosApiService} pharosApiService
   */
  constructor(
    private pharosApiService: PharosApiService
  ) {  }

  /**
   * toggle loading modal
   * set path todo: see how much this is still used
   * call api - api returns through different subscriptions, so the data ins't actually returned here
   * hence the empty observable returned
   * @param {ActivatedRouteSnapshot} route
   * @returns {Observable<PharosBase>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<PharosBase> {
    this.pharosApiService.flushData();
    const serializer: Serializer = route.data.serializer;
    return this.pharosApiService.adHocQuery(route.data.fragments.query)
      .pipe(
        map(res =>  {
          const data = JSON.parse(JSON.stringify(res.data)); // copy readonly object
          const results = data[route.data.rootObject];
          // copy readonly object
          if (Array.isArray(results)) {
            data[`${[route.data.rootObject]}Props`] = [];
            data[route.data.rootObject] = data[route.data.rootObject].map(obj => {
              const tobj = serializer.fromJson(obj);
              data[`${[route.data.rootObject]}Props`].push(serializer._asProperties(tobj));
              return tobj;
            });
          }
          else{
            const tobj = serializer.fromJson(data[route.data.rootObject]);
            data[route.data.rootObject] = tobj;
            data[`${[route.data.rootObject]}Props`] = serializer._asProperties(tobj);
          }
          return data;
        })
      );
  }
}
