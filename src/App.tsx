import { useState } from 'react'

interface Transaction {
  id: string
  amount: number
  category: string
  description: string
  date: string
  type: 'income' | 'expense'
}

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other']

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', amount: 50000, category: 'Food', description: 'Lunch', date: '2026-02-22', type: 'expense' },
    { id: '2', amount: 150000, category: 'Transport', description: 'Gojek', date: '2026-02-22', type: 'expense' },
    { id: '3', amount: 5000000, category: 'Income', description: 'Salary', date: '2026-02-20', type: 'income' },
  ])
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [description, setDescription] = useState('')
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [view, setView] = useState<'list' | 'add' | 'reports'>('list')

  const addTransaction = () => {
    if (!amount || !description) return
    const newTx: Transaction = {
      id: Date.now().toString(),
      amount: parseInt(amount),
      category,
      description,
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
    }
    setTransactions([newTx, ...transactions])
    setAmount('')
    setDescription('')
    setReceiptFile(null)
    setView('list')
  }

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpense

  const byCategory = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = transactions.filter(t => t.category === cat && t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
    return acc
  }, {} as Record<string, number>)

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceiptFile(file)
      // Mock OCR - in production, call Google Cloud Vision or similar
      setTimeout(() => {
        setAmount('35000')
        setCategory('Food')
        setDescription('Receipt: ' + file.name)
      }, 500)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">💰 Pintr Finance</h1>
        
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white mb-4">
          <div className="text-sm opacity-80">Balance</div>
          <div className="text-3xl font-bold">Rp {balance.toLocaleString('id-ID')}</div>
          <div className="flex justify-between mt-2 text-sm">
            <span>↑ Rp {totalIncome.toLocaleString('id-ID')}</span>
            <span>↓ Rp {totalExpense.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Nav */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setView('list')} className={`flex-1 py-2 rounded-lg ${view === 'list' ? 'bg-blue-500 text-white' : 'bg-white'}`}>Transactions</button>
          <button onClick={() => setView('add')} className={`flex-1 py-2 rounded-lg ${view === 'add' ? 'bg-blue-500 text-white' : 'bg-white'}`}>+ Add</button>
          <button onClick={() => setView('reports')} className={`flex-1 py-2 rounded-lg ${view === 'reports' ? 'bg-blue-500 text-white' : 'bg-white'}`}>Reports</button>
        </div>

        {/* List View */}
        {view === 'list' && (
          <div className="space-y-2">
            {transactions.map(t => (
              <div key={t.id} className="bg-white p-3 rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-medium">{t.description}</div>
                  <div className="text-sm text-gray-500">{t.category} • {t.date}</div>
                </div>
                <div className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'}Rp {t.amount.toLocaleString('id-ID')}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add View */}
        {view === 'add' && (
          <div className="bg-white p-4 rounded-lg space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Receipt (OCR)</label>
              <input type="file" accept="image/*" onChange={handleReceiptUpload} className="w-full text-sm" />
              {receiptFile && <p className="text-xs text-green-600 mt-1">✓ {receiptFile.name} uploaded (OCR simulated)</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount (Rp)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="50000" className="w-full p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border rounded-lg">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Lunch" className="w-full p-2 border rounded-lg" />
            </div>
            <button onClick={addTransaction} className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium">Add Transaction</button>
          </div>
        )}

        {/* Reports View */}
        {view === 'reports' && (
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-bold mb-3">Spending by Category</h3>
            {Object.entries(byCategory).map(([cat, val]) => (
              <div key={cat} className="flex justify-between items-center py-2 border-b">
                <span>{cat}</span>
                <span className="font-medium">Rp {val.toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
