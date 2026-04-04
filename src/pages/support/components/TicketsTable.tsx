import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ticketsData, type Ticket, type TicketStatus } from '../../../mocks/support';
import TicketReplyModal from './TicketReplyModal';

type FilterKey = 'all' | TicketStatus;

const priorityConfig: Record<string, { icon: string; classes: string }> = {
  low:      { icon: 'ri-arrow-down-line',        classes: 'bg-gray-100 text-gray-600' },
  medium:   { icon: 'ri-equal-line',             classes: 'bg-amber-50 text-amber-700' },
  high:     { icon: 'ri-arrow-up-line',          classes: 'bg-rose-50 text-rose-600' },
  critical: { icon: 'ri-arrow-up-double-line',   classes: 'bg-red-100 text-red-700 font-bold' },
};

const statusConfig: Record<string, string> = {
  open:     'bg-emerald-50 text-emerald-700',
  pending:  'bg-amber-50 text-amber-700',
  resolved: 'bg-teal-50 text-teal-700',
  closed:   'bg-gray-100 text-gray-500',
};

export default function TicketsTable() {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState<Ticket[]>(ticketsData);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const PAGE_SIZE = 8;

  const filtered = useMemo(() => {
    let result = filter === 'all' ? tickets : tickets.filter((t) => t.status === filter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((t) =>
        t.id.toLowerCase().includes(q) ||
        t.atelier.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q)
      );
    }
    return result;
  }, [tickets, filter, search]);

  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const pageCount  = Math.ceil(filtered.length / PAGE_SIZE);

  const counts = useMemo(() => ({
    total:    tickets.length,
    open:     tickets.filter((t) => t.status === 'open').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
    closed:   tickets.filter((t) => t.status === 'closed').length,
  }), [tickets]);

  const handleReply = (ticketId: string, message: string) => {
    setTickets((prev) => prev.map((t) => {
      if (t.id !== ticketId) return t;
      const newMsg = {
        id: `m${Date.now()}`, sender: 'admin' as const, senderName: 'Admin',
        message, timestamp: new Date().toLocaleString('en-CA', { hour12: false }).replace(',', '').slice(0, 16),
      };
      return { ...t, status: 'pending' as TicketStatus, messages: [...t.messages, newMsg] };
    }));
    setSelectedTicket((prev) => {
      if (!prev || prev.id !== ticketId) return prev;
      const newMsg = {
        id: `m${Date.now()}`, sender: 'admin' as const, senderName: 'Admin',
        message, timestamp: new Date().toLocaleString('en-CA', { hour12: false }).replace(',', '').slice(0, 16),
      };
      return { ...prev, status: 'pending' as TicketStatus, messages: [...prev.messages, newMsg] };
    });
  };

  const handleCloseTicket = (ticketId: string) => {
    setTickets((prev) => prev.map((t) => t.id === ticketId ? { ...t, status: 'closed' as TicketStatus } : t));
    setSelectedTicket((prev) => prev?.id === ticketId ? { ...prev, status: 'closed' as TicketStatus } : prev);
  };

  const filters: { key: FilterKey; labelKey: string }[] = [
    { key: 'all',      labelKey: 'support.filter.all'      },
    { key: 'open',     labelKey: 'support.filter.open'     },
    { key: 'pending',  labelKey: 'support.filter.pending'  },
    { key: 'resolved', labelKey: 'support.filter.resolved' },
    { key: 'closed',   labelKey: 'support.filter.closed'   },
  ];

  const from = page * PAGE_SIZE + 1;
  const to   = Math.min((page + 1) * PAGE_SIZE, filtered.length);

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: t('support.summary.total'),    value: counts.total,    icon: 'ri-customer-service-2-line', bg: 'bg-teal-50 text-teal-600'    },
            { label: t('support.summary.open'),     value: counts.open,     icon: 'ri-mail-open-line',          bg: 'bg-rose-50 text-rose-500'    },
            { label: t('support.summary.resolved'), value: counts.resolved, icon: 'ri-checkbox-circle-line',    bg: 'bg-emerald-50 text-emerald-600' },
            { label: t('support.summary.closed'),   value: counts.closed,   icon: 'ri-lock-line',               bg: 'bg-gray-100 text-gray-500'   },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-xl p-4 ring-1 ring-gray-100 flex items-center gap-3">
              <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${card.bg}`}>
                <i className={`${card.icon} text-lg`} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">{card.label}</p>
                <p className="text-xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl ring-1 ring-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {filters.map((f) => (
                <button key={f.key} type="button" onClick={() => { setFilter(f.key); setPage(0); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${filter === f.key ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {t(f.labelKey)}
                </button>
              ))}
            </div>
            <div className="relative">
              <div className="w-4 h-4 flex items-center justify-center absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <i className="ri-search-line text-xs" />
              </div>
              <input type="text" placeholder={t('support.search_placeholder')} value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                className="w-52 ps-8 pe-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  {['col.id', 'col.atelier', 'col.subject', 'col.priority', 'col.status', 'col.created', 'col.actions'].map((key) => (
                    <th key={key} className="px-4 py-3 text-start text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {t(`support.${key}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <i className="ri-customer-service-2-line text-4xl" />
                      <p className="text-sm font-medium">{t('support.no_tickets')}</p>
                    </div>
                  </td></tr>
                ) : paginated.map((ticket) => {
                  const pri = priorityConfig[ticket.priority] ?? priorityConfig.medium;
                  const stCls = statusConfig[ticket.status] ?? 'bg-gray-100 text-gray-600';
                  const hasUnread = ticket.status === 'open' && ticket.messages[ticket.messages.length - 1]?.sender === 'atelier';
                  return (
                    <tr key={ticket.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">{ticket.id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-gray-900">{ticket.atelier}</p>
                        <p className="text-xs text-gray-400">{ticket.atelierEmail}</p>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <div className="flex items-center gap-2">
                          {hasUnread && <div className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />}
                          <p className="text-sm text-gray-800 truncate">{ticket.subject}</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{ticket.messages.length} messages</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${pri.classes}`}>
                          <i className={pri.icon} />{t(`support.priority.${ticket.priority}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${stCls}`}>
                          {t(`support.filter.${ticket.status}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-500">{ticket.createdAt}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button type="button" onClick={() => setSelectedTicket(ticket)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 cursor-pointer whitespace-nowrap transition-colors">
                          <i className="ri-reply-line" />{t('support.reply')}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {t('table.showing')} {from}–{to} {t('table.of')} {filtered.length} {t('support.tickets_count')}
              </p>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors">
                  <i className="ri-arrow-right-s-line" />
                </button>
                {Array.from({ length: pageCount }, (_, i) => (
                  <button key={i} type="button" onClick={() => setPage(i)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${page === i ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                    {i + 1}
                  </button>
                ))}
                <button type="button" onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))} disabled={page >= pageCount - 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors">
                  <i className="ri-arrow-left-s-line" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <TicketReplyModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onReply={handleReply}
        onCloseTicket={handleCloseTicket}
      />
    </>
  );
}
