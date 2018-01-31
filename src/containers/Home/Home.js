import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { actions as appActions } from '../../redux/modules/app';

import styles from './Home.scss'; // eslint-disable-line

class Home extends Component {

  componentWillMount() {
    this.props.updateRouterState({
      pathname: this.props.location.pathname,
      params: this.props.params
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errorMessage) {
      // handle error here
    }
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.props.updateRouterState({
        pathname: nextProps.location.pathname,
        params: nextProps.params
      });
    }
  }

  render() {
    return (
      <div className={styles.app}>
        <Helmet
          title="React Universal Saga"
          meta={[{ property: 'og:site_name', content: 'React Universal Saga' }]}
        />
        <h2>Hello World!</h2>
      </div>
    );
  }
}

Home.propTypes = {
  errorMessage: PropTypes.string,
  navigate: PropTypes.func.isRequired,
  updateRouterState: PropTypes.func.isRequired,
  resetErrorMessage: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }),
  params: PropTypes.object
};

function mapStateToProps(state) {
  return {
    errorMessage: state.errorMessage,
  };
}

const { navigate, updateRouterState, resetErrorMessage } = appActions;

export default connect(mapStateToProps, {
  navigate,
  updateRouterState,
  resetErrorMessage
})(Home);
