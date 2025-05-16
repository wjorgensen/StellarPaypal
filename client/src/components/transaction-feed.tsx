"use client"

import { ArrowDownLeft, ArrowUpRight, Plus } from "lucide-react"

interface Transaction {
  id: string
  type: 'incoming' | 'outgoing' | 'reward'
  name: string
  amount: string
  date: string
  status: 'completed' | 'pending' | 'failed'
  asset: string
}

export default function TransactionFeed() {
  // Mock transaction data
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'incoming',
      name: 'Maria Johnson',
      amount: '25.00',
      date: 'Today, 2:34 PM',
      status: 'completed',
      asset: 'USDC'
    },
    {
      id: '2',
      type: 'outgoing',
      name: 'Coffee Shop',
      amount: '4.50',
      date: 'Yesterday, 9:12 AM',
      status: 'completed',
      asset: 'USDC'
    },
    {
      id: '3',
      type: 'reward',
      name: 'Staking Reward',
      amount: '3.21',
      date: 'May 14, 2023',
      status: 'completed',
      asset: 'XLM'
    },
    {
      id: '4',
      type: 'incoming',
      name: 'John Doe',
      amount: '15.75',
      date: 'May 12, 2023',
      status: 'completed',
      asset: 'XLM'
    }
  ]

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'incoming':
        return <ArrowDownLeft size={18} className="text-green-500" />
      case 'outgoing':
        return <ArrowUpRight size={18} className="text-red-500" />
      case 'reward':
        return <Plus size={18} className="text-blue-500" />
      default:
        return <ArrowDownLeft size={18} />
    }
  }

  return (
    <div className="space-y-4">
      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No transactions yet</p>
        </div>
      ) : (
        transactions.map((transaction) => (
          <div key={transaction.id} className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                {getTransactionIcon(transaction.type)}
              </div>
              <div>
                <p className="font-medium">{transaction.name}</p>
                <p className="text-sm text-gray-500">{transaction.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-medium ${transaction.type === 'outgoing' ? 'text-red-600' : 'text-green-600'}`}>
                {transaction.type === 'outgoing' ? '-' : '+'}{transaction.amount} {transaction.asset}
              </p>
              <p className={`text-xs ${
                transaction.status === 'completed' ? 'text-green-600' : 
                transaction.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  )
} 