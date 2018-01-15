import * as AT from './actionTypes'
import { takeEvery, call, put, select } from 'redux-saga/effects'
import {
  phase,
  createCommitmentSigned,
  createFundingCreated, createOpenChannel, createRevokeAck,
  readAcceptChannel, readCommitmentSigned, readFundingSigned, readRevokeAck,
  readUpdateAddHtlc, createFundingLocked, readFundingLocked
} from './channel'
import {refresh} from './actions'
import {copy} from '../helper'
import TYPE from '../messages/types'
import {sendMessage} from '../peers/actions'
import {getChannelDir, getChannel} from './selectors'
import {connect} from './../peers/sagas'

const Long = require('long')

let options = {
  chainHash: Buffer.from('06226e46111a0b59caaf126043eb5bbf28c34f3a5e332a1fc7b2b73cf188910f', 'hex'),
  dustLimitSatoshis: Long.fromNumber(546),
  maxHtlcValueInFlightMsat: Long.fromNumber(100000),
  channelReserveSatoshis: Long.fromNumber(1000),
  feeRatePerKw: 10000,
  htlcMinimumMsat: 1,
  toSelfDelay: 60,
  maxAcceptedHtlcs: 100
}

export const channelSagas = (api, peersSaga) => {
  const getChannelId = msg => {
    if (msg.channelId !== undefined) {
      return msg.channelId
    } else if (msg.temporaryChannelId !== undefined) {
      return msg.temporaryChannelId
    } else {
      throw Error('Message doesnt have channelId defined ' + msg)
    }
  }

  const onOpenChannel = function * ({peer}) {
    console.info(peersSaga)
    console.info(JSON.stringify(peersSaga))
    yield call(peersSaga.connect, {publicKey: peer.toString('hex')})
    console.info('abc')
    yield call(openChannel, ({options}))
  }

  const openChannel = function * ({options}) {
    // Opening the channel
    const staticRemote = options.staticRemote

    let response = createOpenChannel(staticRemote, options, options.value)

    yield put(sendMessage(staticRemote, response.msg))
    yield put(refresh(response.channel))
  }

  const onBlock = function * () {
    let channels = yield select(getChannelDir)

    for (const channelId in channels) {
      const channel = channels[channelId]

      if (channel.phase === phase.FUNDING_BROADCASTED || channel.phase === phase.SENT_FUNDING_LOCKED) {
        // TODO get confirmations
        const confirmations = 5

        if (confirmations >= channel.paramsLocal.minimumDepth) {
          // TODO I THINK that we can resend FUNDING_LOCKED as often as we want, so we just fire and forget here
          let response = createFundingLocked(channel)

          yield put(sendMessage(channel.staticRemote, response.msg))
          yield put(refresh(response.channel))
        }
      }
    }
  }

  const onMessage = function * ({peer, msg}) {
    let channel = yield select(getChannel(getChannelId(msg)))
    let response
    channel = copy(channel)

    switch (msg.type) {
      case TYPE.ACCEPT_CHANNEL:
        channel = readAcceptChannel(channel, msg, peer)
        response = createFundingCreated(channel, undefined)
        break

      case TYPE.FUNDING_SIGNED:
        channel = readFundingSigned(channel, msg)
        yield call(api.pushTx, channel.fundingTx.toString('hex'))
        break

      case TYPE.FUNDING_LOCKED:
        channel = readFundingLocked(channel, msg)
        // TODO shall we send out an event if the channel is open now, or is it enough if the state reflects that change?
        break

      case TYPE.UPDATE_ADD_HTLC:
        channel = readUpdateAddHtlc(channel, msg)
        // TODO probably not the best to send commitments every time..
        response = createCommitmentSigned(channel)
        break

      case TYPE.COMMITMENT_SIGNED:
        channel = readCommitmentSigned(channel, msg)
        response = createRevokeAck(channel)
        break

      case TYPE.REVOKE_AND_ACK:
        channel = readRevokeAck(channel, msg)
        // TODO not sure, I think sometimes we want to send back a commitment signed message after this
        break

      case TYPE.ANNOUNCEMENT_SIGNATURES:
      case TYPE.CHANNEL_ANNOUNCEMENT:
      case TYPE.NODE_ANNOUNCEMENT:
      case TYPE.CHANNEL_UPDATE:
        break

      default: throw new Error('No message handler for ' + JSON.stringify(msg))
    }

    if (response !== undefined) {
      channel = response.channel

      // TODO should this be a direct call or a put?
      yield put(sendMessage(channel.staticRemote, response.msg))
    }

    yield put(refresh(channel))
  }

  // TODO how do we wire up the sagas?
  const takeSagas = function * () {
    yield takeEvery(AT.OPEN, onOpenChannel)
    yield takeEvery(AT.MESSAGE, onMessage)
    yield takeEvery(AT.ON_BLOCK, onBlock)
  }

  return {
    onOpenChannel,
    onMessage,
    onBlock,
    takeSagas
  }
}