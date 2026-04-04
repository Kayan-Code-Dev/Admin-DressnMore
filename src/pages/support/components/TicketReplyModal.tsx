import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { type Ticket, type TicketMessage } from '../../../mocks/support';
import ConfirmModal from '../../../components/base/ConfirmModal';

const priorityConfig: Record<string, { label: string; classes: string }> = {
  low:      { label: 'Low',      classes: 'bg-gray-100 text-gray-600' },
  medium:   { label: 'Medium',   classes: 'bg-amber-50 text-amber-700' },
  high:     { label: 'High',     classes: 'bg-rose-50 text-rose-600' },
  critical: { label: 'Critical', classes: 'bg-red-100 text-red-700' },
};

const statusConfig: Record<string, string> = {
  open:     'bg-emerald-50 text-emerald-700',
  pending:  'bg-amber-50 text-amber-700',
  resolved: 'bg-teal-50 text-teal-700',
  closed:   'bg-gray-100 text-gray-500',
};

interface TicketReplyModalProps {
  ticket: Ticket | null;
  onClose: () => void;
  onReply: (ticketId: string, message: string) => void;
  onCloseTicket: (ticketId: string) => void;
}

export default function TicketReplyModal({ ticket, onClose, onReply, onCloseTicket }: TicketReplyModalProps) {
  const { t } = useTranslation();
  const [replyText, setReplyText] = useState('');
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages]);

  useEffect(() => { setReplyText(''); }, [ticket]);

  if (!ticket) return null;

  const priority = priorityConfig[ticket.priority] ?? priorityConfig.medium;
  const statusCls = statusConfig[ticket.status] ?? 'bg-gray-100 text-gray-600';
  const isClosed = ticket.status === 'closed';

  const handleSendReply = () => {
    if (!replyText.trim() || isClosed) return;
    onReply(ticket.id, replyText.trim());
    setReplyText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSendReply();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-4 flex-shrink-0">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-mono text-gray-400">{ticket.id}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priority.classes}`}>
                  {t(`support.priority.${ticket.priority}`)}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusCls}`}>
                  {t(`support.filter.${ticket.status}`)}
                </span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 leading-snug">{ticket.subject}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{ticket.atelier} · {ticket.atelierEmail}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {!isClosed && (
                <button type="button" onClick={() => setShowCloseConfirm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 cursor-pointer whitespace-nowrap transition-colors">
                  <i className="ri-close-circle-line" />{t('support.reply_modal.close_ticket')}
                </button>
              )}
              <button type="button" onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 cursor-pointer transition-colors">
                <i className="ri-close-line text-lg" />
              </button>
            </div>
          </div>

          {/* Conversation */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t('support.reply_modal.conversation')}</p>
            {ticket.messages.map((msg: TicketMessage) => {
              const isAdmin = msg.sender === 'admin';
              return (
                <div key={msg.id} className={`flex gap-3 ${isAdmin ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-xs font-bold flex-shrink-0 ${isAdmin ? 'bg-teal-600' : 'bg-gray-400'}`}>
                    {isAdmin ? 'SA' : msg.senderName.charAt(0)}
                  </div>
                  <div className={`max-w-[75%] ${isAdmin ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      isAdmin
                        ? 'bg-teal-600 text-white rounded-tr-sm'
                        : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                    }`}>
                      {msg.message}
                    </div>
                    <div className={`flex items-center gap-1.5 text-xs text-gray-400 ${isAdmin ? 'flex-row-reverse' : ''}`}>
                      <span className="font-medium">{isAdmin ? t('support.reply_modal.admin') : msg.senderName}</span>
                      <span>·</span>
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Input */}
          {!isClosed ? (
            <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
              <p className="text-xs font-semibold text-gray-500 mb-2">{t('support.reply_modal.your_reply')}</p>
              <div className="flex gap-3">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('support.reply_modal.reply_placeholder')}
                  rows={3}
                  className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 resize-none transition-all"
                />
                <div className="flex flex-col gap-2">
                  <button type="button" onClick={handleSendReply} disabled={!replyText.trim()}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap transition-colors">
                    <i className="ri-send-plane-fill" />{t('support.reply_modal.send_reply')}
                  </button>
                  <p className="text-xs text-gray-400 text-center">Ctrl+Enter</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-2 bg-gray-50 flex-shrink-0">
              <i className="ri-lock-line text-gray-400" />
              <p className="text-sm text-gray-500">This ticket is closed — no further replies allowed</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showCloseConfirm}
        title={t('support.close_ticket')}
        message={t('support.confirm_close')}
        confirmLabel={t('support.close_ticket')}
        confirmVariant="danger"
        onConfirm={() => onCloseTicket(ticket.id)}
        onClose={() => setShowCloseConfirm(false)}
      />
    </>
  );
}
