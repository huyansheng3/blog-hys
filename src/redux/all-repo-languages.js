/**
 * Created by axetroy on 2017/4/19.
 */

import { createAction, handleActions } from 'redux-actions';

export const STORE = 'STORE_ALL_REPO_LANG';
export const INITIAL_STATE = {};

export const store = createAction(STORE, any => any);

const reducer = handleActions(
  {
    [STORE]: function(state, { payload }) {
      return payload;
    },
  },
  INITIAL_STATE
);

export default reducer;
