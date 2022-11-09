import { ActivityEventMessage } from '../typings'

export async function getOnboardingCompleted (): Promise<boolean> {
  return await window.electron.stationConfig.getOnboardingCompleted()
}

export async function setOnboardingCompleted (): Promise<void> {
  return await window.electron.stationConfig.setOnboardingCompleted()
}


export async function isSaturnNodeRunning (): Promise<boolean> {
  return await window.electron.saturnNode.isRunning()
}

export async function getSaturnNodeWebUrl (): Promise<string> {
  return await window.electron.saturnNode.getWebUrl()
}

export async function getSaturnNodeLog (): Promise<string> {
  return await window.electron.saturnNode.getLog()
}

export async function stopSaturnNode (): Promise<void> {
  return await window.electron.saturnNode.stop()
}

export async function startSaturnNode (): Promise<void> {
  return await window.electron.saturnNode.start()
}

export async function getAllActivities (): Promise<ActivityEventMessage[]> {
  return await window.electron.getAllActivities()
}

export async function getTotalEarnings (): Promise<number> {
  return 0
}

export async function getTotalJobsCompleted (): Promise<number> {
  return await window.electron.getTotalJobsCompleted()
}

export async function restartToUpdate (): Promise<void> {
  return await window.electron.restartToUpdate()
}

export function openReleaseNotes (): void {
  return window.electron.openReleaseNotes()
}

export async function getUserAddress (): Promise<string | undefined> {
  return await window.electron.stationConfig.getFilAddress()
}

export async function setUserAddress (address: string | undefined): Promise<void> {
  return await window.electron.stationConfig.setFilAddress(address)
}

export async function getStationAddress (): Promise<string> {
  // todo: wire backend
  return new Promise((resolve) => { resolve('f1mvpmuyawhjtuq5kntxvhiwfrmdr5iseaxtai7zq') })
}

export async function getWalletBalance (): Promise<number> {
  // todo: wire backend
  return new Promise((resolve) => { resolve(23) })
}

export async function transferFunds (): Promise<true> {
  // todo: wire backend
  return true
}
