import { FC } from 'react'
import useWallet from '../hooks/StationWallet'

import { ReactComponent as WalletIcon } from '../assets/img/icons/wallet.svg'
import WalletTransactoinStatusWidget from './WalletTransactionStatusWidget'

interface WalletWidgetProps {
  onClick: () => void
}

const WalletWidget: FC<WalletWidgetProps> = ({ onClick }) => {
  const [,, balance,,, latestTransaction, dismissLatestTransaction] = useWallet()

  return (
    <div onClick={() => { onClick(); dismissLatestTransaction() }}>
      <div className='flex items-center '>
        <WalletIcon />
        <span className="text-right mx-3" title="wallet"><span className='font-bold'>{balance.toLocaleString(undefined, { minimumFractionDigits: 3 }) || 0 }</span> FIL</span>
        <button type="button" className="cursor-pointer" title="logout">
          <span className="text-primary underline underline-offset-8">Open Wallet</span>
        </button>
      </div>
      { latestTransaction && <WalletTransactoinStatusWidget currentTransaction={latestTransaction} renderBackground={true} /> }
    </div>
  )
}

export default WalletWidget
