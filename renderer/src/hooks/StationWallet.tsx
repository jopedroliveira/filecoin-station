import { useState, useEffect } from 'react'
import {
  getDestinationWalletAddress,
  setDestinationWalletAddress,
  getStationWalletAddress,
  getStationWalletBalance,
  getStationWalletTransactionsHistory
} from '../lib/station-config'
import { FILTransaction } from '../typings'

const useWallet = () : [string, string | undefined, number, FILTransaction[]|[], (address:string) => void ] => {
  const [stationAddress, setStationAddress] = useState<string>('')
  const [destinationFilAddress, setDestinationFilAddress] = useState<string | undefined>()
  const [walletBalance, setWalletBalance] = useState<number>(0)
  const [walletTransactions, setWalletTransactions] = useState<FILTransaction[]>([])

  useEffect(() => {
    const loadStoredInfo = async () => {
      setDestinationFilAddress(await getDestinationWalletAddress())
      setStationAddress(await getStationWalletAddress())
      setWalletBalance(await getStationWalletBalance())
      setWalletTransactions(await getStationWalletTransactionsHistory())
    }
    loadStoredInfo()

    const unsubscribeOnTransactionUpdate = window.electron.stationEvents.onTransactionUpdate(setWalletTransactions)
    const unsubscribeOnBalanceUpdate = window.electron.stationEvents.onBalanceUpdate(setWalletBalance)
    return () => {
      unsubscribeOnTransactionUpdate()
      unsubscribeOnBalanceUpdate()
    }
  }, [stationAddress, destinationFilAddress])

  const setUserAddress = async (address: string) => {
    await setDestinationWalletAddress(address)
    setDestinationFilAddress(address)
  }

  return [stationAddress, destinationFilAddress, walletBalance, walletTransactions, setUserAddress]
}

export default useWallet
