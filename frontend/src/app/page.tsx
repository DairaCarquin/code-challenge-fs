'use client';

import { useEffect, useState } from 'react';
import { FaPhone } from 'react-icons/fa';
import CallTable from './components/CallTable';
import EventHistory from './components/EventHistory';
import socket from './utils/socket';

interface Call {
    id: string;
    status: string;
    queueId: string;
    startTime: string;
}

const Home: React.FC = () => {
    const [filterStatus, setFilterStatus] = useState('');
    const [filterQueue, setFilterQueue] = useState('');
    const [calls, setCalls] = useState<Call[]>([]);

    useEffect(() => {
        const fetchInitialCalls = async () => {
            const res = await fetch('/api/calls');
            const data = await res.json();
            setCalls(data);
        };

        fetchInitialCalls();

        socket.on('call_updated', (updatedCall: Call) => {
            setCalls((prev) =>
                prev.map((call) => (call.id === updatedCall.id ? updatedCall : call))
            );
        });

        return () => {
            socket.off('call_updated');
        };
    }, []);

    const fetchFilteredCalls = async () => {
        const params = new URLSearchParams();
        if (filterStatus) params.append('status', filterStatus);
        if (filterQueue) params.append('queue_id', filterQueue);

        const res = await fetch(`/api/calls?${params.toString()}`);
        const data = await res.json();
        setCalls(data);
    };

    return (
        <main
            style={{
                minHeight: '100vh',
                padding: '24px',
            }}
        >
            <header style={{ marginBottom: '32px', textAlign: 'left' }}>
                <h1
                    style={{
                        fontSize: '2.25rem',
                        fontWeight: 800,
                        color: '#1f2937',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '8px',
                        flexWrap: 'wrap',
                    }}
                >
                    <FaPhone />
                    Call Center Dashboard
                </h1>
            </header>

            <div
                style={{
                    marginBottom: '24px',
                    display: 'flex',
                    gap: '64px',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'flex-start',
                    }}
                >
                    <input
                        type="text"
                        placeholder="Filter by Status"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{
                            padding: '8px 16px',
                            width: '100%',
                            maxWidth: '256px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            outline: 'none',
                        }}
                        onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px #3b82f6')}
                        onBlur={(e) => (e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)')}
                    />
                    <input
                        type="text"
                        placeholder="Filter by Queue"
                        value={filterQueue}
                        onChange={(e) => setFilterQueue(e.target.value)}
                        style={{
                            padding: '8px 16px',
                            width: '100%',
                            maxWidth: '256px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            outline: 'none',
                        }}
                        onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px #3b82f6')}
                        onBlur={(e) => (e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)')}
                    />
                </div>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <button
                        onClick={fetchFilteredCalls}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
                    >
                        Search
                    </button>
                </div>
            </div>

            <section style={{ marginBottom: '40px' }}>
                <CallTable calls={calls} />
            </section>

            <section>
                <EventHistory />
            </section>
        </main>
    );
};

export default Home;
