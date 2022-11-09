import { FC, useEffect, useState } from 'react'
import HeaderBackgroundImage from '../assets/img/header-curtain.png'
import { ReactComponent as InfoIcon } from '../assets/img/info.svg'
import FilAddressDisplay from './FilAddressDisplay'
import FilAddressForm from './FilAddressForm'
import {
  getUserAddress,
  setUserAddress as saveUserFilAddress,
  getStationAddress,
  getWalletBalance,
  transferFunds
} from '../lib/station-config'

interface PropsWallet {
  isOpen: boolean,
  setIsOpen: (state: boolean) => void
}

const Wallet: FC<PropsWallet> = ({ isOpen = false, setIsOpen }) => {
  const [stationAddress, setStationAddress] = useState<string>()
  const [userFilAddress, setUserFilAddress] = useState<string | undefined>()
  const [editMode, setEditMode] = useState<boolean>(false)
  const [trasnferMode, setTransferMode] = useState<boolean>(false)
  const [walletBalance, setWalletBalance] = useState<number>(0)

  useEffect(() => {
    const loadStoredInfo = async () => {
      setUserFilAddress(await getUserAddress())
      setStationAddress(await getStationAddress())
      setWalletBalance(await getWalletBalance())
    }
    loadStoredInfo()
  }, [userFilAddress])

  const saveAddress = async (address: string) => {
    await saveUserFilAddress(address)
    setUserFilAddress(address)
    setEditMode(false)
  }

  const closeCurtain = () => {
    setIsOpen(false)
    setEditMode(false)
    setTransferMode(false)
  }

  const enableEditMode = () => {
    setEditMode(true)
    setTransferMode(false)
  }

  const transferAllFunds = async () => {
    await transferFunds()
    setTransferMode(false)
  }

  const renderUserAddressInput = () => {
    if (editMode || !userFilAddress) {
      return (<FilAddressForm userAddress={userFilAddress} saveUserAddress={saveAddress} />)
    }
    return (<FilAddressDisplay userAddress={userFilAddress} setEditMode={enableEditMode} />)
  }

  const renderTransferCommands = () => {
    if (!editMode && trasnferMode) {
      return (
        <div className='relative flex gap-1 items-center'>
          <button className="btn-primary bg-grayscale-250 text-primary">
            <span className="text-2xs px-4 text-body-s">Send <span className='font-bold'>{walletBalance} FIL</span></span>
          </button>
          <button className="btn-primary" onClick={transferAllFunds}>
            <span className="text-2xs px-4 text-body-s">Cancel</span>
          </button>
        </div>
      )
    } else if (!editMode) {
      return (
        <div className='relative flex items-center'>
          <button className="btn-primary bg-transparent text-white border border-white border-solid border-1"
            disabled={!userFilAddress && walletBalance > 0}
            onClick={() => { setTransferMode(true) }}>
            <span className="text-2xs px-4 text-body-s">Transfer FIL</span>
          </button>
          {!userFilAddress && <InfoIcon className="absolute center -ml-3.5 fill-grayscale-450" width={'24px'} height={'24px'} />}
        </div>
      )
    }
  }

  return (
    <>
      <div className={`absolute h-full w-full bg-primary transition-all duration-[800ms] ease-in-out ${isOpen ? 'z-30 opacity-20 visible' : 'opacity-0 z-[25] invisible'}`}
        onClick={closeCurtain} />
      <div className={`absolute z-30  w-[733px] h-full bg-white transition-all duration-[800ms] ease-in-out ${isOpen ? 'right-0' : '-right-[733px] invisible'}`} >
        <div className='relative'>
          <div className='h-8 bg-primary-dark flex items-center px-8' onClick={() => setEditMode(false)}>
            <span className='text text-body-3xs text-white opacity-80 mr-3'>STATION ADDRESS</span>
            <span className='text text-body-3xs text-white'>{stationAddress}</span>
          </div>
          <div className='h-60 bg-primary bg-no-repeat bg-center' style={{ backgroundImage: `url(${HeaderBackgroundImage})` }}>
            <div className="py-6 px-6">
              <div className="flex flex-row justify-between align-baseline mb-6">
                {renderUserAddressInput()}
              </div>
              <div className="flex flex-row justify-between align-baseline" onClick={() => setEditMode(false)}>
                <div>
                  <p className="w-fit text-body-3xs text-white opacity-80 uppercase">Total FIL</p>
                  <p className="w-fit text-header-m text-white font-bold font-number" title="total earnings">
                    {walletBalance}<span className="text-header-3xs ml-3">FIL</span>
                  </p>
                </div>
                {renderTransferCommands()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Wallet
