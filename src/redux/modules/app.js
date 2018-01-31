function action(type, payload = {}) {
  return { type, ...payload };
}

export const actionTypes = {
  UPDATE_ROUTER_STATE: 'UPDATE_ROUTER_STATE',
  NAVIGATE: 'NAVIGATE',
  RESET_ERROR_MESSAGE: 'RESET_ERROR_MESSAGE'
};

export const actions = {
  updateRouterState: (state) => action(actionTypes.UPDATE_ROUTER_STATE, { state }),
  navigate: (pathname) => action(actionTypes.NAVIGATE, { pathname }),
  resetErrorMessage: () => action(actionTypes.RESET_ERROR_MESSAGE)
};
