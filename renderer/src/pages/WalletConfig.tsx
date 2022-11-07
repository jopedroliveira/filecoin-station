import BackgroundGraph from './../assets/img/graph.svg'
import UpdateBanner from '../components/UpdateBanner'

const WalletConfig = (): JSX.Element => {
  return (
    <div className="w-full h-full overflow-y-hidden relative">
      <UpdateBanner />
      <img src={BackgroundGraph} className="absolute -z-2 w-full h-full object-cover" alt="station background" />
      <div className='absolute -z-1 w-full h-full gradient-bg' />
      <div className="relative min-w-[840px] max-w-[1440px] h-full mx-auto my-0">
        <div className='md:ml-12 xl:w-full max-w-[980px] h-full flex flex-col justify-center'>
          <h2 className="title text-black mb-24 font-bold text-header-xl">
            Connect a FIL address to Station to start <span className='text-primary'> earning FIL</span>
          </h2>
        </div>
      </div>

    </div>
  )
}

export default WalletConfig
