import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { validMobileNumber, required } from 'services/FormHelper'
import { Button, ButtonGroup, Text, TextGroup } from 'blockchain-info-components'
import { PhoneNumberBox, TextBox } from 'components/Form'
import { SettingForm, SettingWrapper } from 'components/Setting'

const Setting = (props) => {
  const { updateToggled, verifyToggled, handleToggle, handleClick, handleResend, handleVerify, smsNumber, submitting, invalid } = props

  return (
    <SettingWrapper>
      <Text>{smsNumber}</Text>
      <Button nature='primary' onClick={handleToggle}>
        <FormattedMessage id='scenes.preferences.mobile.setting.updateform.change' defaultMessage='Change' />
      </Button>
      { updateToggled &&
        <SettingForm>
          <TextGroup inline>
            <Text size='14px' weight={300}>
              <FormattedMessage id='scenes.preferences.mobile.setting.updateform.explain' defaultMessage='Use your mobile phone to receive a one-time-password after a login attempt.' />
            </Text>
            <Text size='14px' weight={300}>
              <FormattedMessage id='scenes.preferences.mobile.setting.updateform.explain2' defaultMessage='Add your mobile phone number below to continue' />
            </Text>
          </TextGroup>
          <Field name='mobileNumber' validate={[validMobileNumber]} component={PhoneNumberBox} />
          <ButtonGroup>
            <Button nature='empty' capitalize onClick={handleToggle}>
              <FormattedMessage id='scenes.preferences.mobile.setting.updateform.cancel' defaultMessage='Cancel' />
            </Button>
            <Button nature='primary' capitalize disabled={submitting || invalid} onClick={handleClick}>
              <FormattedMessage id='scenes.preferences.mobile.setting.updateform.save' defaultMessage='Save' />
            </Button>
          </ButtonGroup>
        </SettingForm>
      }
      { !updateToggled && verifyToggled &&
        <SettingForm>
          <TextGroup inline>
            <Text size='14px' weight={300}>
              <FormattedMessage id='scenes.preferences.mobile.setting.verifyform.explain' defaultMessage='We have sent your mobile phone an SMS message with a verification code.' />
            </Text>
            <Text size='14px' weight={300}>
              <FormattedMessage id='scenes.preferences.mobile.setting.verifyform.explain2' defaultMessage='Enter the code below to verify your mobile phone number' />
            </Text>
          </TextGroup>
          <Field name='code' validate={[required]} component={TextBox} />
          <ButtonGroup>
            <Button nature='empty' onClick={handleResend} capitalize>
              <FormattedMessage id='scenes.preferences.mobile.setting.verifyform.resend' defaultMessage='Resend' />
            </Button>
            <Button nature='primary' capitalize disabled={submitting || invalid} onClick={handleVerify}>
              <FormattedMessage id='scenes.preferences.mobile.setting.verifyform.verify' defaultMessage='Verify' />
            </Button>
          </ButtonGroup>
        </SettingForm>
      }
    </SettingWrapper>
  )
}

Setting.propTypes = {
  smsNumber: PropTypes.string.isRequired,
  updateToggled: PropTypes.bool.isRequired,
  verifyToggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleResend: PropTypes.func.isRequired,
  handleVerify: PropTypes.func.isRequired
}

export default reduxForm({ form: 'settingMobilePhone' })(Setting)
