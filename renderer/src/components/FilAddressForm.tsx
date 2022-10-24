import { FC, useState, SyntheticEvent, ChangeEvent } from 'react'
import { checkAddressString } from '@glif/filecoin-address'
import { ReactComponent as Warning } from '../assets/img/icons/error.svg'
import { ReactComponent as EditIcon } from '../assets/img/icons/edit.svg'

interface FilAddressFormProps {
  destinationAddress: string | undefined,
  saveDestinationAddress: (address: string) => void,
  editMode: boolean,
  setEditMode: () => void
}

const FilAddressForm: FC<FilAddressFormProps> = ({ destinationAddress = '', saveDestinationAddress, editMode, setEditMode }) => {
  const [addressIsValid, setAddressIsValid] = useState<boolean | undefined>(true)
  const [inputAddr, setInputAddr] = useState<string>(destinationAddress)
  const validationThreshold = 4

  const handleChangeAddress = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
    setInputAddr(inputValue)
    try {
      checkAddressString(inputValue)
      setAddressIsValid(true)
    } catch (err) {
      if (err === 'Invalid secp256k1 address length') {
        setAddressIsValid(undefined)
      } else {
        setAddressIsValid(false)
      }
    }
  }

  const handleAuthenticate = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (addressIsValid) {
      saveDestinationAddress(inputAddr)
    }
  }

  const computeInputClasses = () => {
    const listOfClasses = 'input w-full block fil-address mt-[7px]'
    if (inputAddr.length <= validationThreshold) {
      return listOfClasses
    }

    if (addressIsValid) {
      return `${listOfClasses} border-solid border-green-100 focus:border-solid focus:border-green-100`
    } else {
      return `${listOfClasses} border-red-200 focus:border-red-200`
    }
  }

  const renderBottomMessage = () => {
    if (inputAddr.length < validationThreshold) {
      return (<p className="text-body-2xs text-white mt-3">Enter an address to receive your FIL.</p>)
    }

    if (addressIsValid) {
      return (<p className="text-body-2xs text-white mt-3">Enter an address to receive your FIL.</p>)
    }

    return (
      <div className='flex flex-row items-center mt-3'>
        <Warning width={'12px'} height={'12px'} fill="#ff4d81" />
        <span className="ml-1 text-red-200 text-body-2xs">The FIL address entered is invalid. Please check and try again.</span>
      </div>
    )
  }

  return (
    <>
      {!destinationAddress || editMode
        ? <form onSubmit={handleAuthenticate} className="w-full flex justify-between items-center">
            <div className="relative z-0 w-[460px] flex flex-col mt-[20px]">
              <input
                spellCheck="false" autoComplete="off" type="text" name="address"
                placeholder=" "
                tabIndex={0} defaultValue={destinationAddress} onChangeCapture={handleChangeAddress}
                className={computeInputClasses()} />
              <label htmlFor="address"
                className="absolute duration-300 top-3 origin-top-lef pointer-events-none text-white opacity-80 font-body text-body-2xs uppercase mb-3">
                Your FIL Address</label>
              {renderBottomMessage()}
            </div>
            {inputAddr.length > validationThreshold &&
              <button
                className="btn-primary mb-6 submit-address bg-grayscale-250 text-primary"
                disabled={!(addressIsValid !== undefined && addressIsValid)}
                title="save address" type="submit" value="connect">
                <span className="text-xs px-4">Save Address</span>
              </button>}
          </form>
        : <div className="w-full flex flex-col z-0 items-start mb-[31px]">
            <span className="text-white opacity-80 font-body text-body-3xs uppercase">Your FIL Address</span>
            <div className="relative mr-2 flex">
              <p className="w-fit max-w-[460px] text-header-3xs font-body text-white mt-3">{destinationAddress}</p>
              <button className='flex flex-row items-end mx-3 cursor-pointer group' tabIndex={1} onClick={setEditMode}>
                <EditIcon className="btn-icon-primary mr-1" />
                <span className='text-white hidden group-hover:visible not-italic text-body-m font-body'>Edit</span>
              </button>
            </div>
          </div>
      }
    </>
  )
}

export default FilAddressForm
