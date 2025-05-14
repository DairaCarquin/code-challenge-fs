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
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

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

    const totalEvents = Object.keys(groupedEvents).reduce((total, callId) => {
        return total + groupedEvents[callId].length;
    }, 0);

    const totalPages = Math.ceil(totalEvents / rowsPerPage);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;

    const flatEvents = Object.keys(groupedEvents).reduce((acc: (Event & { callId: string })[], callId) => {
        const eventsWithCallId = groupedEvents[callId].map(event => ({
            ...event,
            callId,
        }));
        return acc.concat(eventsWithCallId);
    }, []);

    const currentEvents = flatEvents.slice(indexOfFirstRow, indexOfLastRow);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

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
                        {currentEvents.length > 0 ? (
                            currentEvents.map((event, index) => {
                                const callId = event.callId;
                                const callEvents = groupedEvents[callId];
                                return (
                                    <React.Fragment key={`${callId}-${event.id}`}>
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
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    style={{
                                        padding: '16px',
                                        textAlign: 'center',
                                        color: '#6b7280',
                                    }}
                                >
                                    No events available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div
                style={{
                    marginTop: '16px',
                    fontSize: '14px',
                    color: '#374151',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
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
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                </select>
            </div>

            <div
                style={{
                    marginTop: '16px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
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
