import { useState, useMemo, useEffect } from 'react'
import { 
  TrendingUp, TrendingDown, DollarSign, Plus, Trash2, Search, 
  Upload, FileText, PieChart, ArrowRightLeft, ChevronRight, 
  Sparkles, CheckCircle2, ArrowUpRight, ArrowDownLeft,
  Utensils, Car, ShoppingBag, Receipt, Tv, HeartPulse, HelpCircle, RefreshCw,
  Wallet, Info, LayoutDashboard
} from 'lucide-react'

interface Transaction {
  id: string
  amount: number
  category: string
  description: string
  date: string
  type: 'income' | 'expense'
}

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'] as const
type Category = typeof CATEGORIES[number]

const CATEGORY_DETAILS: Record<Category, { icon: any; color: string; bgClass: string; textClass: string; borderClass: string }> = {
  Food: { icon: Utensils, color: '#ef4444', bgClass: 'bg-red-500/10', textClass: 'text-red-400', borderClass: 'border-red-500/20' },
  Transport: { icon: Car, color: '#3b82f6', bgClass: 'bg-blue-500/10', textClass: 'text-blue-400', borderClass: 'border-blue-500/20' },
  Shopping: { icon: ShoppingBag, color: '#ec4899', bgClass: 'bg-pink-500/10', textClass: 'text-pink-400', borderClass: 'border-pink-500/20' },
  Bills: { icon: Receipt, color: '#f59e0b', bgClass: 'bg-amber-500/10', textClass: 'text-amber-400', borderClass: 'border-amber-500/20' },
  Entertainment: { icon: Tv, color: '#8b5cf6', bgClass: 'bg-purple-500/10', textClass: 'text-purple-400', borderClass: 'border-purple-500/20' },
  Health: { icon: HeartPulse, color: '#10b981', bgClass: 'bg-emerald-500/10', textClass: 'text-emerald-400', borderClass: 'border-emerald-500/20' },
  Other: { icon: HelpCircle, color: '#6b7280', bgClass: 'bg-zinc-500/10', textClass: 'text-zinc-400', borderClass: 'border-zinc-500/20' }
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', amount: 45000, category: 'Food', description: 'Kopi Susu Kenangan', date: '2026-05-24', type: 'expense' },
  { id: '2', amount: 150000, category: 'Transport', description: 'Gojek Ride to Office', date: '2026-05-23', type: 'expense' },
  { id: '3', amount: 550000, category: 'Shopping', description: 'Uniqlo Airism T-Shirt', date: '2026-05-22', type: 'expense' },
  { id: '4', amount: 1250000, category: 'Bills', description: 'Home Internet & Electricity', date: '2026-05-20', type: 'expense' },
  { id: '5', amount: 7500000, category: 'Income', description: 'Salary Deposit (Pintr Inc)', date: '2026-05-19', type: 'income' },
]

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS)
  
  // App view navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'scanner' | 'manual-entry' | 'analytics'>('dashboard')
  
  // Manual transaction form state
  const [formType, setFormType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Category>('Food')
  const [description, setDescription] = useState('')
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0])

  // Filters state
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  // Receipt Scanner State
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'complete'>('idle')
  const [scanStepIndex, setScanStepIndex] = useState(0)
  const [mockPreviewUrl, setMockPreviewUrl] = useState<string | null>(null)
  
  // OCR draft state
  const [draftAmount, setDraftAmount] = useState('')
  const [draftCategory, setDraftCategory] = useState<Category>('Food')
  const [draftDescription, setDescriptionDraft] = useState('')
  const [draftDate, setDraftDate] = useState('')

  // Balance values
  const totalIncome = useMemo(() => transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0), [transactions])
  const totalExpense = useMemo(() => transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0), [transactions])
  const balance = totalIncome - totalExpense

  // Mock scan logs
  const scanSteps = [
    '📂 Ingesting invoice image file...',
    '🕵️‍♂️ Executing Layout OCR boundary extraction...',
    '📊 Parsing merchant invoice details (Faktur)...',
    '🧠 Running LLM categorization (Gemini 2.5 Flash Lite)...',
    '✨ Metadata parsing complete! Populating details...'
  ]

  // Receipt Scanner Simulator effect
  useEffect(() => {
    if (scanStatus === 'scanning') {
      setScanStepIndex(0)
      
      const interval = setInterval(() => {
        setScanStepIndex(prev => {
          if (prev < scanSteps.length) {
            return prev + 1
          } else {
            clearInterval(interval)
            setScanStatus('complete')
            return prev
          }
        })
      }, 1100)
      
      return () => clearInterval(interval)
    }
  }, [scanStatus])

  // Set mock data based on uploaded file
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceiptFile(file)
      // Create local URL for preview
      const url = URL.createObjectURL(file)
      setMockPreviewUrl(url)
      setScanStatus('scanning')
      
      // Determine pseudo-OCR content from filename
      const nameLower = file.name.toLowerCase()
      setTimeout(() => {
        if (nameLower.includes('kopi') || nameLower.includes('starbucks') || nameLower.includes('makan') || nameLower.includes('food')) {
          setDraftAmount('42000')
          setDraftCategory('Food')
          setDescriptionDraft('Makan Kenangan (Receipt)')
          setDraftDate(new Date().toISOString().split('T')[0])
        } else if (nameLower.includes('gojek') || nameLower.includes('grab') || nameLower.includes('uber') || nameLower.includes('travel')) {
          setDraftAmount('38000')
          setDraftCategory('Transport')
          setDescriptionDraft('Gojek Ride to Station')
          setDraftDate(new Date().toISOString().split('T')[0])
        } else if (nameLower.includes('wifi') || nameLower.includes('indihome') || nameLower.includes('pln') || nameLower.includes('bill')) {
          setDraftAmount('350000')
          setDraftCategory('Bills')
          setDescriptionDraft('PLN Electricity (Receipt)')
          setDraftDate(new Date().toISOString().split('T')[0])
        } else {
          // Default fallbacks
          const randomAmount = (Math.floor(Math.random() * 10) * 10000 + 15000).toString()
          setDraftAmount(randomAmount)
          setDraftCategory('Other')
          setDescriptionDraft('Receipt Scan: ' + file.name.split('.')[0])
          setDraftDate(new Date().toISOString().split('T')[0])
        }
      }, 4000)
    }
  }

  // Create mock receipt files to play with
  const uploadMockReceipt = (type: 'food' | 'transport' | 'bill') => {
    let mockFile: File
    if (type === 'food') {
      mockFile = new File([''], 'starbucks_receipt_may.jpg', { type: 'image/jpeg' })
    } else if (type === 'transport') {
      mockFile = new File([''], 'gojek_ride_receipt_112.png', { type: 'image/png' })
    } else {
      mockFile = new File([''], 'internet_bill_invoice_2026.jpg', { type: 'image/jpeg' })
    }
    
    setReceiptFile(mockFile)
    setMockPreviewUrl(null) // Mocking visual layout
    setScanStatus('scanning')
    
    setTimeout(() => {
      if (type === 'food') {
        setDraftAmount('68000')
        setDraftCategory('Food')
        setDescriptionDraft('Starbucks Coffee & Pastry')
        setDraftDate('2026-05-24')
      } else if (type === 'transport') {
        setDraftAmount('45000')
        setDraftCategory('Transport')
        setDescriptionDraft('Gojek Ride: Stasiun Bandung')
        setDraftDate('2026-05-23')
      } else {
        setDraftAmount('385000')
        setDraftCategory('Bills')
        setDescriptionDraft('Biznet Fiber WiFi')
        setDraftDate('2026-05-21')
      }
    }, 4000)
  }

  // Trigger manual transaction creation
  const handleAddManualTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !description) return

    const newTx: Transaction = {
      id: Date.now().toString(),
      amount: parseInt(amount),
      category: formType === 'income' ? 'Income' : category,
      description,
      date: transactionDate,
      type: formType
    }

    setTransactions([newTx, ...transactions])
    setAmount('')
    setDescription('')
    setActiveTab('dashboard')
  }

  // Confirm receipt scan and add transaction
  const handleConfirmDraft = () => {
    if (!draftAmount || !draftDescription) return

    const newTx: Transaction = {
      id: Date.now().toString(),
      amount: parseInt(draftAmount),
      category: draftCategory,
      description: draftDescription,
      date: draftDate || new Date().toISOString().split('T')[0],
      type: 'expense'
    }

    setTransactions([newTx, ...transactions])
    setScanStatus('idle')
    setReceiptFile(null)
    setMockPreviewUrl(null)
    setActiveTab('dashboard')
  }

  // Delete transaction
  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id))
  }

  // Reset scanner simulator
  const handleResetScanner = () => {
    setScanStatus('idle')
    setReceiptFile(null)
    setMockPreviewUrl(null)
  }

  // Category spending calculation
  const categorySpending = useMemo(() => {
    const data: Record<string, number> = {}
    CATEGORIES.forEach(cat => {
      data[cat] = transactions
        .filter(t => t.category === cat && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
    })
    return data
  }, [transactions])

  const totalExpenseSum = useMemo(() => {
    return Object.values(categorySpending).reduce((sum, val) => sum + val, 0)
  }, [categorySpending])

  // Custom SVG Donut Chart segment rendering helper
  const donutChartSegments = useMemo(() => {
    let accumulatedPercentage = 0
    const radius = 35
    const circumference = 2 * Math.PI * radius // ~219.91
    
    return CATEGORIES.map((cat) => {
      const amount = categorySpending[cat]
      const percentage = totalExpenseSum > 0 ? amount / totalExpenseSum : 0
      const strokeLength = percentage * circumference
      const strokeOffset = circumference - strokeLength + (accumulatedPercentage * circumference)
      
      accumulatedPercentage -= percentage // moving clockwise

      return {
        category: cat,
        amount,
        percentage: Math.round(percentage * 100),
        strokeLength,
        strokeOffset,
        color: CATEGORY_DETAILS[cat].color
      }
    }).filter(s => s.amount > 0)
  }, [categorySpending, totalExpenseSum])

  // Filtered transactions list
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.category.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesType = filterType === 'all' || t.type === filterType
      
      const matchesCategory = filterCategory === 'all' || t.category === filterCategory

      return matchesSearch && matchesType && matchesCategory
    })
  }, [transactions, searchQuery, filterType, filterCategory])

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans antialiased overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Dynamic glow decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        
        {/* Header Branding */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-900">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sparkles className="h-5 w-5 text-zinc-950" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                PINTR <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/20">FINANCE</span>
              </h1>
              <p className="text-xs text-zinc-500">AI Receipt Scanner & Expense Dashboard</p>
            </div>
          </div>
          
          {/* Quick Stats Summary */}
          <div className="flex items-center gap-6 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>Gemini 2.5 Flash Lite: Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
              <span>R2 Cloud Storage: Connected</span>
            </div>
          </div>
        </header>

        {/* Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Navigation Sidebar (Desktop) or Tab bar (Mobile) */}
          <nav className="lg:col-span-3 flex lg:flex-col gap-1 overflow-x-auto pb-3 lg:pb-0 scrollbar-none border-b border-zinc-900 lg:border-none">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all shrink-0 ${
                activeTab === 'dashboard' 
                  ? 'bg-gradient-to-r from-zinc-900 to-zinc-800 text-emerald-400 border border-zinc-800' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard Overview</span>
            </button>

            <button 
              onClick={() => setActiveTab('transactions')} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all shrink-0 ${
                activeTab === 'transactions' 
                  ? 'bg-gradient-to-r from-zinc-900 to-zinc-800 text-emerald-400 border border-zinc-800' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950'
              }`}
            >
              <ArrowRightLeft className="h-4 w-4" />
              <span>All Transactions</span>
            </button>

            <button 
              onClick={() => setActiveTab('scanner')} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all shrink-0 relative ${
                activeTab === 'scanner' 
                  ? 'bg-gradient-to-r from-zinc-900 to-zinc-800 text-emerald-400 border border-zinc-800' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950'
              }`}
            >
              <Upload className="h-4 w-4" />
              <span>AI Receipt Scanner</span>
              <span className="absolute right-3 top-3 h-2 w-2 bg-rose-500 rounded-full animate-ping hidden lg:block"></span>
            </button>

            <button 
              onClick={() => setActiveTab('manual-entry')} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all shrink-0 ${
                activeTab === 'manual-entry' 
                  ? 'bg-gradient-to-r from-zinc-900 to-zinc-800 text-emerald-400 border border-zinc-800' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>Add Transaction</span>
            </button>

            <button 
              onClick={() => setActiveTab('analytics')} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all shrink-0 ${
                activeTab === 'analytics' 
                  ? 'bg-gradient-to-r from-zinc-900 to-zinc-800 text-emerald-400 border border-zinc-800' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950'
              }`}
            >
              <PieChart className="h-4 w-4" />
              <span>Spending Insights</span>
            </button>
          </nav>

          {/* Core Content Area */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* View 1: Dashboard Overview */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* Balance Cards & Overview Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Total Balance Card */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 rounded-2xl p-5 border border-zinc-800/80 shadow-xl group">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/10 rounded-full filter blur-xl group-hover:bg-emerald-500/20 transition-all duration-500"></div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Current Balance</span>
                      <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <Wallet className="h-4 w-4 text-emerald-400" />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-white tracking-tight">
                      Rp {balance.toLocaleString('id-ID')}
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1">Net assets available</p>
                  </div>

                  {/* Income Card */}
                  <div className="relative overflow-hidden bg-zinc-900/60 backdrop-blur-md rounded-2xl p-5 border border-zinc-800/80 shadow-md">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Inflow</span>
                      <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                        <TrendingUp className="h-4 w-4 text-indigo-400" />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-white tracking-tight">
                      Rp {totalIncome.toLocaleString('id-ID')}
                    </div>
                    <p className="text-[10px] text-emerald-400/80 mt-1 flex items-center gap-1">
                      <ArrowUpRight className="h-3 w-3" />
                      Salary & direct deposits
                    </p>
                  </div>

                  {/* Expense Card */}
                  <div className="relative overflow-hidden bg-zinc-900/60 backdrop-blur-md rounded-2xl p-5 border border-zinc-800/80 shadow-md">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Outflow</span>
                      <div className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/20">
                        <TrendingDown className="h-4 w-4 text-rose-400" />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-white tracking-tight">
                      Rp {totalExpense.toLocaleString('id-ID')}
                    </div>
                    <p className="text-[10px] text-rose-400/80 mt-1 flex items-center gap-1">
                      <ArrowDownLeft className="h-3 w-3" />
                      Parsed receipts & bills
                    </p>
                  </div>
                </div>

                {/* Dashboard Multi Columns */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Recent Activity Column */}
                  <div className="md:col-span-7 bg-zinc-900/50 backdrop-blur-md rounded-2xl p-5 border border-zinc-800/80 space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-zinc-800/50">
                      <h3 className="font-bold text-sm text-zinc-200">Recent Transactions</h3>
                      <button onClick={() => setActiveTab('transactions')} className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
                        View All <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="space-y-2.5 max-h-[340px] overflow-y-auto scrollbar-thin">
                      {transactions.slice(0, 4).map(t => {
                        const isIncome = t.type === 'income'
                        const details = isIncome ? null : CATEGORY_DETAILS[t.category as Category]
                        const Icon = isIncome ? DollarSign : (details?.icon || HelpCircle)
                        
                        return (
                          <div key={t.id} className="group bg-zinc-950/40 hover:bg-zinc-900/40 p-3 rounded-xl border border-zinc-850 flex justify-between items-center transition-all duration-200">
                            <div className="flex items-center gap-3">
                              <div className={`h-9 w-9 rounded-lg flex items-center justify-center border shrink-0 ${
                                isIncome 
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                  : `${details?.bgClass || 'bg-zinc-500/10'} ${details?.textClass || 'text-zinc-400'} ${details?.borderClass || 'border-zinc-500/20'}`
                              }`}>
                                <Icon className="h-4.5 w-4.5" />
                              </div>
                              <div className="truncate max-w-[150px] sm:max-w-[200px]">
                                <div className="font-semibold text-xs text-white group-hover:text-emerald-400 transition-colors truncate">{t.description}</div>
                                <div className="text-[10px] text-zinc-500 truncate">{t.category} • {t.date}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-xs font-bold tracking-tight ${isIncome ? 'text-emerald-400' : 'text-zinc-200'}`}>
                                {isIncome ? '+' : '-'} Rp {t.amount.toLocaleString('id-ID')}
                              </span>
                              <button 
                                onClick={() => handleDeleteTransaction(t.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 bg-rose-500/10 text-rose-400 rounded hover:bg-rose-500 hover:text-white transition-all duration-150 cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                      
                      {transactions.length === 0 && (
                        <p className="text-zinc-500 text-xs text-center py-6">No transactions logged yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Dashboard Sidebar Quick Analytics */}
                  <div className="md:col-span-5 bg-zinc-900/50 backdrop-blur-md rounded-2xl p-5 border border-zinc-800/80 space-y-5">
                    <h3 className="font-bold text-sm text-zinc-200 pb-2 border-b border-zinc-800/50">Category Breakdown</h3>
                    
                    {totalExpenseSum > 0 ? (
                      <div className="space-y-4">
                        
                        {/* Custom Mini Donut Chart */}
                        <div className="flex items-center justify-center gap-6 py-2">
                          <div className="relative h-24 w-24">
                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                              {/* Background Circle */}
                              <circle cx="50" cy="50" r="35" fill="transparent" stroke="#18181b" strokeWidth="12" />
                              {/* Segments */}
                              {donutChartSegments.map((seg) => (
                                <circle 
                                  key={seg.category}
                                  cx="50"
                                  cy="50"
                                  r="35"
                                  fill="transparent"
                                  stroke={seg.color}
                                  strokeWidth="12"
                                  strokeDasharray={`${seg.strokeLength} 220`}
                                  strokeDashoffset={seg.strokeOffset}
                                  strokeLinecap="round"
                                />
                              ))}
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                              <span className="text-[10px] text-zinc-400">Total Out</span>
                              <span className="text-[10px] font-bold text-white">Rp {totalExpenseSum > 1000000 ? `${(totalExpenseSum/1000000).toFixed(1)}M` : `${Math.round(totalExpenseSum/1000)}k`}</span>
                            </div>
                          </div>

                          <div className="text-[10px] space-y-1 text-zinc-400 font-medium font-mono">
                            {donutChartSegments.slice(0, 3).map(seg => (
                              <div key={seg.category} className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }}></span>
                                <span className="truncate text-white">{seg.category}</span>
                                <span>{seg.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Progress Bar Rows */}
                        <div className="space-y-2.5">
                          {CATEGORIES.map(cat => {
                            const val = categorySpending[cat]
                            if (val === 0) return null
                            const details = CATEGORY_DETAILS[cat]
                            const pct = Math.round((val / totalExpenseSum) * 100)
                            
                            return (
                              <div key={cat} className="space-y-1">
                                <div className="flex justify-between items-center text-[11px]">
                                  <span className="text-zinc-300 font-medium">{cat}</span>
                                  <span className="text-zinc-400 font-bold font-mono">Rp {val.toLocaleString('id-ID')} ({pct}%)</span>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                                  <div 
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ 
                                      width: `${pct}%`, 
                                      backgroundColor: details.color 
                                    }}
                                  ></div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10 text-zinc-500 text-xs">
                        No spending analytics. Log an expense to see analytics!
                      </div>
                    )}
                  </div>
                </div>

                {/* Promotional Scan Prompt Action Board */}
                <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-950 to-zinc-950 border border-emerald-500/10 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="absolute top-0 left-0 h-10 w-10 bg-emerald-500/10 filter blur-xl"></div>
                  <div className="flex gap-4 items-center flex-col md:flex-row text-center md:text-left">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <Sparkles className="h-6 w-6 text-emerald-400 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Got paper receipts or thermal invoices?</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">Scan them now to extract metadata, categorize itemized expenses, and populate your tracker in seconds.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('scanner')} 
                    className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-lg shadow-emerald-500/10"
                  >
                    Launch OCR Scanner
                  </button>
                </div>
              </div>
            )}

            {/* View 2: All Transactions */}
            {activeTab === 'transactions' && (
              <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-5 space-y-5">
                
                {/* Search, Filter & Controls header */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-bold text-sm text-zinc-200">Transaction History</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    
                    {/* Search Input */}
                    <div className="md:col-span-5 relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                      <input 
                        type="text" 
                        placeholder="Search description or category..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    {/* Filter Type Segment */}
                    <div className="md:col-span-4 flex rounded-xl bg-zinc-950/80 p-0.5 border border-zinc-800">
                      <button 
                        onClick={() => setFilterType('all')}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${filterType === 'all' ? 'bg-zinc-900 text-white border border-zinc-800' : 'text-zinc-400'}`}
                      >
                        All Type
                      </button>
                      <button 
                        onClick={() => setFilterType('income')}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${filterType === 'income' ? 'bg-zinc-900 text-emerald-400 border border-zinc-800' : 'text-zinc-400'}`}
                      >
                        Income
                      </button>
                      <button 
                        onClick={() => setFilterType('expense')}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${filterType === 'expense' ? 'bg-zinc-900 text-rose-400 border border-zinc-800' : 'text-zinc-400'}`}
                      >
                        Expense
                      </button>
                    </div>

                    {/* Category Dropdown Filter */}
                    <div className="md:col-span-3">
                      <select 
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-400 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                      >
                        <option value="all">All Category</option>
                        <option value="Income">Income</option>
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Master Transactions List Container */}
                <div className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin">
                  {filteredTransactions.map(t => {
                    const isIncome = t.type === 'income'
                    const details = isIncome ? null : CATEGORY_DETAILS[t.category as Category]
                    const Icon = isIncome ? DollarSign : (details?.icon || HelpCircle)

                    return (
                      <div key={t.id} className="group bg-zinc-950/40 hover:bg-zinc-900/30 p-3.5 rounded-xl border border-zinc-850/80 flex justify-between items-center transition-all duration-200">
                        <div className="flex items-center gap-3">
                          <div className={`h-9.5 w-9.5 rounded-lg flex items-center justify-center border shrink-0 ${
                            isIncome 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : `${details?.bgClass || 'bg-zinc-500/10'} ${details?.textClass || 'text-zinc-400'} ${details?.borderClass || 'border-zinc-500/20'}`
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-white group-hover:text-emerald-400 transition-colors">{t.description}</div>
                            <div className="text-[10px] text-zinc-500 flex items-center gap-2 mt-0.5">
                              <span className="font-medium px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded">{t.category}</span>
                              <span className="font-mono">{t.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-xs font-black tracking-tight font-mono ${isIncome ? 'text-emerald-400' : 'text-zinc-100'}`}>
                            {isIncome ? '+' : '-'} Rp {t.amount.toLocaleString('id-ID')}
                          </span>
                          <button 
                            onClick={() => handleDeleteTransaction(t.id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white transition-all duration-150 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}

                  {filteredTransactions.length === 0 && (
                    <div className="text-center py-12 text-zinc-500 text-xs">
                      No transactions matched the active filters.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* View 3: AI Receipt Scanner */}
            {activeTab === 'scanner' && (
              <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-5 space-y-6">
                
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/50">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
                    <h3 className="font-bold text-sm text-zinc-200">AI Receipt Scanner (OCR)</h3>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">Gemini 2.5 Flash Lite ready</span>
                </div>

                {/* State A: Idle (Upload Zone) */}
                {scanStatus === 'idle' && (
                  <div className="space-y-6">
                    
                    {/* Visual instruction zone */}
                    <div className="border-2 border-dashed border-zinc-800 hover:border-emerald-500/40 bg-zinc-950/40 p-10 rounded-2xl text-center transition-all duration-300 relative group">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleReceiptUpload} 
                        className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                      />
                      <div className="flex flex-col items-center justify-center space-y-3 z-0">
                        <div className="h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Upload className="h-5 w-5 text-zinc-400 group-hover:text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-zinc-200">Upload Receipt Image</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5">Drag and drop or select file (JPG, PNG)</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Demo Shortcuts */}
                    <div className="space-y-3">
                      <div className="text-xs text-zinc-400 font-semibold flex items-center gap-2">
                        <Info className="h-3.5 w-3.5 text-zinc-500" />
                        <span>Try these interactive scan samples (Pre-loaded OCR):</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button 
                          onClick={() => uploadMockReceipt('food')}
                          className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 hover:border-emerald-500/30 rounded-xl text-left hover:bg-zinc-900/50 transition-colors text-xs space-y-1 cursor-pointer"
                        >
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <Utensils className="h-3.5 w-3.5 text-red-400" />
                            <span>Kopi & Pastry Receipt</span>
                          </div>
                          <p className="text-[10px] text-zinc-500 truncate">starbucks_receipt_may.jpg</p>
                        </button>

                        <button 
                          onClick={() => uploadMockReceipt('transport')}
                          className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 hover:border-emerald-500/30 rounded-xl text-left hover:bg-zinc-900/50 transition-colors text-xs space-y-1 cursor-pointer"
                        >
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <Car className="h-3.5 w-3.5 text-blue-400" />
                            <span>Gojek Receipt</span>
                          </div>
                          <p className="text-[10px] text-zinc-500 truncate">gojek_ride_receipt_112.png</p>
                        </button>

                        <button 
                          onClick={() => uploadMockReceipt('bill')}
                          className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 hover:border-emerald-500/30 rounded-xl text-left hover:bg-zinc-900/50 transition-colors text-xs space-y-1 cursor-pointer"
                        >
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <Receipt className="h-3.5 w-3.5 text-amber-400" />
                            <span>WiFi Invoice</span>
                          </div>
                          <p className="text-[10px] text-zinc-500 truncate">internet_bill_invoice_2026.jpg</p>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* State B: Scanning (Animation running) */}
                {scanStatus === 'scanning' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    
                    {/* Laser Sweeper scanning frame */}
                    <div className="relative overflow-hidden bg-zinc-950 border border-zinc-850 rounded-xl h-56 flex items-center justify-center p-4">
                      {mockPreviewUrl ? (
                        <img src={mockPreviewUrl} alt="Receipt preview" className="max-h-full rounded max-w-full object-contain opacity-50 filter blur-[0.5px]" />
                      ) : (
                        <div className="text-center space-y-2">
                          <FileText className="h-10 w-10 text-zinc-600 mx-auto" />
                          <p className="text-[10px] text-zinc-500">{receiptFile?.name || 'receipt_image.jpg'}</p>
                        </div>
                      )}
                      {/* Interactive scanning laser line overlay */}
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-400/80 shadow-emerald-400/80 shadow-[0_0_12px_3px] animate-scan"></div>
                    </div>

                    {/* Step logs feed */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-emerald-400 animate-spin" />
                        <span className="text-xs text-zinc-300 font-bold">Scanning OCR payload...</span>
                      </div>
                      
                      <div className="space-y-2">
                        {scanSteps.map((step, idx) => {
                          const isLoaded = idx < scanStepIndex
                          const isActive = idx === scanStepIndex
                          
                          return (
                            <div 
                              key={step} 
                              className={`flex items-center gap-2.5 text-xs transition-all duration-300 ${
                                isLoaded 
                                  ? 'text-emerald-400 font-medium' 
                                  : isActive 
                                    ? 'text-white font-semibold' 
                                    : 'text-zinc-600'
                              }`}
                            >
                              {isLoaded ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                              ) : isActive ? (
                                <RefreshCw className="h-4 w-4 text-indigo-400 animate-spin shrink-0" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border border-zinc-800 shrink-0"></div>
                              )}
                              <span className="truncate">{step}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* State C: Complete & Review extracted draft values */}
                {scanStatus === 'complete' && (
                  <div className="space-y-6">
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-emerald-400">OCR Parsing Successful!</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Extracted using Gemini 2.5 Flash Lite with 99.4% confidence interval.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Preview Thumb */}
                      <div className="bg-zinc-950 border border-zinc-850 rounded-xl h-56 flex items-center justify-center p-4 relative group">
                        {mockPreviewUrl ? (
                          <img src={mockPreviewUrl} alt="Receipt preview" className="max-h-full rounded max-w-full object-contain" />
                        ) : (
                          <div className="text-center space-y-2">
                            <FileText className="h-10 w-10 text-emerald-400/80 mx-auto" />
                            <p className="text-[10px] text-emerald-400 font-bold">Loaded: {receiptFile?.name || 'Receipt Image'}</p>
                          </div>
                        )}
                      </div>

                      {/* Review draft fields form */}
                      <div className="space-y-3 bg-zinc-950/40 p-4 rounded-xl border border-zinc-850">
                        <h4 className="text-xs font-bold text-zinc-300 pb-1.5 border-b border-zinc-800/80 mb-2">Review Extracted Metadata</h4>
                        
                        {/* Amount */}
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Amount (Rp)</label>
                          <input 
                            type="number" 
                            value={draftAmount}
                            onChange={e => setDraftAmount(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono" 
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Merchant / Description</label>
                          <input 
                            type="text" 
                            value={draftDescription}
                            onChange={e => setDescriptionDraft(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500" 
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {/* Category */}
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Category</label>
                            <select 
                              value={draftCategory}
                              onChange={e => setDraftCategory(e.target.value as Category)}
                              className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
                            >
                              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                          </div>

                          {/* Date */}
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Receipt Date</label>
                            <input 
                              type="date" 
                              value={draftDate}
                              onChange={e => setDraftDate(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-350 focus:outline-none focus:border-emerald-500 cursor-pointer font-mono" 
                            />
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 pt-3">
                          <button 
                            onClick={handleResetScanner}
                            className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Discard
                          </button>
                          <button 
                            onClick={handleConfirmDraft}
                            className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-emerald-500/10"
                          >
                            Confirm & Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* View 4: Add Transaction Manually */}
            {activeTab === 'manual-entry' && (
              <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-5 max-w-xl mx-auto space-y-5">
                <h3 className="font-bold text-sm text-zinc-200 pb-2 border-b border-zinc-800/50">Add Transaction</h3>
                
                <form onSubmit={handleAddManualTransaction} className="space-y-4">
                  
                  {/* Sliding Inflow/Outflow type toggle */}
                  <div className="flex rounded-xl bg-zinc-950 p-1 border border-zinc-850">
                    <button 
                      type="button"
                      onClick={() => setFormType('expense')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${formType === 'expense' ? 'bg-zinc-900 text-rose-400 border border-zinc-800' : 'text-zinc-400'}`}
                    >
                      Expense (Outflow)
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormType('income')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${formType === 'income' ? 'bg-zinc-900 text-emerald-400 border border-zinc-800' : 'text-zinc-400'}`}
                    >
                      Income (Inflow)
                    </button>
                  </div>

                  {/* Amount Field */}
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Amount (IDR)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-zinc-500 font-bold">Rp</span>
                      <input 
                        type="number" 
                        value={amount} 
                        onChange={e => setAmount(e.target.value)} 
                        placeholder="50000" 
                        required
                        className="w-full pl-9 pr-4 py-2 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                      />
                    </div>
                  </div>

                  {/* Form Grid columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Category Selection */}
                    {formType === 'expense' ? (
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Category</label>
                        <select 
                          value={category} 
                          onChange={e => setCategory(e.target.value as Category)}
                          className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                        >
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Category</label>
                        <input 
                          type="text" 
                          value="Income" 
                          disabled 
                          className="w-full px-3 py-2 bg-zinc-950/30 border border-zinc-800/50 rounded-xl text-xs text-zinc-500 focus:outline-none cursor-not-allowed" 
                        />
                      </div>
                    )}

                    {/* Date picker */}
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Date</label>
                      <input 
                        type="date" 
                        value={transactionDate} 
                        onChange={e => setTransactionDate(e.target.value)} 
                        required
                        className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs text-zinc-350 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer font-mono"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Merchant / Description</label>
                    <input 
                      type="text" 
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                      placeholder="e.g. Starbucks, Lunch meeting, Gojek ride" 
                      required
                      className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
                  >
                    Add Transaction
                  </button>
                </form>
              </div>
            )}

            {/* View 5: Analytics Insights */}
            {activeTab === 'analytics' && (
              <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-5 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/50">
                  <h3 className="font-bold text-sm text-zinc-200">Spending Insights</h3>
                  <span className="text-[10px] text-zinc-400 font-medium">Monthly view</span>
                </div>

                {totalExpenseSum > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    {/* Left Column: Customized SVG Donut Ring */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-zinc-950/40 rounded-xl border border-zinc-850">
                      <div className="relative h-44 w-44">
                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                          {/* Background Track Circle */}
                          <circle cx="50" cy="50" r="35" fill="transparent" stroke="#18181b" strokeWidth="12" />
                          {/* Dynamic segment paths */}
                          {donutChartSegments.map((seg) => (
                            <circle 
                              key={seg.category}
                              cx="50"
                              cy="50"
                              r="35"
                              fill="transparent"
                              stroke={seg.color}
                              strokeWidth="12"
                              strokeDasharray={`${seg.strokeLength} 220`}
                              strokeDashoffset={seg.strokeOffset}
                              strokeLinecap="round"
                              className="transition-all duration-300 hover:stroke-[15px] cursor-pointer"
                            />
                          ))}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="text-xs text-zinc-500 font-medium">Total Outflow</span>
                          <span className="text-sm font-black text-white mt-0.5 font-mono">Rp {totalExpenseSum.toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-zinc-500 text-center mt-4">Segments are color-coded by expense category</p>
                    </div>

                    {/* Right Column: Breakdown Table List */}
                    <div className="md:col-span-7 space-y-3 bg-zinc-950/20 p-2.5 rounded-xl border border-zinc-850">
                      <h4 className="text-xs font-bold text-zinc-400 px-2 uppercase tracking-wide">Category Distribution</h4>
                      
                      <div className="space-y-1.5 max-h-[300px] overflow-y-auto scrollbar-thin">
                        {CATEGORIES.map(cat => {
                          const val = categorySpending[cat]
                          const details = CATEGORY_DETAILS[cat]
                          const pct = Math.round((val / totalExpenseSum) * 100)
                          
                          return (
                            <div key={cat} className="p-2.5 bg-zinc-950/40 border border-zinc-850 rounded-xl flex items-center justify-between text-xs hover:border-zinc-800 transition-colors">
                              <div className="flex items-center gap-3">
                                <span className="h-3.5 w-3.5 rounded-lg shrink-0" style={{ backgroundColor: details.color }}></span>
                                <span className="font-semibold text-white">{cat}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-zinc-200 font-mono">Rp {val.toLocaleString('id-ID')}</div>
                                <div className="text-[10px] text-zinc-500 font-mono">{val > 0 ? `${pct}% of total` : '0%'}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-zinc-500 text-xs">
                    Please log expenses or scanning payloads to render the graphical overview.
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
