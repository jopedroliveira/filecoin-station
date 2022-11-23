import { FC, useEffect, useState } from 'react'
import HeaderBackgroundImage from '../assets/img/header-curtain.png'
import { ReactComponent as EditIcon } from '../assets/img/icons/edit.svg'

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
  const [stationAddress, destinationAddress, walletBalance, allTransactions, setUserAddress, latestTransaction, dismissLatestTransaction] = useWallet()

  useEffect(() => {
    setEditMode(false)
    setTransferMode(false)
    dismissLatestTransaction()
  }, [isOpen])

  const reset = () => {
    setEditMode(false)
    setTransferMode(false)
  }

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
      <div className='h-8 bg-primary-dark flex items-center px-8' onClick={reset}>
        <p className='text text-body-3xs text-white opacity-80 mr-3'>STATION ADDRESS</p>
        <p className='text text-body-3xs text-white'>{stationAddress}</p>
      </div>
      <div className='h-60 bg-primary bg-no-repeat bg-center' style={{ backgroundImage: `url(${HeaderBackgroundImage})` }}>
        <div className="py-6 px-6">
          <div className="flex flex-row justify-between align-baseline mb-6">
            {!destinationAddress || editMode
              ? <FilAddressForm
                destinationAddress={destinationAddress}
                saveDestinationAddress={saveAddress} />
              : <div className="w-full flex flex-col z-0 items-start mb-[31px]">
                <span className="text-white opacity-80 font-body text-body-3xs uppercase">Your FIL Address</span>
                <div className="relative mr-2 flex">
                  <p className="w-fit max-w-[460px] text-header-3xs font-body text-white mt-3">{destinationAddress}</p>
                  <button className='flex flex-row items-end mx-3 cursor-pointer group' tabIndex={1} onClick={enableEditMode}>
                    <EditIcon className="btn-icon-primary mr-1" />
                    <span className='text-white hidden group-hover:block opacity-80 not-italic text-body-m font-body'>Edit</span>
                  </button>
                </div>
              </div>}
          </div>
          <div className="flex flex-row justify-between align-baseline" onClick={() => { setEditMode(false) }}>
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
                disabled={!destinationAddress} />
            }
          </div>
        </div>
      </div>
      <div className="pb-6">
        <WalletTransactionsHistory allTransactions={allTransactions} latestTransaction={latestTransaction}/>
      </div>
    </div>
  )
}

export default WalletModule
