/* eslint-disable no-constant-condition */
import { take, put, call, fork, select } from 'redux-saga/effects';
import { api } from '../services';
import { selectors as githubSelectors, actionTypes as githubActionTypes, actions as githubActions }
  from '../redux/modules/github';

// each entity defines 3 creators { request, success, failure }

// url for first page
// urls for next pages will be extracted from the successive loadMore* requests
const firstPageStarredUrl = login => `users/${login}/starred`;
const firstPageStargazersUrl = fullName => `repos/${fullName}/stargazers`;


/**
 **** Subroutines ****
 */

// resuable fetch Subroutine
// entity :  user | repo | starred | stargazers
// apiFn  : api.fetchUser | api.fetchRepo | ...
// id     : login | fullName
// url    : next page url. If not provided will use pass it to apiFn
function* fetchEntity(entity, apiFn, id, url) {
  yield put(entity.request(id));
  const { response, error } = yield call(apiFn, url || id);
  if (response) {
    yield put(entity.success(id, response));
  } else {
    yield put(entity.failure(id, error));
  }
}

// yeah! we can also bind Generators
export const fetchUser =
  fetchEntity.bind(null, githubActions.user, api.fetchUser);
export const fetchRepo =
  fetchEntity.bind(null, githubActions.repo, api.fetchRepo);
export const fetchStarred =
  fetchEntity.bind(null, githubActions.starred, api.fetchStarred);
export const fetchStargazers =
  fetchEntity.bind(null, githubActions.stargazers, api.fetchStargazers);

// load user unless it is cached
export function* loadUser(login, requiredFields) {
  const userObj = yield select(githubSelectors.getUser, login);
  if (!userObj || requiredFields.some(key => !userObj.hasOwnProperty(key))) {
    yield call(fetchUser, login);
  }
}

// load repo unless it is cached
function* loadRepo(fullName, requiredFields) {
  const repoObj = yield select(githubSelectors.getRepo, fullName);
  if (!repoObj || requiredFields.some(key => !repoObj.hasOwnProperty(key))) {
    yield call(fetchRepo, fullName);
  }
}

// load next page of repos starred by this user unless it is cached
export function* loadStarred(login, loadMore) {
  const starredByUser = yield select(githubSelectors.getStarredByUser, login);
  if (!starredByUser || !starredByUser.pageCount || loadMore) {
    yield call(
      fetchStarred,
      login,
      starredByUser.nextPageUrl || firstPageStarredUrl(login)
    );
  }
}

// load next page of users who starred this repo unless it is cached
function* loadStargazers(fullName, loadMore) {
  const stargazersByRepo = yield select(githubSelectors.getStargazersByRepo, fullName);
  if (!stargazersByRepo || !stargazersByRepo.pageCount || loadMore) {
    yield call(
      fetchStargazers,
      fullName,
      stargazersByRepo.nextPageUrl || firstPageStargazersUrl(fullName)
    );
  }
}

function* watchLoadUserPage() {
  while (true) {
    const { login, requiredFields = [] } = yield take(githubActionTypes.LOAD_USER_PAGE);

    yield fork(loadUser, login, requiredFields);
    yield fork(loadStarred, login);
    // Example for redirection from saga routine:
    // yield put(navigate('xkawi'));
  }
}

// Fetches data for a Repo: repo data + repo stargazers
function* watchLoadRepoPage() {
  while (true) {
    const { fullName, requiredFields = [] } = yield take(githubActionTypes.LOAD_REPO_PAGE);

    yield fork(loadRepo, fullName, requiredFields);
    yield fork(loadStargazers, fullName);
  }
}

// Fetches more starred repos, use pagination data from getStarredByUser(login)
function* watchLoadMoreStarred() {
  while (true) {
    const { login } = yield take(githubActionTypes.LOAD_MORE_STARRED);
    yield fork(loadStarred, login, true);
  }
}

function* watchLoadMoreStargazers() {
  while (true) {
    const { fullName } = yield take(githubActionTypes.LOAD_MORE_STARGAZERS);
    yield fork(loadStargazers, fullName, true);
  }
}

export default function* root() {
  yield [
    fork(watchLoadUserPage),
    fork(watchLoadRepoPage),
    fork(watchLoadMoreStarred),
    fork(watchLoadMoreStargazers)
  ];
}

