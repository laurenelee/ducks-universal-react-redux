import { actionTypes } from '../../redux/modules/app';
import merge from 'lodash/merge';
import { reducer as githubReducer } from './github';
import { combineReducers } from 'redux';

// Updates an entity cache in response to any action with response.entities.
function entities(state = { users: {}, repos: {} }, action) {
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities);
  }

  return state;
}

// Updates error message to notify about the failed fetches.
function errorMessage(state = null, action) {
  const { type, error } = action;

  if (type === actionTypes.RESET_ERROR_MESSAGE) {
    return null;
  } else if (error) {
    return action.error;
  }

  return state;
}

function router(state = { pathname: '/' }, action) {
  switch (action.type) {
    case actionTypes.UPDATE_ROUTER_STATE:
      return action.state;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  entities,
  githubReducer,
  errorMessage,
  router
});

export default rootReducer;
