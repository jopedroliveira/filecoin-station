import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFilAddress, getOnboardingCompleted } from '../lib/station-config'
import { ReactComponent as StationLogoLight } from '../assets/img/station-logo-light.svg'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const Welcome = (): JSX.Element => {
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      await sleep(2000)
      if (await getFilAddress()) {
        return navigate('/dashboard', { replace: true })
      }
      if (await getOnboardingCompleted()) {
        return navigate('/wallet', { replace: true })
      }
      return navigate('/onboarding', { replace: true })
    })()
  }, [navigate])

  return (
    <div className="fixed bg-grayscale-200 w-full h-full top-0 left-0 loading">
      <div className="flex justify-center items-center h-full w-full">
        <StationLogoLight width="720px" />
      </div>
    </div>
  )
}

export default Welcome
