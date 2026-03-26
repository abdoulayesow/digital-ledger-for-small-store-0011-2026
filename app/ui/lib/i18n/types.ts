/** Type-safe translation keys. All language files must satisfy this interface. */
export interface Translations {
  common: {
    appName: string;
    save: string;
    cancel: string;
    delete: string;
    confirm: string;
    back: string;
    next: string;
    done: string;
    search: string;
    loading: string;
    error: string;
    retry: string;
    offline: string;
    online: string;
    syncing: string;
    noData: string;
    today: string;
    yesterday: string;
    close: string;
    clear: string;
    sessionError: string;
    connectionCheck: string;
    errorTitle: string;
    errorMessage: string;
  };
  auth: {
    phoneNumber: string;
    enterPhone: string;
    enterPin: string;
    createPin: string;
    confirmPin: string;
    pinMismatch: string;
    invalidPin: string;
    accountLocked: string;
    phoneTaken: string;
    tooManyAttempts: string;
    logout: string;
    tryDemo: string;
    demoMode: string;
  };
  nav: {
    home: string;
    customers: string;
    reminders: string;
    settings: string;
  };
  customers: {
    addCustomer: string;
    customerName: string;
    phoneOptional: string;
    editCustomer: string;
    deleteConfirm: string;
    noCustomers: string;
    totalOwed: string;
    saleHistory: string;
  };
  sales: {
    addCreditSale: string;
    addCashSale: string;
    addPayment: string;
    quickSale: string;
    amount: string;
    enterAmount: string;
    otherAmount: string;
    note: string;
    noteOptional: string;
    creditSaleRecorded: string;
    cashSaleRecorded: string;
    paymentRecorded: string;
    todaySummary: string;
    cashCollected: string;
    creditGiven: string;
    totalReceivables: string;
    saleCount: string;
    todayTotal: string;
    cashSales: string;
    undoSale: string;
    saleUndone: string;
  };
  reminders: {
    sendReminder: string;
    reminderSent: string;
    overdueDebts: string;
    noOverdue: string;
    messagePreview: string;
    whatsappMessage: string;
  };
  settings: {
    language: string;
    chooseLanguage: string;
    shopName: string;
    help: string;
    about: string;
    logoutWarning: string;
  };
  creditAge: {
    green: string;
    yellow: string;
    red: string;
  };
  pwa: {
    install: string;
    installDescription: string;
    dismiss: string;
    updateAvailable: string;
    updateDescription: string;
    update: string;
  };
  offline: {
    title: string;
    message: string;
  };
}
