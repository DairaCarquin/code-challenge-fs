'use client';

import { useEffect, useState } from 'react';
import { FaPhone } from 'react-icons/fa';
import CallTable from './components/CallTable';
import EventHistory from './components/EventHistory';
import socket from './utils/socket';
import { Box, Tabs, Tab } from '@mui/material';

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
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        console.log('Conectando al socket...');

        const fetchInitialCalls = async () => {
            const res = await fetch('/api/calls');
            const data = await res.json();
            setCalls(data);
        };

        fetchInitialCalls();
        socket.on('new-event', ({ type, data }) => {
            console.log('📡 new-event received:', type, data);
            if (type === 'call-created') {
                setCalls(prev => [data, ...prev]);
            }
        });

        socket.on('call-updated', (updatedCall: Call) => {
            console.log('call-updated received:', updatedCall);
            fetchFilteredCalls(); 
            setCalls(prev => {
                const index = prev.findIndex(call => call.id === updatedCall.id);
                if (index !== -1) {
                    const updated = [...prev];
                    updated[index] = updatedCall;
                    return updated;
                } else {
                    return [updatedCall, ...prev];
                }
            });
        });

        return () => {
            socket.off('call-created');
            socket.off('call-updated');
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

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="tabs example">
                    <Tab label="Calls" />
                    <Tab label="Event History" />
                </Tabs>
            </Box>

            {value === 0 && (
                <div style={{ marginBottom: '40px' }}>
                    <div
                        style={{
                            margin: '24px 0 0 24px',
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

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
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

                    <CallTable calls={calls} />
                </div>
            )}


            {value === 1 && (
                <div>
                    <EventHistory />
                </div>
            )}
        </main>
    );
};

export default Home;
