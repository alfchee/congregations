import { Action } from '@ngrx/store';

import { Congregation } from '../../../app/shared/congregation.model';

//#########
// List of Type constants
export const ADD_CONGREGATION = 'ADD_CONGREGATION';

// Action for Add a congregation
export class AddCongregation implements Action {
  readonly type = ADD_CONGREGATION;

  constructor(public payload: Congregation) {}
}

export type CongregationListActions = AddCongregation ;
