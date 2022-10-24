import { FC } from 'react'
import useWallet from '../hooks/StationWallet'

import { ReactComponent as WalletIcon } from '../assets/img/icons/wallet.svg'
import WalletTransactoinStatusWidget from './WalletTransactionStatusWidget'

interface WalletWidgetProps {
  onClick: () => void
}

const WalletWidget: FC<WalletWidgetProps> = ({ onClick }) => {
  const [,, balance, allTransactions] = useWallet()

  const currentTransactionStatus = () => {
    const today = (new Date()).setHours(0, 0, 0, 0)
    if (allTransactions.length && allTransactions[0].timestamp >= today) {
      return <WalletTransactoinStatusWidget currentTransactionStatus={allTransactions[0].status} />
    }
  }

  return (
    <div>
      <div className='flex items-center '>
        <WalletIcon />
        <span className="text-right mx-3" title="wallet"><span className='font-bold'>{balance.toLocaleString() || '-'}</span> FIL</span>
        <button type="button" className="cursor-pointer" title="logout" onClick={onClick}>
          <span className="text-primary underline underline-offset-8">Open Wallet</span>
        </button>
      </div>
      { currentTransactionStatus() }
    </div>
  )
}

export default WalletWidget
