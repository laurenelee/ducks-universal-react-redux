/* eslint-disable no-constant-condition */
import { fork } from 'redux-saga/effects';
import github from './github';
import app from './app';

// each entity defines 3 creators { request, success, failure }

// url for first page
// urls for next pages will be extracted from the successive loadMore* requests
/**
 ****************************** WATCHERS ***********************************
 **/

export { loadStarred, loadUser } from './github';

export default function* root() {
  yield [
    fork(github),
    fork(app)
  ];
}
