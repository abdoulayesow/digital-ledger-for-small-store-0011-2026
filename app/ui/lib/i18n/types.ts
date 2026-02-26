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
    noData: string;
  };
  auth: {
    phoneNumber: string;
    enterPhone: string;
    sendCode: string;
    enterCode: string;
    verifyCode: string;
    invalidCode: string;
    codeExpired: string;
    logout: string;
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
    noCustomers: string;
    totalOwed: string;
    lastTransaction: string;
  };
  transactions: {
    addDebt: string;
    addPayment: string;
    amount: string;
    enterAmount: string;
    note: string;
    noteOptional: string;
    debtRecorded: string;
    paymentRecorded: string;
    todaySummary: string;
    cashCollected: string;
    creditGiven: string;
    totalReceivables: string;
  };
  reminders: {
    sendReminder: string;
    reminderSent: string;
    overdueDebts: string;
    noOverdue: string;
    messagePreview: string;
  };
  settings: {
    language: string;
    chooseLanguage: string;
    shopName: string;
    help: string;
    about: string;
  };
  debt: {
    green: string;
    yellow: string;
    red: string;
  };
}
