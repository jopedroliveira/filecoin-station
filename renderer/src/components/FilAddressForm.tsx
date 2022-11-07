import { ChangeEvent, useState, FC } from 'react'
import { checkAddressString } from '@glif/filecoin-address'
import { ReactComponent as Warning } from '../assets/img/error.svg'
interface FilAddressFormProps {
  userAddress: string | undefined,
  saveUserAddress: (address: string) => void
}

const FilAddressForm: FC<FilAddressFormProps> = ({ userAddress = '', saveUserAddress }) => {
  const [addressIsValid, setAddressIsValid] = useState<boolean | undefined>(true)
  const [inputAddr, setInputAddr] = useState<string>(userAddress)

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

  const handleAuthenticate = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (addressIsValid) {
      saveUserAddress(inputAddr)
    }
  }

  return (
    <form onSubmit={handleAuthenticate} className="pt-2 w-full flex justify-between">
      <div className="relative z-0 w-[460px]">
        <label htmlFor="address"
          className=" text-white opacity-80 font-body text-body-3xs uppercase mb-3">
          Your FIL Address</label>
        <input
          spellCheck="false" autoComplete="off" type="text" name="address"
          placeholder="Enter your FIL address"
          tabIndex={0} defaultValue={inputAddr} onChangeCapture={handleChangeAddress}
          className={`input w-full block fil-address text-body-m mb-3 
          ${inputAddr.length > 3
              ? addressIsValid
                ? 'border-solid border-success focus:border-solid focus:border-success'
                : ' border-error focus:border-error'
              : ''}`} />

        {inputAddr.length > 3
          ? addressIsValid
            ? <p className="text-body-2xs text-white mt-3">Enter an address to receive your FIL.</p>
            : <div className='flex flex-row items-center'>
                <Warning width={'12px'} height={'12px'} fill="#ff4d81" />
                <span className="ml-1 text-white text-body-2xs">The FIL address entered is invalid. Please check and try again.</span>
              </div>
          : <p className="text-body-2xs text-white mt-3">Enter an address to receive your FIL.</p>
        }
      </div>
      {inputAddr.length > 3 &&
          <button className="btn-primary-white submit-address bg-[#E9EBF1]"
            disabled={!(addressIsValid !== undefined && addressIsValid)}
            title="save address" type="submit" value="connect">
            <span className="text-xs px-4">Save Address</span>
          </button>}
    </form>
  )
}

export default FilAddressForm
