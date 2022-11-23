import { FC } from 'react'
import useWallet from '../hooks/StationWallet'

import { ReactComponent as WalletIcon } from '../assets/img/icons/wallet.svg'
import WalletTransactoinStatusWidget from './WalletTransactionStatusWidget'

interface WalletWidgetProps {
  onClick: () => void
}

const WalletWidget: FC<WalletWidgetProps> = ({ onClick }) => {
  const [,, balance,,, latestTransaction, dismissLatestTransaction] = useWallet()

  console.log(latestTransaction)
  return (
    <div onClick={() => { onClick(); dismissLatestTransaction() }}>
      <div className='flex items-center '>
        <WalletIcon />
        <span className="text-right mx-3" title="wallet"><span className='font-bold'>{balance.toLocaleString() || '-'}</span> FIL</span>
        <button type="button" className="cursor-pointer" title="logout">
          <span className="text-primary underline underline-offset-8">Open Wallet</span>
        </button>
      </div>
      { latestTransaction && <WalletTransactoinStatusWidget currentTransactionStatus={latestTransaction.status} renderBackground={true} /> }
    </div>
  )
}

export default WalletWidget
