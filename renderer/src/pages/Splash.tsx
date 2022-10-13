import Logo from '../components/Logo'

const Splash = (): JSX.Element => {
  return (
    <div className="fixed bg-grayscale-200 w-full h-full top-0 left-0 loading">
      <div className="flex flex-col justify-center items-center h-full w-full">
        <Logo />
      </div>
    </div>
  )
}

export default Splash
