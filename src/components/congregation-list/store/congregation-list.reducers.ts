import * as CongregationListAction from './congregation-list.actions'

import { Congregation } from '../../../app/shared/congregation.model';

// Interface of the state for the Congregations
export interface State {
  congregations: Congregation[];
  selectedCongregation: Congregation;
  selectedCongregationIndex: number;
}

// Initial state of the congregations
const initalState: State = {
  congregations: [
    new Congregation("Congregation 1", "Here near corner", "Unknow", "YouNKnow"),
    new Congregation("Congregation 2", "Here near corner", "Unknow", "YouNKnow"),
    new Congregation("Congregation 3", "Here near corner", "Unknow", "YouNKnow"),
  ],
  selectedCongregation: null,
  selectedCongregationIndex: -1
}

// Reducer of teh congregation List
export function congregationListReducer(state = initalState, action: CongregationListAction.CongregationListActions) {
  switch(action.type) {
    // Case of Adding a Congregation
    case CongregationListAction.ADD_CONGREGATION:
      return {
        ...state,
        congregations: [...state.congregations, action.payload]
      };
    default:
      return state;
  }
}
