/**
 * 存储TODO列表
 */
import { createAction, handleActions } from 'redux-actions';

export const SET = 'SET_TODOS';
export const INITIAL_STATE = [];

export const set = createAction(SET, any => any);

const reducer = handleActions(
  {
    [SET]: function(state, { payload }) {
      return INITIAL_STATE.concat(payload);
    },
  },
  INITIAL_STATE
);

export default reducer;
