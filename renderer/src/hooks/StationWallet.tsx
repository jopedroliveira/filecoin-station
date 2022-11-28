import { useState, useEffect } from 'react'
import {
  getDestinationWalletAddress,
  setDestinationWalletAddress,
  getStationWalletAddress,
  getStationWalletBalance,
  getStationWalletTransactionsHistory
} from '../lib/station-config'
import { FILTransaction } from '../typings'

const useWallet = (): [string, string | undefined, number, FILTransaction[] | [], (address: string|undefined) => void, FILTransaction | undefined, () => void] => {
  const [stationAddress, setStationAddress] = useState<string>('')
  const [destinationFilAddress, setDestinationFilAddress] = useState<string | undefined>()
  const [walletBalance, setWalletBalance] = useState<number>(0)
  const [walletTransactions, setWalletTransactions] = useState<FILTransaction[]>([])
  const [currentTransaction, setCurrentTransaction] = useState<FILTransaction | undefined>()

  const setDestinationAddress = async (address: string | undefined) => {
    await setDestinationWalletAddress(address)
    setDestinationFilAddress(address)
  }

  const dismissCurrentTransaction = () => {
    if (currentTransaction && currentTransaction.status !== 'processing') {
      setWalletTransactions([currentTransaction, ...walletTransactions])
      setCurrentTransaction(undefined)
    }
  }

  useEffect(() => {
    const loadStoredInfo = async () => {
      setDestinationFilAddress(await getDestinationWalletAddress())
      setStationAddress(await getStationWalletAddress())
      setWalletBalance(await getStationWalletBalance())
      setWalletTransactions(await getStationWalletTransactionsHistory())
    }
    loadStoredInfo()
  }, [stationAddress, destinationFilAddress])

  useEffect(() => {
    const updateWalletTransactionsArray = (transactions: FILTransaction[]) => {
      const newCurrentTransaction = transactions[0]
      if (newCurrentTransaction.status === 'processing' || (currentTransaction && +currentTransaction.timestamp === +newCurrentTransaction.timestamp)) {
        setCurrentTransaction(newCurrentTransaction)
        if (newCurrentTransaction.status !== 'processing') { setTimeout(() => { setWalletTransactions(transactions); setCurrentTransaction(undefined) }, 6000) }

        const transactionsExceptLatest = transactions.filter((t) => { return t !== newCurrentTransaction })
        setWalletTransactions(transactionsExceptLatest)
      } else {
        setWalletTransactions(transactions)
      }
    }

    const unsubscribeOnTransactionUpdate = window.electron.stationEvents.onTransactionUpdate(updateWalletTransactionsArray)
    const unsubscribeOnBalanceUpdate = window.electron.stationEvents.onBalanceUpdate(setWalletBalance)
    return () => {
      unsubscribeOnTransactionUpdate()
      unsubscribeOnBalanceUpdate()
    }
  }, [currentTransaction, walletBalance])

  return [stationAddress, destinationFilAddress, walletBalance, walletTransactions, setDestinationAddress, currentTransaction, dismissCurrentTransaction]
}

export default useWallet
