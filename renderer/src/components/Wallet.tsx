import { useState } from 'react'

const Wallet = () => {
  const [open, setOpen] = useState(true)

  return (
    <>
      <div className="z-30 absolute left-0 top-0 w-full h-full overflow-hidden">
        <button className='btn-primary' onClick={() => { setOpen(!open) }}>Toggle</button>
        <div className={`bg-primary opacity-75 fixed h-full w-full ${open ? 'visible' : 'hidden'}`}></div>
        <div className={`h-full bg-grayscale-300 fixed transition-all duration-[2000ms] w-1/2 ${open ? 'right-0' : '-right-1/2'}`} >
          <div className='relative'>
            <button className='btn-primary' onClick={() => { setOpen(!open) }}>Toggle</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Wallet
