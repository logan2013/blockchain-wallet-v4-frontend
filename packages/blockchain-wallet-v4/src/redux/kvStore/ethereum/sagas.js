// import { call, put, select } from 'redux-saga/effects'
// import { compose } from 'ramda'
// import * as A from './actions'
// import { KVStoreEntry } from '../../../types'
// import { getMetadataXpriv } from '../root/selectors'
// import { derivationMap, ETHEREUM } from '../config'

// const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

// export const ethereum = ({ api } = {}) => {
//   const callTask = function * (task) {
//     return yield call(compose(taskToPromise, () => task))
//   }
//   const fetchMetadataEthereum = function * () {
//     const typeId = derivationMap[ETHEREUM]
//     const mxpriv = yield select(getMetadataXpriv)
//     const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId)
//     const newkv = yield callTask(api.fetchKVStore(kv))
//     yield put(A.setEthereum(newkv))
//   }

//   return {
//     fetchEthereum
//   }
// }
