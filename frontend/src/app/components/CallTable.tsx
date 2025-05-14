import React from 'react';

interface Call {
    id: string;
    status: string;
    queueId: string;
    startTime: string;
}

const CallTable: React.FC<{ calls: Call[] }> = ({ calls }) => {
    return (
        <div
            style={{
                padding: '24px',
            }}
        >
            <h2
                style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#374151',
                    marginBottom: '16px',
                }}
            >
                Active Calls
            </h2>

            <div style={{ overflowX: 'auto' }}>
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '14px',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
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
                            <th style={{ padding: '12px', textAlign: 'left', width: '25%' }}>ID</th>
                            <th style={{ padding: '12px', textAlign: 'left', width: '25%' }}>Status</th>
                            <th style={{ padding: '12px', textAlign: 'left', width: '25%' }}>Queue</th>
                            <th style={{ padding: '12px', textAlign: 'left', width: '25%' }}>Start Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(calls) && calls.length > 0 ? (
                            calls.map((call) => (
                                <tr
                                    key={call.id}
                                    style={{
                                        borderBottom: '1px solid #e5e7eb',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s',
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.backgroundColor = '#f9fafb')
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.backgroundColor = '#ffffff')
                                    }
                                >
                                    <td
                                        style={{
                                            padding: '12px',
                                            fontFamily: 'monospace',
                                            color: '#1d4ed8',
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {call.id}
                                    </td>
                                    <td
                                        style={{
                                            padding: '12px',
                                            textTransform: 'capitalize',
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {call.status}
                                    </td>
                                    <td
                                        style={{
                                            padding: '12px',
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {call.queueId}
                                    </td>
                                    <td
                                        style={{
                                            padding: '12px',
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {new Date(call.startTime).toLocaleString()}
                                    </td>
                                </tr>
                            ))
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
                                    No calls available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CallTable;
