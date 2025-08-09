import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
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

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
    }
  ];

  const menuItems = [
    { icon: 'LayoutDashboard', label: 'Дашборд', active: true },
    { icon: 'CreditCard', label: 'Кошельки' },
    { icon: 'ArrowUpDown', label: 'Транзакции' },
    { icon: 'Send', label: 'Выплаты' },
    { icon: 'Upload', label: 'Импорт' },
    { icon: 'BarChart3', label: 'Аналитика' },
    { icon: 'Settings', label: 'Настройки' }
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark">
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
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-sidebar-accent ${
                  item.active ? 'bg-sidebar-accent text-gold' : 'text-sidebar-foreground'
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
              <h1 className="text-3xl font-premium text-gold mb-2">Dashboard Overview</h1>
              <p className="text-muted-foreground">
                {currentTime.toLocaleString('ru-RU')} • USD/₽ 79.78
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-gold border-gold">
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

        {/* Dashboard Content */}
        <main className="p-6 space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-gold/30 transition-colors duration-300 animate-fade-in">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Icon name={metric.icon} className="w-5 h-5 text-gold" />
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        metric.trend === 'up' ? 'text-green-400 border-green-400/30' :
                        metric.trend === 'down' ? 'text-red-400 border-red-400/30' :
                        'text-muted-foreground border-muted-foreground/30'
                      }`}
                    >
                      {metric.change}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl font-premium text-foreground animate-pulse-gold">{metric.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Volume Chart */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-gold flex items-center gap-2">
                  <Icon name="BarChart3" className="w-5 h-5" />
                  Объём по месяцам
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {[65, 78, 85, 92, 75, 88, 95].map((height, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-gradient-to-t from-gold/80 to-gold/40 rounded-t animate-scale-in"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-xs text-muted-foreground mt-2">
                        {['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл'][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activity Chart */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-gold flex items-center gap-2">
                  <Icon name="Activity" className="w-5 h-5" />
                  Активность по дням
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <div className="w-48 h-48 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-gold/30"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold animate-spin"></div>
                    <div className="absolute inset-8 rounded-full bg-gradient-to-br from-gold/20 to-purple/20 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-premium text-gold">87%</p>
                        <p className="text-sm text-muted-foreground">Активность</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transactions Section */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-gold flex items-center gap-2">
                  <Icon name="ArrowUpDown" className="w-5 h-5" />
                  Последние транзакции
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
                          <span className="font-mono text-sm">#{transaction.id}</span>
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
                          <span className="text-muted-foreground">Чистая прибыль</span>
                          <span className="text-gold font-medium">
                            {formatCurrency(transaction.amount - (transaction.commission || 0))}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Дата</span>
                          <span>{transaction.date}</span>
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
        </main>
      </div>
    </div>
  );
};

export default Index;