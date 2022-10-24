import { FC, useEffect, useState } from 'react'
import HeaderBackgroundImage from '../assets/img/header-curtain.png'

import FilAddressForm from './FilAddressForm'
import WalletTransactionsHistory from './WalletTransactionsHistory'
import useWallet from '../hooks/StationWallet'
import TransferFundsButtons from './TransferFunds'
import { trasnferAllFundsToDestinationWallet } from '../lib/station-config'

interface PropsWallet {
  isOpen: boolean,
}

const WalletModule: FC<PropsWallet> = ({ isOpen = false }) => {
  const [editMode, setEditMode] = useState<boolean>(false)
  const [trasnferMode, setTransferMode] = useState<boolean>(false)
  const [stationAddress, destinationAddress, walletBalance, allTransactions, setUserAddress] = useWallet()

  useEffect(() => {
    setEditMode(false)
    setTransferMode(false)
  }, [isOpen])

  const enableEditMode = () => {
    setEditMode(true)
    setTransferMode(false)
  }

  const enableTransferMode = () => {
    setEditMode(false)
    setTransferMode(true)
  }

  const saveAddress = async (address: string) => {
    setUserAddress(address)
    setEditMode(false)
  }

  const transferAllFunds = async () => {
    await trasnferAllFundsToDestinationWallet()
    setTransferMode(false)
  }

  return (
    <div className='relative'>
      <div className='h-8 bg-primary-dark flex items-center px-8' onClick={() => setEditMode(false)}>
        <p className='text text-body-3xs text-white opacity-80 mr-3'>STATION ADDRESS</p>
        <p className='text text-body-3xs text-white'>{stationAddress}</p>
      </div>
      <div className='h-60 bg-primary bg-no-repeat bg-center' style={{ backgroundImage: `url(${HeaderBackgroundImage})` }}>
        <div className="py-6 px-6">
          <div className="flex flex-row justify-between align-baseline mb-6">
            <FilAddressForm
              destinationAddress={destinationAddress}
              saveDestinationAddress={saveAddress}
              editMode={editMode}
              setEditMode={enableEditMode} />
          </div>
          <div className="flex flex-row justify-between align-baseline" onClick={() => setEditMode(false)}>
            <div>
              <p className="w-fit text-body-3xs text-white opacity-80 uppercase">Total FIL</p>
              <p className="w-fit text-header-m text-white font-bold font-number">
                {walletBalance.toLocaleString()}<span className="text-header-3xs ml-3">FIL</span>
              </p>
            </div>
            {!editMode &&
              <TransferFundsButtons
                transferMode={trasnferMode}
                balance={walletBalance}
                enableTransferMode={enableTransferMode}
                transferAllFunds={transferAllFunds}
                disabled={ !!destinationAddress } />
            }
          </div>
        </div>
      </div>
      <div className="pb-6">
        <WalletTransactionsHistory allTransactions={allTransactions} />
      </div>
    </div>
  )
}

export default WalletModule
