import { FC } from 'react'
import { ReactComponent as EditIcon } from '../assets/img/edit.svg'

interface FilAddressDisplayProps {
  userAddress: string,
  setEditMode: () => void
}

const FilAddressDisplay: FC<FilAddressDisplayProps> = ({ userAddress, setEditMode }) => {
  return (
    <div className="pt-2 w-full flex items-end">
      <div className="relative z-0 w-[460px]">
        <label htmlFor="address"
          className="text-white opacity-80 font-body text-body-3xs uppercase mb-3">Your FIL Address</label>
        <div className="input w-full block fil-address text-body-m mb-3">{userAddress}</div>
      </div>
      <i className='flex flex-row items-end m-3 cursor-pointer group' onClick={() => { setEditMode() }}>
        <EditIcon className="btn-icon-primary icon-primary-white mr-1" type="button" />
        <span className='text-white invisible group-hover:visible not-italic text-body-m font-body'>Edit</span>
      </i>
    </div>
  )
}

export default FilAddressDisplay
