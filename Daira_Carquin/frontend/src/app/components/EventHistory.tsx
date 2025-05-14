import React, { useState, useEffect } from 'react';

interface Event {
    id: string;
    type: string;
    timestamp: string;
    metadata: Record<string, any>;
}

interface CallEvent {
    callId: string;
    events: Event[];
}

const EventHistory: React.FC = () => {
    const [events, setEvents] = useState<CallEvent[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const res = await fetch('/api/events');
            const data = await res.json();
            setEvents(data);
        };

        fetchEvents();
    }, []);

    if (!Array.isArray(events) || events.length === 0) {
        return (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>
                No events to display.
            </p>
        );
    }

    const groupedEvents = events.reduce((acc: Record<string, Event[]>, call) => {
        if (!acc[call.callId]) {
            acc[call.callId] = [];
        }
        acc[call.callId].push(...call.events);
        return acc;
    }, {});

    return (
        <div style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#374151', marginBottom: '16px' }}>
                Event History
            </h2>

            <div style={{ overflowX: 'auto' }}>
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        fontSize: '14px',
                        tableLayout: 'fixed',
                    }}
                >
                    <thead>
                        <tr
                            style={{
                                backgroundColor: '#f3f4f6',
                                color: '#374151',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}
                        >
                            <th style={{ padding: '12px', border: '1px solid #d1d5db', textAlign: 'center', width: '15%' }}>
                                Call ID
                            </th>
                            <th style={{ padding: '12px', border: '1px solid #d1d5db', textAlign: 'center', width: '25%' }}>
                                Event Type
                            </th>
                            <th style={{ padding: '12px', border: '1px solid #d1d5db', textAlign: 'center', width: '25%' }}>
                                Timestamp
                            </th>
                            <th style={{ padding: '12px', border: '1px solid #d1d5db', textAlign: 'left', width: '35%' }}>
                                Metadata
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(groupedEvents).map((callId) => {
                            const callEvents = groupedEvents[callId];
                            return (
                                <React.Fragment key={callId}>
                                    {callEvents.map((event, index) => (
                                        <tr
                                            key={`${callId}-${event.id}`}
                                            style={{
                                                borderTop: '1px solid #e5e7eb',
                                                transition: 'background-color 0.2s',
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                                        >
                                            {index === 0 ? (
                                                <td
                                                    rowSpan={callEvents.length}
                                                    style={{
                                                        padding: '12px',
                                                        textAlign: 'center',
                                                        border: '1px solid #d1d5db',
                                                        fontWeight: 500,
                                                        color: '#1d4ed8',
                                                        fontFamily: 'monospace',
                                                    }}
                                                >
                                                    {callId}
                                                </td>
                                            ) : null}
                                            <td
                                                style={{
                                                    padding: '12px',
                                                    textAlign: 'center',
                                                    border: '1px solid #d1d5db',
                                                }}
                                            >
                                                {event.type}
                                            </td>
                                            <td
                                                style={{
                                                    padding: '12px',
                                                    textAlign: 'center',
                                                    border: '1px solid #d1d5db',
                                                }}
                                            >
                                                {new Date(event.timestamp).toLocaleString()}
                                            </td>
                                            <td
                                                style={{
                                                    padding: '12px',
                                                    textAlign: 'left',
                                                    border: '1px solid #d1d5db',
                                                    fontFamily: 'monospace',
                                                    whiteSpace: 'pre-wrap',
                                                    fontSize: '13px',
                                                    overflowWrap: 'break-word',
                                                }}
                                            >
                                                {JSON.stringify(event.metadata, null, 2)}
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            );
                        })}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default EventHistory;
