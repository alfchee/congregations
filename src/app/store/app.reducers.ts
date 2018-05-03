import { ActionReducerMap } from '@ngrx/store';

import * as fromCongregationList from '../../components/congregation-list/store/congregation-list.reducers';

// Interface of the whole Application State
export interface AppState {
  congregationList: fromCongregationList.State
}

export const reducers: ActionReducerMap<AppState> = {
  congregationList: fromCongregationList.congregationListReducer 
};
