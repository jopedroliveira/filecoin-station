import { useEffect } from 'react'
import { getStationAddress, startSaturnNode } from '../lib/station-config'

const Saturn = () => {
  useEffect(() => {
    (async () => {
      if (await getStationAddress()) {
        startSaturnNode()
      }
    })()
  }, [])

  return null
}

export default Saturn
