import React, { useState } from 'react';

interface Call {
    id: string;
    status: string;
    queueId: string;
    startTime: string;
}

const CallTable: React.FC<{ calls: Call[] }> = ({ calls }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const totalPages = Math.ceil(calls.length / rowsPerPage);

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = calls.slice(indexOfFirstRow, indexOfLastRow);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    return (
        <div style={{ padding: '24px' }}>
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
                        {Array.isArray(currentRows) && currentRows.length > 0 ? (
                            currentRows.map((call) => (
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

            {/* Contador de registros */}
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
                    Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, calls.length)} of {calls.length} calls
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

            {/* Paginación */}
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

export default CallTable;
