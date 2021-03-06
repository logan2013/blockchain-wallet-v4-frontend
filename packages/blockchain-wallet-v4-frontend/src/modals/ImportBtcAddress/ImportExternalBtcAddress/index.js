import React from 'react'
import styled from 'styled-components'
import { Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { SelectBoxBitcoinAddresses, FormGroup, FormItem, TextBox } from 'components/Form'
import { optional, validBitcoinAddress, validBitcoinPrivateKey } from 'services/FormHelper'
import { spacing } from 'services/StyleService'
import { Banner, Text } from 'blockchain-info-components'

const Label = styled.label`
  display: block;
  font-size: 12px;
  margin-bottom: 5px;
`

class ImportExternalBitcoinAddress extends React.Component {
  render () {
    return (
      <div style={spacing('mt-15')}>
        <Text style={spacing('mb-15')} size='small' weight={300}>
          <FormattedMessage id='modals.importbtcaddress.import.info' defaultMessage='Your wallet automatically creates new bitcoin addresses as it needs them. You can optionally import an existing address generated outside of this wallet and transfer the funds to your wallet if you have the corresponding Private Key.' />
        </Text>
        <div style={spacing('mb-15')}>
          <Banner type='alert'>
            <FormattedMessage id='modals.importbtcaddress.import_external_bitcoin_address.message' defaultMessage='This is an advanced functionality and only suggested for advanced users.' />
          </Banner>
        </div>
        <FormGroup>
          <FormItem>
            <Label for='from'>
              <FormattedMessage id='modals.importbtcaddress.import_external_bitcoin_address.pub_key' defaultMessage='Bitcoin Address' />
            </Label>
            <Field name='from' validate={[validBitcoinAddress]} component={TextBox} />
          </FormItem>
        </FormGroup>
        <FormGroup inline>
          <FormItem width={'60%'}>
            <Label for='private-key'>
              <FormattedMessage id='modals.importbtcaddress.import_external_bitcoin_address.prv_key' defaultMessage='Enter Private Key' />
            </Label>
            <Field name='priv' validate={[optional(validBitcoinPrivateKey)]} component={TextBox} />
          </FormItem>
          <FormItem width={'40%'}>
            <Label for='wallets'>
              <FormattedMessage id='modals.importbtcaddress.import_external_bitcoin_address.prv_key' defaultMessage='Add to an existing wallet (optional)' />
            </Label>
            <Field name='to' component={SelectBoxBitcoinAddresses} validate={[]} props={{ includeAll: false }} />
          </FormItem>
        </FormGroup>
      </div>
    )
  }
}

export default ImportExternalBitcoinAddress
