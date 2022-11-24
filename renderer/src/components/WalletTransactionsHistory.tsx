import { FC } from 'react'
import { FILTransaction } from '../typings'
import dayjs from 'dayjs'
import { ReactComponent as IncomeIcon } from '../assets/img/icons/income.svg'
import { ReactComponent as OutcomeIcon } from '../assets/img/icons/outcome.svg'
import { ReactComponent as ExternalLinkIcon } from '../assets/img/icons/external.svg'
import { ReactComponent as CafeIcon } from '../assets/img/icons/cafe.svg'
import { ReactComponent as TransferIcon } from '../assets/img/icons/transfer.svg'
import { ReactComponent as WalletIcon } from '../assets/img/icons/wallet.svg'
import WalletTransactoinStatusWidget from './WalletTransactionStatusWidget'
import { brownseTransactionTracker } from '../lib/station-config'

interface WalletTransactionsHistoryProps {
  allTransactions: FILTransaction[] | [],
  latestTransaction: FILTransaction | undefined
}

const WalletTransactionsHistory: FC<WalletTransactionsHistoryProps> = ({ allTransactions = [], latestTransaction = undefined }) => {
  const allTransactionsExcludingCurrent = allTransactions.filter((t) => (t.timestamp !== latestTransaction?.timestamp))

  return (
    <>
      {allTransactions.length > 0
        ? <>
          {latestTransaction && <RecentTransaction key={latestTransaction.timestamp} transaction={latestTransaction} />}
          <div className='pt-8'>
            <p className="px-8 mb-2 w-fit text-body-3xs text-black opacity-80 uppercase">WALLET HISTORY</p>
            {allTransactionsExcludingCurrent.map(
              (transaction) => <Transaction key={transaction.timestamp} transaction={transaction} />)}
          </div>
        </>
        : <div className='flex flex-col gap-3 px-6 pt-12'>
          <div className='flex flex-row align-middle h-[90px] w-full bg-grayscale-100 rounded'>
            <div className='w-[80px] min-w-[80px] bg-primary h-full rounded-l grid place-items-center'>
              <WalletIcon width={32} height={32} fill="white" />
            </div>
            <div className='py-3 px-6 pr-24'>
              <p className='text-body-s text-primary font-body uppercase'>YOUR STATION WALLET</p>
              <p className='text-body-2xs mt-1'>Your Station Wallet has a unique address, where all the FIL you earn will be stored.
                Station will send your FIL earnings to this wallet on a daily basis. </p>
            </div>
          </div>
          <div className='flex flex-row align-middle h-[90px] w-full bg-grayscale-100 rounded'>
            <div className='w-[80px] min-w-[80px] bg-primary h-full rounded-l grid place-items-center'>
              <TransferIcon />
            </div>
            <div className='py-3 px-6 pr-24'>
              <p className='text-body-s text-primary font-body uppercase'>TRANSFERRING YOUR FIL</p>
              <p className='text-body-2xs mt-1'>In order to transfer FIL out of your Station Wallet,
                you need to set a FIL address to send out your FIL. We recommend you transfer your FIL at least every 30 days.</p>
            </div>
          </div>
          <div className='flex flex-row align-middle h-[90px] w-full bg-grayscale-100 rounded'>
            <div className='w-[80px] min-w-[80px] bg-primary h-full rounded-l grid place-items-center'>
              <CafeIcon />
            </div>
            <div className='py-3 px-6 pr-24'>
              <p className='text-body-s text-primary font-body uppercase'>GAS FEES</p>
              <p className='text-body-2xs mt-1'>All transfers of assets in the blockchain incur on gas fees,
                which vary depending on the network's activity and are deducted from the total amount you're transferring.</p>
            </div>
          </div>
        </div>
      }
    </>
  )
}

interface TransactionProps {
  transaction: FILTransaction
}

const RecentTransaction: FC<TransactionProps> = ({ transaction }) => {
  return (
    <div className={`pt-8 pb-8
            ${transaction.status === 'sent'
        ? 'bg-green-200'
        : transaction.status === 'failed'
          ? 'bg-red-100'
          : 'bg-orange-100'} bg-opacity-10`} >
      <p className="px-8 mb-2 w-fit text-body-3xs text-black opacity-80 uppercase">ONGOING TRANSFER</p>
      <div className='px-8'>
        <div className="flex items-center justify-between py-2 border-b-[1px] border-black border-opacity-5">
          <div className='flex justify-start items-center gap-3'>
            {transaction.outgoing
              ? <i><OutcomeIcon className="btn-icon-primary-small m-auto w-[12px] h-[12px]" /></i>
              : <i><IncomeIcon className="btn-icon-primary-small m-auto w-[12px] h-[12px]" /></i>
            }
            <span className="mr-6 text-body-2xs text-black opacity-60 font-number">
              {dayjs(transaction.timestamp).format('HH:MM')}
            </span>
            <span className='text-body-s text-black'>
              {transaction.status === 'sent'
                ? 'Sent'
                : transaction.status === 'failed'
                  ? 'Failed to send'
                  : 'Sending'
              }
              <span className='font-bold mx-1'>{transaction.amount}</span>
              {transaction.outgoing && 'to'}
              {transaction.outgoing && <span className='font-bold mx-1'>{transaction.address}</span>}
            </span>
          </div>
        </div>
        <div className="ml-[97px]"><WalletTransactoinStatusWidget currentTransactionStatus={transaction.status} renderBackground={false} /></div>
      </div>
    </div>
  )
}

const Transaction: FC<TransactionProps> = ({ transaction }) => {
  const openExternalURL = (hash: string) => {
    brownseTransactionTracker(hash)
  }

  return (
    <div className='px-8 hover:bg-primary hover:bg-opacity-[5%] group'>
      <div className="flex flex-row items-center justify-between py-2 border-b-[1px] border-black border-opacity-5">
        <div className='flex justify-start items-center gap-3'>
          {transaction.outgoing
            ? <i><OutcomeIcon className="btn-icon-primary-small m-auto w-[12px] h-[12px]" /></i>
            : <i><IncomeIcon className="btn-icon-primary-small m-auto w-[12px] h-[12px]" /></i>
          }
          <span className="mr-6 text-body-2xs text-black opacity-60 font-number">
            {dayjs(transaction.timestamp).format('DD/MM/YYYY')}
          </span>
          <span className='text-body-s text-black'>
            {transaction.outgoing ? 'Sent' : 'Received'}
            <span className='font-bold mx-1'>{transaction.amount}</span>
            {transaction.outgoing && 'to'}
            {transaction.outgoing && <span className='font-bold mx-1'>{transaction.address}</span>}
          </span>
        </div>
        <div className='flex invisible group-hover:visible'>
            <p className="text-body-2xs text-primary ml-2 cursor-pointer" onClick={() => openExternalURL(transaction.hash)}><i><ExternalLinkIcon /></i></p>
          </div>
      </div>
    </div>
  )
}

export default WalletTransactionsHistory
