import { Activity } from '../main/typings'

export declare global {
  interface Window {
    electron: {
      stationBuildVersion: string,
      saturnNode: {
        start: () => Promise<void>,
        stop: () => Promise<void>,
        isRunning: () => Promise<boolean>,
        isReady: () => Promise<boolean>,
        getLog: () => Promise<string>,
        getWebUrl: () => Promise<string>,
        setUserAddress: (address: string | undefined) => Promise<void>
      },
      stationConfig: {
        getAllActivities(): Promise<Activity[]>,
        getTotalJobsCompleted(): Promise<number>,
        getStationConfig: () => Promise<StationConfig>,
        openReleaseNotes(): void,
        restartToUpdate(): void,
      },
      stationEvents: {
        onUpdateAvailable: (callback: () => void) => () => void
        onActivityLogged: (callback) => () => void
        onJobProcessed: (callback) => () => void
        onEarningsChanged: (callback) => () => void
        onBalanceChange: (callback) => () => void
        onTransactionsChange: (callback) => () => void
      },
      dialogs: {
        confirmChangeWalletAddress: () => Promise<boolean>
      }
    }
  }
}

export type ActivityEventMessage = {
  id: string;
  timestamp: number;
  type: string;
  source: string;
  message: string;
}

export type Transaction = {
  timestamp: number;
  status: 'success' | 'pending' | 'error';
  amount: number;
  destination: string
}

export type StationConfig = {
  updateAvailable: boolean
  onboardingCompleted: boolean;
  totalEarnings: number;
  totalJobs: number;
  activityLog: ActivityEventMessage[];
  userAddress: string | undefined;
  stationAddress: string;
  stationBalance: number;
  stationTransactions: Transaction[]
}
