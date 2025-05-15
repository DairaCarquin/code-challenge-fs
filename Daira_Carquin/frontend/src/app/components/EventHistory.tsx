import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

interface Event {
    id: string;
    callId: string;
    type: string;
    timestamp: string;
    metadata: Record<string, unknown>;
}

interface SocketPayload {
    data: {
      id?: string;
      callId?: string;
      call_id?: string;
      type?: string;
      timestamp?: string;
      metadata?: Record<string, unknown>;
    };
  }

interface CallEvent {
    callId: string;
    events: Event[];
}

const EventHistory: React.FC = () => {
    const [events, setEvents] = useState<CallEvent[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const fetchEvents = async () => {
            const res = await fetch('/api/events');
            const data = await res.json();
            setEvents(data);
        };

        fetchEvents();

        socket.on('new-event', (payload: SocketPayload) => {
            const { data } = payload;
            const newEvent: Event = {
                id: data.id ?? crypto.randomUUID(),
                callId: data.callId ?? data.call_id ?? '',
                type: data.type ?? 'unknown',
                timestamp: data.timestamp ?? new Date().toISOString(),
                metadata: data.metadata ?? {},
            };

            console.log('[SOCKET EVENT]', newEvent);

            if (!newEvent.callId) return; 

            setEvents(prev => {
                const index = prev.findIndex(c => c.callId === newEvent.callId);
                if (index !== -1) {
                    const updated = [...prev];
                    updated[index].events.push(newEvent);
                    return updated;
                } else {
                    return [...prev, { callId: newEvent.callId, events: [newEvent] }];
                }
            });
        });

        return () => {
            socket.off('new-event');
        };
    }, []);

    if (!Array.isArray(events) || events.length === 0) {
        return (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>
                No events to display.
            </p>
        );
    }

    const groupedEvents = events.reduce((acc: Record<string, Event[]>, call) => {
        if (!call.callId) return acc;

        if (!acc[call.callId]) acc[call.callId] = [];
        if (Array.isArray(call.events)) acc[call.callId].push(...call.events);

        return acc;
    }, {});

    const totalEvents = Object.values(groupedEvents).reduce((total, arr) => total + arr.length, 0);
    const totalPages = Math.ceil(totalEvents / rowsPerPage);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;

    const flatEvents = Object.entries(groupedEvents).flatMap(([callId, events]) =>
        events.map(event => ({ ...event, callId }))
    );

    const currentEvents = flatEvents.slice(indexOfFirstRow, indexOfLastRow);

    const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    return (
        <div style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#374151', marginBottom: '16px' }}>
                Event History
            </h2>

            <div style={{ overflowX: 'auto' }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    fontSize: '14px',
                    tableLayout: 'fixed',
                }}>
                    <thead>
                        <tr style={{
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                        }}>
                            <th style={{ padding: '12px', border: '1px solid #d1d5db', textAlign: 'center', width: '15%' }}>Call ID</th>
                            <th style={{ padding: '12px', border: '1px solid #d1d5db', textAlign: 'center', width: '25%' }}>Event Type</th>
                            <th style={{ padding: '12px', border: '1px solid #d1d5db', textAlign: 'center', width: '25%' }}>Timestamp</th>
                            <th style={{ padding: '12px', border: '1px solid #d1d5db', textAlign: 'left', width: '35%' }}>Metadata</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEvents.length > 0 ? currentEvents.map((event, index) => (
                            <tr key={`${event.callId}-${event.timestamp}-${index}`} style={{
                                borderTop: '1px solid #e5e7eb',
                                transition: 'background-color 0.2s',
                            }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}>
                                <td style={{
                                    padding: '12px',
                                    textAlign: 'center',
                                    border: '1px solid #d1d5db',
                                    fontWeight: 500,
                                    color: '#1d4ed8',
                                    fontFamily: 'monospace',
                                }}>
                                    {event.callId}
                                </td>
                                <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #d1d5db' }}>
                                    {event.type}
                                </td>
                                <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #d1d5db' }}>
                                    {new Date(event.timestamp).toLocaleString()}
                                </td>
                                <td style={{
                                    padding: '12px',
                                    textAlign: 'left',
                                    border: '1px solid #d1d5db',
                                    fontFamily: 'monospace',
                                    whiteSpace: 'pre-wrap',
                                    fontSize: '13px',
                                    overflowWrap: 'break-word',
                                }}>
                                    {JSON.stringify(event.metadata, null, 2)}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>
                                    No events available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div style={{
                marginTop: '16px',
                fontSize: '14px',
                color: '#374151',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <span>
                    Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, totalEvents)} of {totalEvents} events
                </span>

                <select
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    style={{
                        padding: '8px',
                        fontSize: '14px',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb',
                    }}
                >
                    {[5, 10, 15, 20].map(n => (
                        <option key={n} value={n}>{n}</option>
                    ))}
                </select>
            </div>

            <div style={{
                marginTop: '16px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                        padding: '8px 16px',
                        margin: '0 8px',
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    }}
                >
                    Previous
                </button>
                <span>{`${currentPage} / ${totalPages}`}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                        padding: '8px 16px',
                        margin: '0 8px',
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    }}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default EventHistory;
