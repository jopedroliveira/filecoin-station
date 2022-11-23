import { useState, useEffect } from 'react'
import {
  getDestinationWalletAddress,
  setDestinationWalletAddress,
  getStationWalletAddress,
  getStationWalletBalance,
  getStationWalletTransactionsHistory
} from '../lib/station-config'
import { FILTransaction } from '../typings'

const useWallet = (): [string, string | undefined, number, FILTransaction[] | [], (address: string) => void, FILTransaction | undefined, () => void] => {
  const datt = Date.now()
  const [stationAddress, setStationAddress] = useState<string>('')
  const [destinationFilAddress, setDestinationFilAddress] = useState<string | undefined>()
  const [walletBalance, setWalletBalance] = useState<number>(0)
  const [walletTransactions, setWalletTransactions] = useState<FILTransaction[]>([])
  const [latestTransaction, setLatestTransaction] = useState<FILTransaction | undefined>({
    timestamp: datt,
    status: 'processing',
    outgoing: true,
    amount: '32',
    address: 'f1mvpmuyawhjtuq5kntxvhiwfrmdr5iseaxtai7zq'
  })

  const setUserAddress = async (address: string | undefined) => {
    await setDestinationWalletAddress(address)
    setDestinationFilAddress(address)
  }

  const dismissLatestTransaction = () => {
    if (latestTransaction && latestTransaction.status !== 'processing') {
      setLatestTransaction(undefined)
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

    const updateWalletTransactionsArray = (transactions: FILTransaction[]) => {
      const newLatestTransaction = transactions[0]

      if (newLatestTransaction.status === 'processing' || latestTransaction?.timestamp === newLatestTransaction.timestamp) {
        setLatestTransaction(newLatestTransaction)
        setTimeout(() => setLatestTransaction(undefined), 2000)
      }
      setWalletTransactions(transactions)
    }

    const unsubscribeOnTransactionUpdate = window.electron.stationEvents.onTransactionUpdate(updateWalletTransactionsArray)
    const unsubscribeOnBalanceUpdate = window.electron.stationEvents.onBalanceUpdate(setWalletBalance)
    return () => {
      unsubscribeOnTransactionUpdate()
      unsubscribeOnBalanceUpdate()
    }
  }, [stationAddress, destinationFilAddress, latestTransaction])

  return [stationAddress, destinationFilAddress, walletBalance, walletTransactions, setUserAddress, latestTransaction, dismissLatestTransaction]
}

export default useWallet
