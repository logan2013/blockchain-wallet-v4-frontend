import { prop, path } from 'ramda'
import { selectors } from 'data'
import moment from 'moment'

export const getData = (state, trade) => {
  const address = path(['quote', 'deposit'], trade)
  const date = moment(prop('timestamp', trade)).format('DD MMMM YYYY, HH:mm')
  const status = prop('status', trade)
  const tradeStatus = selectors.core.data.shapeShift.getTrade(state, address)

  const transform = tradeStatus => ({
    status,
    address,
    date,
    incomingCoin: tradeStatus.incomingCoin,
    incomingType: tradeStatus.incomingType,
    outgoingCoin: tradeStatus.outgoingCoin,
    outgoingType: tradeStatus.outgoingType
  })

  return tradeStatus.map(transform)
}
