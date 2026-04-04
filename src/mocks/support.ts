export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export interface TicketMessage {
  id: string;
  sender: 'atelier' | 'admin';
  senderName: string;
  message: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  atelier: string;
  atelierEmail: string;
  subject: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  messages: TicketMessage[];
}

export const ticketsData: Ticket[] = [
  {
    id: 'TKT-001', atelier: 'Elegance Studio', atelierEmail: 'ahmed@elegance.com',
    subject: 'Unable to add new employee — button grayed out', priority: 'high', status: 'open',
    createdAt: '2026-03-19 09:14',
    messages: [
      { id: 'm1', sender: 'atelier', senderName: 'Ahmed Al-Rashidi', timestamp: '2026-03-19 09:14', message: "I'm trying to add a new employee to my account but the button is grayed out. I'm on the Enterprise plan so I should have unlimited employees. Please help!" },
    ],
  },
  {
    id: 'TKT-002', atelier: 'Couture House', atelierEmail: 'sara@couturehouse.sa',
    subject: 'Renewal invoice not received', priority: 'medium', status: 'pending',
    createdAt: '2026-03-18 14:30',
    messages: [
      { id: 'm1', sender: 'atelier', senderName: 'Sara Khalil', timestamp: '2026-03-18 14:30', message: 'My subscription renewed 3 days ago but I never received the invoice by email. Can you resend it please?' },
      { id: 'm2', sender: 'admin', senderName: 'Admin', timestamp: '2026-03-18 15:05', message: 'Thank you for reaching out, Sara. I\'ll check the email logs and resend the invoice right away. Could you confirm the email address on your account?' },
      { id: 'm3', sender: 'atelier', senderName: 'Sara Khalil', timestamp: '2026-03-18 15:20', message: 'Yes, it\'s sara@couturehouse.sa — same as the support email.' },
    ],
  },
  {
    id: 'TKT-003', atelier: 'La Belle Mode', atelierEmail: 'lina@labellemode.com',
    subject: 'Request to upgrade from Pro to Enterprise', priority: 'low', status: 'resolved',
    createdAt: '2026-03-17 11:00',
    messages: [
      { id: 'm1', sender: 'atelier', senderName: 'Lina Moussa', timestamp: '2026-03-17 11:00', message: 'We would like to upgrade our current Pro plan to Enterprise. We have 4 branches now and need the extra features.' },
      { id: 'm2', sender: 'admin', senderName: 'Admin', timestamp: '2026-03-17 11:30', message: "That's great to hear, Lina! I've upgraded your account to Enterprise effective immediately. The pro-rated difference has been added to your next invoice." },
      { id: 'm3', sender: 'atelier', senderName: 'Lina Moussa', timestamp: '2026-03-17 11:45', message: 'Thank you so much! Everything looks perfect now.' },
    ],
  },
  {
    id: 'TKT-004', atelier: 'Fashion Forward', atelierEmail: 'omar@fashforward.sa',
    subject: 'Payment keeps failing with Mada card', priority: 'critical', status: 'open',
    createdAt: '2026-03-19 16:55',
    messages: [
      { id: 'm1', sender: 'atelier', senderName: 'Omar Farouk', timestamp: '2026-03-19 16:55', message: "I've tried 4 times to pay my renewal with my Mada card but it keeps failing with error code 3DS_FAILED. The bank says it's approved on their side. Please fix this urgently!" },
    ],
  },
  {
    id: 'TKT-005', atelier: 'Silk & Style', atelierEmail: 'fatima@silkstyle.com',
    subject: 'How to export customer reports to Excel?', priority: 'low', status: 'closed',
    createdAt: '2026-03-15 10:20',
    messages: [
      { id: 'm1', sender: 'atelier', senderName: 'Fatima Al-Zahra', timestamp: '2026-03-15 10:20', message: 'Is there a way to export customer reports as Excel files? I can only find PDF export.' },
      { id: 'm2', sender: 'admin', senderName: 'Admin', timestamp: '2026-03-15 11:00', message: 'Hi Fatima! Yes, you can export to Excel by going to Reports → Customer Reports, then clicking the Export button and selecting XLSX format. Let me know if you need further help!' },
      { id: 'm3', sender: 'atelier', senderName: 'Fatima Al-Zahra', timestamp: '2026-03-15 11:15', message: 'Found it, thank you! Closing this ticket.' },
    ],
  },
  {
    id: 'TKT-006', atelier: 'Royal Threads', atelierEmail: 'khalid@royalthreads.sa',
    subject: 'SMS notifications not sending to customers', priority: 'high', status: 'open',
    createdAt: '2026-03-20 08:40',
    messages: [
      { id: 'm1', sender: 'atelier', senderName: 'Khalid Sami', timestamp: '2026-03-20 08:40', message: "Since yesterday's update, our customers stopped receiving SMS notifications for order confirmations. We have 7 branches affected. This is urgent as it's impacting our business operations." },
    ],
  },
  {
    id: 'TKT-007', atelier: 'Vogue Atelier', atelierEmail: 'hassan@vogue.com',
    subject: 'Request for custom domain integration', priority: 'medium', status: 'pending',
    createdAt: '2026-03-16 13:10',
    messages: [
      { id: 'm1', sender: 'atelier', senderName: 'Hassan Tamer', timestamp: '2026-03-16 13:10', message: 'We would like to use our own domain (portal.vogueatelier.com) for the customer portal. Is this possible with our Pro plan?' },
      { id: 'm2', sender: 'admin', senderName: 'Admin', timestamp: '2026-03-16 14:00', message: "Custom domains are available on the Enterprise plan. I'd be happy to arrange a trial upgrade so you can evaluate the feature. Would that work for you?" },
    ],
  },
  {
    id: 'TKT-008', atelier: 'Chic Couture', atelierEmail: 'dina@chiccouture.sa',
    subject: 'Billing cycle change from monthly to annual', priority: 'low', status: 'resolved',
    createdAt: '2026-03-14 09:30',
    messages: [
      { id: 'm1', sender: 'atelier', senderName: 'Dina Qassem', timestamp: '2026-03-14 09:30', message: 'We want to switch from monthly to annual billing to save on costs. How do we do this?' },
      { id: 'm2', sender: 'admin', senderName: 'Admin', timestamp: '2026-03-14 10:15', message: "I've switched your plan to annual billing. You'll save 17% — the adjustment has been applied to your account. Your next renewal will be on March 14, 2027." },
      { id: 'm3', sender: 'atelier', senderName: 'Dina Qassem', timestamp: '2026-03-14 10:30', message: 'Perfect, thank you for the quick response!' },
    ],
  },
];
