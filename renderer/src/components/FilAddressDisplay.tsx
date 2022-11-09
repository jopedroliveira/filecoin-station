import { FC } from 'react'
import { ReactComponent as EditIcon } from '../assets/img/edit.svg'

interface FilAddressDisplayProps {
  userAddress: string,
  setEditMode: () => void
}

const FilAddressDisplay: FC<FilAddressDisplayProps> = ({ userAddress, setEditMode }) => {
  return (
    <div className="w-full flex items-end mb-[31px]">
      <div className="relative z-0 w-[460px] flex flex-col">
        <span className="text-white opacity-80 font-body text-body-3xs uppercase">Your FIL Address</span>
        <p className="w-full text-header-3xs font-body text-white mt-3">{userAddress}</p>
      </div>
      <button className='flex flex-row items-end mx-3 cursor-pointer group' tabIndex={1} onClick={setEditMode}>
        <EditIcon className="btn-icon-primary icon-primary-white mr-1"/>
        <span className='text-white hidden group-hover:visible not-italic text-body-m font-body'>Edit</span>
      </button>
    </div>
  )
}

export default FilAddressDisplay
