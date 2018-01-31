import paginate from './paginate';
import { combineReducers } from 'redux';

const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

function createRequestTypes(base) {
  const res = {};
  //eslint-disable-next-line
  [REQUEST, SUCCESS, FAILURE].forEach(type => res[type] = `${base}_${type}`);
  return res;
}

function action(type, payload = {}) {
  return { type, ...payload };
}

export const actionTypes = {
  USER: createRequestTypes('USER'),
  REPO: createRequestTypes('REPO'),
  STARRED: createRequestTypes('STARRED'),
  STARGAZERS: createRequestTypes('STARGAZERS'),
  LOAD_USER_PAGE: 'LOAD_USER_PAGE',
  LOAD_REPO_PAGE: 'LOAD_REPO_PAGE',
  LOAD_MORE_STARRED: 'LOAD_MORE_STARRED',
  LOAD_MORE_STARGAZERS: 'LOAD_MORE_STARGAZERS'
};

export const actions = {
  user: {
    request: (login) => action(actionTypes.USER.REQUEST, { login }),
    success: (login, response) => action(actionTypes.USER.SUCCESS, { login, response }),
    failure: (login, error) => action(actionTypes.USER.FAILURE, { login, error }),
  },
  repo: {
    request: (fullName) => action(actionTypes.REPO.REQUEST, { fullName }),
    success: (fullName, response) => action(actionTypes.REPO.SUCCESS, { fullName, response }),
    failure: (fullName, error) => action(actionTypes.REPO.FAILURE, { fullName, error }),
  },
  starred: {
    request: (login) => action(actionTypes.STARRED.REQUEST, { login }),
    success: (login, response) => action(actionTypes.STARRED.SUCCESS, { login, response }),
    failure: (login, error) => action(actionTypes.STARRED.FAILURE, { login, error }),
  },
  stargazers: {
    request: (fullName) => action(actionTypes.STARGAZERS.REQUEST, { fullName }),
    success: (fullName, response) => action(actionTypes.STARGAZERS.SUCCESS, { fullName, response }),
    failure: (fullName, error) => action(actionTypes.STARGAZERS.FAILURE, { fullName, error }),
  },
  loadUserPage: (login, requiredFields = []) => {
    const payload = { login, requiredFields };
    return action(actionTypes.LOAD_USER_PAGE, payload);
  },
  loadRepoPage: (fullName, requiredFields = []) => {
    const payload = { fullName, requiredFields };
    return action(actionTypes.LOAD_REPO_PAGE, payload);
  },
  loadMoreStarred: (login) => action(actionTypes.LOAD_MORE_STARRED, { login }),
  loadMoreStargazers: (fullName) => action(actionTypes.LOAD_MORE_STARGAZERS, { fullName })
};

export const reducer = combineReducers({
  starredByUser: paginate({
    mapActionToKey: a => a.login,
    types: [
      actionTypes.STARRED.REQUEST,
      actionTypes.STARRED.SUCCESS,
      actionTypes.STARRED.FAILURE
    ]
  }),
  stargazersByRepo: paginate({
    mapActionToKey: a => a.fullName,
    types: [
      actionTypes.STARGAZERS.REQUEST,
      actionTypes.STARGAZERS.SUCCESS,
      actionTypes.STARGAZERS.FAILURE
    ]
  })
});

export const selectors = {
  getUser: (state, login) => state.entities.users[login],
  getRepo: (state, fullName) => state.entities.repos[fullName],
  getStarredByUser: (state, login) => state.githubReducer.starredByUser[login] || {},
  getStargazersByRepo: (state, fullName) => state.githubReducer.stargazersByRepo[fullName] || {}
};
