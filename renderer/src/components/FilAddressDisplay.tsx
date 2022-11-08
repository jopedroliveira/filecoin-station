import { FC } from 'react'
import { ReactComponent as EditIcon } from '../assets/img/edit.svg'

interface FilAddressDisplayProps {
  userAddress: string,
  setEditMode: () => void
}

const FilAddressDisplay: FC<FilAddressDisplayProps> = ({ userAddress, setEditMode }) => {
  return (
    <div className="pt-2 w-full flex items-end">
      <div className="relative z-0 w-[460px] mb-3">
        <label className="text-white opacity-80 font-body text-body-3xs uppercase mb-3">
          Your FIL Address
        </label>
        <p className="w-full text-header-3xs font-body text-white">{userAddress}</p>
      </div>
      <button className='flex flex-row items-end m-3 cursor-pointer group' tabIndex={1} onClick={setEditMode}>
        <EditIcon className="btn-icon-primary icon-primary-white mr-1"/>
        <span className='text-white hidden group-hover:visible not-italic text-body-m font-body'>Edit</span>
      </button>
    </div>
  )
}

export default FilAddressDisplay
