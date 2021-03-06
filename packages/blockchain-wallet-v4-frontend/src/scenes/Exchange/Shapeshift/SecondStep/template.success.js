import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { Button, Link, Text, Tooltip } from 'blockchain-info-components'
import { CheckBox, CountdownTimer, Form } from 'components/Form'
import Terms from 'components/Terms'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  border: 1px solid ${props => props.theme['gray-2']};
`
const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 15px 30px;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme['gray-2']};
`
const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 15px 30px 5px 30px;
  box-sizing: border-box;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${props => props.align === 'right' ? 'flex-end' : 'flex-start'};
  align-items: center;
  width: 100%;

  margin-bottom: 10px;
`

const Table = styled.div`
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-2']};
  background-color: ${props => props.theme['brand-quaternary']};

  & > :last-child { border-bottom: none; }
`
const TableRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 5px 0;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme['gray-2']};
`
const TableCell = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`

const Success = (props) => {
  const { handleCancel, position, total, close, submitting, invalid, ...rest } = props
  const { sourceCoin, targetCoin, sendAmount, sendFee, sendTotal, exchangeRate, receiveAmount, receiveFee, expiration, handleSubmit } = rest

  const checkboxShouldBeChecked = value => value ? undefined : 'You must agree with the terms and conditions'

  return (
    <Wrapper>
      <Header>
        <Text size='14px'>
          <FormattedMessage id='scenes.exchange.secondstep.title' defaultMessage='Confirm Exchange Order' />
        </Text>
        <Text size='12px' weight={300}>
          <FormattedMessage id='scenes.exchange.secondstep.stepnumber' defaultMessage='Step 2 of 2' />
        </Text>
      </Header>
      <Body>
        <Row>
          <Text size='13px' weight={300}>
            <FormattedMessage id='scenes.exchange.secondstep.recap' defaultMessage="Review the details below and click 'Confirm' to begin your exchange." />
            <FormattedMessage id='scenes.exchange.secondstep.recap2' defaultMessage='The exchanged funds will be deposited directly into {depositLabel}' values={{ depositLabel: 'My Ether Wallet' }} />
          </Text>
        </Row>
        <Row align='right'>
          <CountdownTimer expiryDate={expiration} />
        </Row>
        <Row>
          <Table>
            <TableRow>
              <TableCell>
                <Text size='13px' weight={400}>
                  <FormattedMessage id='scenes.exchange.secondstep.todeposit' defaultMessage={'{sourceCoin} to deposit:'} values={{ sourceCoin }} />
                </Text>
              </TableCell>
              <TableCell>
                <Text size='13px' weight={300}>{`${sendAmount} ${sourceCoin}`}</Text>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Text size='13px' weight={400}>
                  <FormattedMessage id='scenes.exchange.secondstep.txfee' defaultMessage='Transaction fee:' />
                </Text>
                <Tooltip>
                  <FormattedMessage id='scenes.exchange.secondstep.txfeeexplanation' defaultMessage='This fee is used to send the outgoing exchange funds to ShapeShift.' />
                </Tooltip>
              </TableCell>
              <TableCell>
                <Text size='13px' weight={300}>{`${sendFee} ${sourceCoin}`}</Text>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Text size='13px' weight={400}>
                  <FormattedMessage id='scenes.exchange.secondstep.leaving' defaultMessage={'Total {sourceCoin} leaving the wallet:'} values={{ sourceCoin }} />
                </Text>
              </TableCell>
              <TableCell>
                <Text size='13px' weight={300}>{`${sendTotal} ${sourceCoin}`}</Text>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Text size='13px' weight={400}>
                  <FormattedMessage id='scenes.exchange.secondstep.rate' defaultMessage='Exchange rate:' />
                </Text>
                <Tooltip>
                  <FormattedMessage id='scenes.exchange.secondstep.ratetooltip' defaultMessage='This rate may change depending on the market price at the time of your transaction.' />
                </Tooltip>
              </TableCell>
              <TableCell>
                <Text size='13px' weight={300}>{exchangeRate}</Text>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Text size='13px' weight={400}>
                  <FormattedMessage id='scenes.exchange.secondstep.networkfee' defaultMessage='Network transaction fee:' />
                </Text>
                <Tooltip>
                  <FormattedMessage id='scenes.exchange.secondstep.networkfeetooltip' defaultMessage='ShapeShift will use this fee to send the incoming exchange funds to your wallet.' />
                </Tooltip>
              </TableCell>
              <TableCell>
                <Text size='13px' weight={300}>{`${receiveFee} ${targetCoin}`}</Text>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Text size='13px' weight={400}>
                  <FormattedMessage id='scenes.exchange.exchangebox.secondstep.tobereceived' defaultMessage={`${targetCoin} to be received:`} />
                </Text>
              </TableCell>
              <TableCell>
                <Text size='13px' weight={300}>{`${receiveAmount} ${targetCoin}`}</Text>
              </TableCell>
            </TableRow>
          </Table>
        </Row>
        <Row>
          <Form onSubmit={handleSubmit}>
            <Field name='terms' validate={[checkboxShouldBeChecked]} component={CheckBox}>
              <Text size='12px' weight={300}>
                <Terms company='shapeshift' />
              </Text>
            </Field>
            <Row align='right'>
              <Link size='13px' weight={300} onClick={handleCancel}>
                <FormattedMessage id='scenes.exchange.secondstep.back' defaultMessage='Cancel' />
              </Link>
              <Button type='submit' nature='primary' disabled={submitting || invalid}>
                <FormattedMessage id='scenes.exchange.secondstep.finish' defaultMessage='Confirm' />
              </Button>
            </Row>
          </Form>
        </Row>
      </Body>
    </Wrapper>
  )
}

export default reduxForm({ form: 'exchange' })(Success)
