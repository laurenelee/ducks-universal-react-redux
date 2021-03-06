import { fork, join } from 'redux-saga/effects';

export default (sagas) => function* genTasks() {
  sagas.forEach(function(saga){
    console.log(saga);
  });

  const tasks = yield sagas.map(([saga, ...params]) => fork(saga, ...params));
  if (tasks.length) {
    yield join(...tasks);
  }
};
