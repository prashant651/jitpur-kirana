import { ChequeStatus } from '../types.js';

export const mockAccounts = [
  { id: '1', name: 'Ram Store', type: 'customer', phone: '9876543210', address: 'Main Bazaar, Jitpur', pan: '12345ABC' },
  { id: '2', name: 'Shyam Suppliers', type: 'supplier', phone: '9876543211', address: 'Industrial Area, Birgunj', pan: '67890DEF' },
  { id: '3', name: 'Hari General', type: 'customer', phone: '9876543212', address: 'Adarshnagar, Birgunj', pan: '11223GHI' },
];

export const mockTransactions = [
  { id: 't1', accountId: '1', amount: 5000, type: 'increase', date: '2081-04-01' },
  { id: 't2', accountId: '1', amount: 2000, type: 'decrease', date: '2081-04-02', note: 'Cash payment' },
  { id: 't3', accountId: '2', amount: 10000, type: 'increase', date: '2081-04-03' },
  { id: 't4', accountId: '2', amount: 4000, type: 'decrease', date: '2081-04-04' },
  { id: 't5', accountId: '3', amount: 1500, type: 'increase', date: '2081-04-05' },
];

export const mockCheques = [
    { id: 'c1', type: 'payable', partyName: 'Shyam Suppliers', bankName: 'Nabil Bank', chequeNumber: '123456', amount: 15000, date: '2081-06-10', reminderDate: '2081-06-08', status: ChequeStatus.Pending },
    { id: 'c2', type: 'receivable', partyName: 'Ram Store', bankName: 'Prabhu Bank', chequeNumber: '654321', amount: 8000, date: '2081-06-15', reminderDate: '2081-06-14', status: ChequeStatus.Pending },
    { id: 'c3', type: 'payable', partyName: 'Global Traders', bankName: 'Himalayan Bank', chequeNumber: '987654', amount: 22000, date: '2081-06-20', reminderDate: '2081-06-18', status: ChequeStatus.Cleared },
    { id: 'c4', type: 'receivable', partyName: 'New Customer', bankName: 'NIC Asia Bank', chequeNumber: '112233', amount: 5000, date: '2081-06-05', reminderDate: '2081-05-29', status: ChequeStatus.Pending },
];

export const commonItems = [
    { name: 'Waiwai 60gm', rate: 25 },
    { name: 'Waiwai Mini', rate: 20 },
    { name: 'Express Noodles', rate: 20 },
    { name: 'Petpuja+Pizza', rate: 25 },
    { name: 'Premium Noodles', rate: 30 },
    { name: '50 Piro Noodles', rate: 50 },
    { name: 'Arna 660ml', rate: 350 },
    { name: 'Arna 8 330ml', rate: 280 },
    { name: 'Sunflower Oil', rate: 250 },
    { name: 'Mustard Oil', rate: 280 },
    { name: 'Thulo Vuja', rate: 100 },
    { name: 'Vuja Sano', rate: 50 },
    { name: 'Maseura', rate: 150 },
    { name: 'Cheura', rate: 120 },
    { name: 'Msuro Dal', rate: 160 },
    { name: '2 kg Atta', rate: 160 },
    { name: '5 kg Atta', rate: 400 },
    { name: 'Maida', rate: 90 },
    { name: 'Chini (Sugar)', rate: 100 },
    { name: 'Redbull Small', rate: 120 },
    { name: 'Redbull Big', rate: 180 },
    { name: 'Rich Coffee', rate: 5 },
    { name: 'Patanjali 20', rate: 20 },
    { name: 'Patanjali 10', rate: 10 },
    { name: '2 ltr Coke', rate: 180 },
    { name: '1 ltr Coke', rate: 110 },
    { name: '250ml Jigri', rate: 30 },
    { name: 'Rio', rate: 80 },
    { name: '50 Chips', rate: 50 },
    { name: '10 Cheeseball', rate: 10 },
    { name: '10 Chips', rate: 10 },
    { name: 'Sunsilk Shampoo', rate: 5 },
    { name: 'Chocolate', rate: 20 },
    { name: '', rate: 0 },
    { name: '', rate: 0 },
    { name: '', rate: 0 },
    { name: '', rate: 0 },
    { name: '', rate: 0 },
    { name: 'Meghdut', rate: 15 },
    { name: 'Nepal', rate: 15 },
    { name: 'Vola', rate: 20 },
    { name: 'Chakka', rate: 20 },
    { name: 'Shikhar Ice', rate: 15 },
    { name: 'Khukuri Filter', rate: 25 },
    { name: 'Pilot Filter', rate: 25 },
    { name: 'Saan Filter', rate: 25 },
    { name: 'Bijuli', rate: 25 },
    { name: 'Surya', rate: 30 },
    { name: '', rate: 0 },
    { name: '', rate: 0 },
    { name: '', rate: 0 },
    { name: '', rate: 0 },
    { name: '', rate: 0 },
];

export const mockDailyHisabsData = [
    {
        date: '2081-05-28',
        status: 'submitted',
        stockItems: commonItems.map((item, index) => ({
            id: `item-${index}`,
            ...item,
            openingQty: 50,
            closingQty: 30 + (index % 10),
        })).filter(item => item.name),
        balance: {
            cashTransactions: [
                { id: 'dt1', customerId: 'h-acc-1', amount: 1500 },
            ],
            creditTransactions: [
                 { id: 'dt3', customerId: 'h-acc-2', amount: 500 },
            ],
            chequesReceived: 10000,
            expenses: 500,
            onlinePayments: 12000,
            chequesOnHand: 10000,
            cashOnHand: 35000,
        }
    },
];

export const mockHisabAccounts = [
    { id: 'h-acc-1', name: 'Walking Customer A', type: 'customer' },
    { id: 'h-acc-2', name: 'Neighbour Shop', type: 'customer' },
];

export const mockHisabTransactions = [
    { id: 'ht-1', accountId: 'h-acc-1', amount: 2500, type: 'increase', date: '2081-05-27', note: 'Previous day credit' },
    { id: 'ht-2', accountId: 'h-acc-1', amount: 1000, type: 'decrease', date: '2081-05-27', note: 'Previous day payment' },
    { id: 'ht-3', accountId: 'h-acc-2', amount: 800, type: 'increase', date: '2081-05-26' },
];
