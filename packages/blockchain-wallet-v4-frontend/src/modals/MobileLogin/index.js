import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { isNil, isEmpty } from 'ramda'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import MobileLogin from './template.js'

class MobileLoginContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleScan = this.handleScan.bind(this)
    this.handleError = this.handleError.bind(this)
  }

  handleScan (result) {
    if (!isNil(result) && !isEmpty(result)) { this.props.authActions.mobileLogin(result) }
  }

  handleError (error) {
    if (isNil(error) && isEmpty(error)) { this.props.alertsActions.displayError('Could not scan the mobile login QR Code') }
  }

  render () {
    return <MobileLogin {...this.props} handleScan={this.handleScan} handleError={this.handleError} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  alertsActions: bindActionCreators(actions.alerts, dispatch),
  authActions: bindActionCreators(actions.auth, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('MobileLogin'),
  connect(undefined, mapDispatchToProps)
)

export default enhance(MobileLoginContainer)
