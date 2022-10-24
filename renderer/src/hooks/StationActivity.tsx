import { useState, useEffect } from 'react'
import { getTotalJobsCompleted, getAllActivities, getTotalEarnings } from '../lib/station-config'
import { ActivityEventMessage } from '../typings'

const useStationActivity = () : [number, number, ActivityEventMessage[]] => {
  const [totalJobs, setTotalJobs] = useState<number>(0)
  const [activities, setActivities] = useState<ActivityEventMessage[]>([])
  const [totalEarnings, setTotalEarnigs] = useState<number>(0)

  useEffect(() => {
    const loadStoredInfo = async () => {
      Promise.all([
        (async () => { setTotalJobs(await getTotalJobsCompleted()) })(),
        (async () => { setActivities(await getAllActivities()) })(),
        (async () => { setTotalEarnigs(await getTotalEarnings()) })()
      ])
    }

    loadStoredInfo()

    const unsubscribeOnJobProcessed = window.electron.stationEvents.onJobProcessed(setTotalJobs)
    const unsubscribeOnActivityLogged = window.electron.stationEvents.onActivityLogged(setActivities)
    const unsubscribeOnEarningsChanged = window.electron.stationEvents.onEarningsChanged(setTotalEarnigs)

    return () => {
      unsubscribeOnJobProcessed()
      unsubscribeOnActivityLogged()
      unsubscribeOnEarningsChanged()
    }
  }, [])

  return [totalJobs, totalEarnings, activities]
}

export default useStationActivity
