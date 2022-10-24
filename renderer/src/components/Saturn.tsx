import { useEffect } from 'react'
import { getStationWalletAddress, startSaturnNode } from '../lib/station-config'

const Saturn = () => {
  useEffect(() => {
    (async () => {
      if (await getStationWalletAddress()) {
        startSaturnNode()
      }
    })()
  }, [])

  return null
}

export default Saturn
