import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Congregation } from '../../app/shared/congregation.model';
import * as fromCongregationList from './store/congregation-list.reducers';

/**
 * Generated class for the CongregationListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'congregation-list',
  templateUrl: 'congregation-list.html'
})
export class CongregationListComponent implements OnInit {
  // observable of the list of congregations
  congregationListState: Observable<{congregations: Congregation[]}>;

  constructor(private store: Store<fromCongregationList.AppState>) {
    console.log('Hello CongregationListComponent Component');
  }

  ngOnInit() {
    // selecting the congregation list from the Store of Ngrx
    this.congregationListState = this.store.select('congregationList');
  }

}
