import { FC } from 'react'

interface PropsWallet {
  isOpen: boolean,
  setIsOpen: (state: boolean) => void
}

const Wallet: FC<PropsWallet> = ({ isOpen = false, setIsOpen }) => {
  return (
    <>
      <div className={`absolute h-full w-full bg-primary transition-all duration-[2000ms] ease-in-out ${isOpen ? 'z-30 opacity-20 visible' : 'opacity-0 z-[25] invisible'}`}
        onClick={() => { setIsOpen(false) }} ></div>
      <div className={`absolute z-30 h-full bg-grayscale-300 transition-all duration-[2000ms] w-1/2 ${isOpen ? 'right-0' : '-right-1/2'}`} >
        <div className='relative'>
          <div className='h-8 bg-primary-hover flex items-center px-8'>
            <span className='text text-body-3xs text-white'>FILECOIN ADDRESS</span>
            <span className='text text-body-2xs text-white mx-2'>f012342er</span>
          </div>
          <div className='bg-primary h-60'>
            <div className="pointer-events-none absolute h-20 bg-grayscale-300 w-full z-10 bottom-0"
              style={{
                WebkitMaskImage: 'linear-gradient(transparent, #ededed80)',
                maskImage: 'linear-gradient(transparent, #ededed80)'
              }}>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Wallet
