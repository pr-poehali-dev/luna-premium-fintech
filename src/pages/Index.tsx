import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  category: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  commission?: number;
}

interface MetricData {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

interface WalletData {
  id: string;
  name: string;
  currency: string;
  balance: number;
  percentage: number;
}

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  // Mock data
  const metrics: MetricData[] = [
    {
      label: 'Общие активы',
      value: '₽2,847,592',
      change: '+12.5%',
      trend: 'up',
      icon: 'Wallet'
    },
    {
      label: 'Прибыль сегодня',
      value: '₽47,238',
      change: '+8.2%',
      trend: 'up',
      icon: 'TrendingUp'
    },
    {
      label: 'Средний чек',
      value: '₽15,847',
      change: '-2.1%',
      trend: 'down',
      icon: 'Receipt'
    },
    {
      label: 'Операций',
      value: '247',
      change: '+15.7%',
      trend: 'up',
      icon: 'Activity'
    }
  ];

  const transactions: Transaction[] = [
    {
      id: '1',
      amount: 125000,
      type: 'income',
      description: 'Поступление от клиента Premium',
      category: 'Доходы',
      date: '2024-08-09 14:23',
      status: 'completed',
      commission: 2500
    },
    {
      id: '2',
      amount: -35000,
      type: 'expense',
      description: 'Комиссия банка-партнёра',
      category: 'Комиссии',
      date: '2024-08-09 12:15',
      status: 'completed',
      commission: 0
    },
    {
      id: '3',
      amount: 87500,
      type: 'income',
      description: 'Инвестиционная прибыль',
      category: 'Инвестиции',
      date: '2024-08-09 10:45',
      status: 'pending',
      commission: 1750
    },
    {
      id: '4',
      amount: 156800,
      type: 'income',
      description: 'Валютная операция EUR/RUB',
      category: 'Валютные операции',
      date: '2024-08-09 09:30',
      status: 'completed',
      commission: 3136
    },
    {
      id: '5',
      amount: -12500,
      type: 'expense',
      description: 'Платёж поставщику IT-услуг',
      category: 'IT-услуги',
      date: '2024-08-09 08:15',
      status: 'failed'
    }
  ];

  const wallets: WalletData[] = [
    { id: '1', name: 'Основной счёт', currency: 'RUB', balance: 1847592, percentage: 65 },
    { id: '2', name: 'USD Portfolio', currency: 'USD', balance: 12547, percentage: 25 },
    { id: '3', name: 'EUR Savings', currency: 'EUR', balance: 8945, percentage: 10 }
  ];

