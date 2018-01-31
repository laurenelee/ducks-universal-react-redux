// trigger router navigation via history
import { fork, take } from 'redux-saga/effects';
import { history } from '../services';
import { actionTypes as appActionTypes } from '../redux/modules/app';

function* watchNavigate() {
  while (true) {
    const { pathname } = yield take(appActionTypes.NAVIGATE);
    yield history.push(pathname);
  }
}

export default function* root() {
  yield [
    fork(watchNavigate)
  ];
}
