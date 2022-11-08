import { FC, useEffect, useState } from 'react'
import HeaderBackgroundImage from '../assets/img/header-curtain.png'
import { ReactComponent as InfoIcon } from '../assets/img/info.svg'
import FilAddressDisplay from './FilAddressDisplay'
import FilAddressForm from './FilAddressForm'
import { getFilAddress, setFilAddress as saveFilAddress } from '../lib/station-config'

interface PropsWallet {
  isOpen: boolean,
  setIsOpen: (state: boolean) => void,
  totalFIL: number | undefined
}

const Wallet: FC<PropsWallet> = ({ isOpen = false, setIsOpen, totalFIL = 0 }) => {
  const [userAddress, setUserAddress] = useState<string | undefined>()
  const [editMode, setEditMode] = useState<boolean>(false)
  const [trasnferMode, setTransferMode] = useState<boolean>(false)

  useEffect(() => {
    const loadStoredInfo = async () => {
      setUserAddress(await getFilAddress())
    }
    loadStoredInfo()
  }, [userAddress])

  const saveUserAddress = async (address: string) => {
    await saveFilAddress(address)
    setUserAddress(address)
    setEditMode(false)
  }

  const closeCurtain = () => {
    setIsOpen(false)
    setEditMode(false)
    setTransferMode(false)
  }

  return (
    <>
      <div className={`absolute h-full w-full bg-primary transition-all duration-[800ms] ease-in-out ${isOpen ? 'z-30 opacity-20 visible' : 'opacity-0 z-[25] invisible'}`}
        onClick={closeCurtain} />
      <div className={`absolute z-30  w-[733px] h-full bg-grayscale-300 transition-all duration-[800ms] ease-in-out ${isOpen ? 'right-0' : '-right-[733px] invisible'}`} >
        <div className='relative'>
          <div className='h-8 bg-[#330867] flex items-center px-8' onClick={() => setEditMode(false)}>
            <span className='text text-body-3xs text-white opacity-80 mr-3'>FILECOIN ADDRESS</span>
            <span className='text text-body-3xs text-white'>f1443254jnkbvgye2343</span>
          </div>
          <div className='h-60 bg-primary bg-no-repeat bg-center' style={{ backgroundImage: `url(${HeaderBackgroundImage})` }}>
            <div className="py-6 px-8">
              <div className="flex flex-row justify-between align-baseline mb-6" onClick={() => setEditMode(false)}>
                <div>
                  <p className="w-fit text-body-3xs text-white opacity-80 uppercase">Total FIL</p>
                  <p className="w-fit text-header-m text-white font-bold font-number" title="total earnings">{totalFIL}<span className="text-header-3xs ml-3">FIL</span></p>
                </div>
                {!editMode
                  ? trasnferMode
                    ? <div className='relative flex gap-1 items-center'>
                      <button className="btn-primary bg-[#E9EBF1] text-primary">
                        <span className="text-2xs px-4 text-body-s">Send <span className='font-bold'>{totalFIL} FIL</span></span>
                      </button>
                      <button
                        className="btn-primary"
                        onClick={() => { setTransferMode(false) }}>
                        <span className="text-2xs px-4 text-body-s">Cancel</span>
                      </button>
                    </div>
                    : <div className='relative flex items-center'>
                      <button
                        tabIndex={1}
                        className="btn-primary
                        bg-transparent text-white border border-white border-solid border-1"
                        disabled={!userAddress}
                        onClick={() => { setTransferMode(true) }}>
                        <span className="text-2xs px-4 text-body-s">Transfer FIL</span>
                      </button>
                      {!userAddress &&
                        <InfoIcon className="absolute center -ml-3.5 fill-[#C3CAD9]" width={'24px'} height={'24px'} />
                      }
                    </div>
                  : ''}
              </div>
              <div className="flex flex-row justify-between align-baseline">
                {editMode || !userAddress
                  ? <FilAddressForm userAddress={userAddress} saveUserAddress={saveUserAddress} />
                  : <FilAddressDisplay userAddress={userAddress} setEditMode={() => { setEditMode(true); setTransferMode(false) }} />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Wallet