  const menuItems = [
    { icon: 'LayoutDashboard', label: 'Дашборд', key: 'dashboard' },
    { icon: 'CreditCard', label: 'Кошельки', key: 'wallets' },
    { icon: 'ArrowUpDown', label: 'Транзакции', key: 'transactions' },
    { icon: 'Send', label: 'Выплаты', key: 'payments' },
    { icon: 'Upload', label: 'Импорт', key: 'import' },
    { icon: 'BarChart3', label: 'Аналитика', key: 'analytics' },
    { icon: 'Settings', label: 'Настройки', key: 'settings' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number, currency: string = 'RUB') => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-card/80 backdrop-blur-sm border-border hover:border-gold/30 transition-all duration-300 animate-fade-in group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/20 to-purple/20 flex items-center justify-center group-hover:from-gold/30 group-hover:to-purple/30 transition-colors">
                  <Icon name={metric.icon} className="w-5 h-5 text-gold" />
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs border ${
                    metric.trend === 'up' ? 'text-green-400 border-green-400/30 bg-green-400/10' :
                    metric.trend === 'down' ? 'text-red-400 border-red-400/30 bg-red-400/10' :
                    'text-muted-foreground border-muted-foreground/30'
                  }`}
                >
                  <Icon name={metric.trend === 'up' ? 'ArrowUp' : 'ArrowDown'} className="w-3 h-3 mr-1" />
                  {metric.change}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-2xl font-premium text-foreground">{metric.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume Chart */}
        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="text-gold flex items-center gap-2">
              <Icon name="BarChart3" className="w-5 h-5" />
              Объём транзакций
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {[65, 78, 85, 92, 75, 88, 95].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                  <div 
                    className="w-full bg-gradient-to-t from-gold/80 to-gold/40 rounded-t animate-scale-in transition-all duration-500 hover:from-gold hover:to-gold/60"
                    style={{ 
                      height: `${height}%`,
                      animationDelay: `${index * 100}ms`
                    }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл'][index]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Donut */}
        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="text-gold flex items-center gap-2">
              <Icon name="Activity" className="w-5 h-5" />
              Распределение активов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="relative w-48 h-48">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-8 border-muted/20"></div>
                {/* Progress rings */}
                <div className="absolute inset-2 rounded-full border-4 border-gold/60" style={{
                  background: `conic-gradient(#FFD700 0deg ${65 * 3.6}deg, #8A2BE2 ${65 * 3.6}deg ${90 * 3.6}deg, #6B7280 ${90 * 3.6}deg 360deg)`
                }}></div>
                {/* Center content */}
                <div className="absolute inset-8 rounded-full bg-card flex items-center justify-center border border-border">
                  <div className="text-center">
                    <p className="text-2xl font-premium text-gold">65%</p>
                    <p className="text-sm text-muted-foreground">RUB</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gold"></div>
                  <span className="text-sm">RUB</span>
                </div>
                <span className="text-sm font-medium">65%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple"></div>
                  <span className="text-sm">USD</span>
                </div>
                <span className="text-sm font-medium">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-gray"></div>
                  <span className="text-sm">EUR</span>
                </div>
                <span className="text-sm font-medium">10%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="bg-card/80 backdrop-blur-sm border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gold flex items-center gap-2">
              <Icon name="ArrowUpDown" className="w-5 h-5" />
              Последние транзакции
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setActiveSection('transactions')}>
              Показать все
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.slice(0, 3).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-gold/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-green-400/20' : 'bg-red-400/20'
                  }`}>
                    <Icon 
                      name={transaction.type === 'income' ? 'ArrowUpRight' : 'ArrowDownRight'} 
                      className={`w-5 h-5 ${
                        transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                      }`} 
                    />
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.category} • {transaction.date.split(' ')[1]}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-premium ${
                    transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : ''}{formatCurrency(transaction.amount)}
                  </p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      transaction.status === 'completed' ? 'text-green-400 border-green-400/30' :
                      transaction.status === 'pending' ? 'text-yellow-400 border-yellow-400/30' :
                      'text-red-400 border-red-400/30'
                    }`}
                  >
                    {transaction.status === 'completed' ? 'Завершено' :
                     transaction.status === 'pending' ? 'Ожидает' : 'Отклонено'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderWallets = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.map((wallet) => (
          <Card key={wallet.id} className="bg-card/80 backdrop-blur-sm border-border hover:border-gold/30 transition-colors group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{wallet.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{wallet.currency}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/20 to-purple/20 flex items-center justify-center group-hover:from-gold/30 group-hover:to-purple/30 transition-colors">
                  <Icon name="CreditCard" className="w-6 h-6 text-gold" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-2xl font-premium">{formatCurrency(wallet.balance, wallet.currency)}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Доля портфеля</span>
                    <span className="font-medium">{wallet.percentage}%</span>
                  </div>
                  <Progress value={wallet.percentage} className="h-2" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Icon name="ArrowUp" className="w-4 h-4 mr-2" />
                    Пополнить
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Icon name="ArrowDown" className="w-4 h-4 mr-2" />
                    Вывести
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-6">
      <Card className="bg-card/80 backdrop-blur-sm border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gold flex items-center gap-2">
              <Icon name="ArrowUpDown" className="w-5 h-5" />
              Все транзакции
            </CardTitle>
            <div className="flex items-center gap-3">
              <Input
                placeholder="Поиск транзакций..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Button variant="outline" size="icon">
                <Icon name="Filter" className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <Dialog key={transaction.id}>
                <DialogTrigger asChild>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-gold/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' ? 'bg-green-400/20' : 'bg-red-400/20'
                      }`}>
                        <Icon 
                          name={transaction.type === 'income' ? 'ArrowUpRight' : 'ArrowDownRight'} 
                          className={`w-5 h-5 ${
                            transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                          }`} 
                        />
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.category} • {transaction.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-premium ${
                        transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : ''}{formatCurrency(transaction.amount)}
                      </p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          transaction.status === 'completed' ? 'text-green-400 border-green-400/30' :
                          transaction.status === 'pending' ? 'text-yellow-400 border-yellow-400/30' :
                          'text-red-400 border-red-400/30'
                        }`}
                      >
                        {transaction.status === 'completed' ? 'Завершено' :
                         transaction.status === 'pending' ? 'Ожидает' : 'Отклонено'}
                      </Badge>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-gold">Детали транзакции</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID транзакции</span>
                      <span className="font-mono text-sm">#{transaction.id.padStart(8, '0')}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Сумма</span>
                      <span className={`font-premium text-lg ${
                        transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {formatCurrency(transaction.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Комиссия</span>
                      <span>{formatCurrency(transaction.commission || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Чистая сумма</span>
                      <span className="text-gold font-medium">
                        {formatCurrency(transaction.amount - (transaction.commission || 0))}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Дата и время</span>
                      <span>{transaction.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Категория</span>
                      <span>{transaction.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Статус</span>
                      <Badge 
                        variant="outline" 
                        className={`${
                          transaction.status === 'completed' ? 'text-green-400 border-green-400/30' :
                          transaction.status === 'pending' ? 'text-yellow-400 border-yellow-400/30' :
                          'text-red-400 border-red-400/30'
                        }`}
                      >
                        {transaction.status === 'completed' ? 'Завершено' :
                         transaction.status === 'pending' ? 'Ожидает' : 'Отклонено'}
                      </Badge>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'wallets':
        return renderWallets();
      case 'transactions':
        return renderTransactions();
      case 'payments':
        return (
          <Card className="bg-card/80 backdrop-blur-sm border-border h-64 flex items-center justify-center">
            <div className="text-center">
              <Icon name="Send" className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-xl font-premium text-gold mb-2">Выплаты</h3>
              <p className="text-muted-foreground">Модуль в разработке</p>
            </div>
          </Card>
        );
      case 'import':
        return (
          <Card className="bg-card/80 backdrop-blur-sm border-border h-64 flex items-center justify-center">
            <div className="text-center">
              <Icon name="Upload" className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-xl font-premium text-gold mb-2">Импорт данных</h3>
              <p className="text-muted-foreground">Модуль в разработке</p>
            </div>
          </Card>
        );
      case 'analytics':
        return (
          <Card className="bg-card/80 backdrop-blur-sm border-border h-64 flex items-center justify-center">
            <div className="text-center">
              <Icon name="BarChart3" className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-xl font-premium text-gold mb-2">Расширенная аналитика</h3>
              <p className="text-muted-foreground">Модуль в разработке</p>
            </div>
          </Card>
        );
      case 'settings':
        return (
          <Card className="bg-card/80 backdrop-blur-sm border-border h-64 flex items-center justify-center">
            <div className="text-center">
              <Icon name="Settings" className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-xl font-premium text-gold mb-2">Настройки</h3>
              <p className="text-muted-foreground">Модуль в разработке</p>
            </div>
          </Card>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 z-50 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="p-4">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-gold to-purple flex items-center justify-center">
              <Icon name="Zap" className="w-5 h-5 text-black" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-premium text-xl text-gold">LUNAPAY</h1>
                <p className="text-xs text-sidebar-foreground/60">Premium Fintech</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <div
                key={index}
                onClick={() => setActiveSection(item.key)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-sidebar-accent ${
                  activeSection === item.key ? 'bg-sidebar-accent text-gold' : 'text-sidebar-foreground hover:text-gold'
                }`}
              >
                <Icon name={item.icon} className="w-5 h-5" />
                {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
              </div>
            ))}
          </nav>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 -right-4 w-8 h-8 bg-card border border-border rounded-full"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <Icon name={sidebarCollapsed ? "ChevronRight" : "ChevronLeft"} className="w-4 h-4" />
        </Button>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <header className="border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-premium text-gold mb-2">
                {menuItems.find(item => item.key === activeSection)?.label || 'Dashboard'}
              </h1>
              <p className="text-muted-foreground flex items-center gap-4">
                <span>{currentTime.toLocaleString('ru-RU')}</span>
                <Separator orientation="vertical" className="h-4" />
                <span className="flex items-center gap-2">
                  USD/RUB 79.7796
                  <Badge variant="outline" className="text-green-400 border-green-400/30">
                    <Icon name="TrendingUp" className="w-3 h-3 mr-1" />
                    +0.12%
                  </Badge>
                </span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-gold border-gold/30">
                <Icon name="Bell" className="w-4 h-4 mr-2" />
                3 ожидающие
              </Badge>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gold to-purple p-0.5">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                  <Icon name="User" className="w-5 h-5 text-gold" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;