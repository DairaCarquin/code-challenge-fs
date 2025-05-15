'use client';

import { useEffect, useRef, useState } from 'react';
import { FaPhone } from 'react-icons/fa';
import CallTable from './components/CallTable';
import EventHistory from './components/EventHistory';
import socket from './utils/socket';
import { Box, Tabs, Tab, debounce } from '@mui/material';

interface Call {
    id: string;
    status: string;
    queueId: string;
    startTime: string;
}

const Home: React.FC = () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const [filterStatus, setFilterStatus] = useState('');
    const [filterQueue, setFilterQueue] = useState('');
    const [calls, setCalls] = useState<Call[]>([]);
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const fetchFilteredCalls = async (status = filterStatus, queue = filterQueue) => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (queue) params.append('queue_id', queue);

        const res = await fetch(`${API_BASE_URL}/api/calls?${params.toString()}`, {
            headers: {
                'x-api-key': 'supersecretkey',
            },
        });
        const data = await res.json();
        setCalls(data);
    };

    const debouncedFetch = useRef(
        debounce(() => {
            fetchFilteredCalls();
        }, 1500)
    );

    useEffect(() => {
        console.log('Conectando al socket...');

        fetchFilteredCalls();

        socket.on('new-event', () => debouncedFetch.current());
        socket.on('call-updated', () => debouncedFetch.current());

        return () => {
            socket.off('new-event');
            socket.off('call-updated');
        };
    }, []);

    useEffect(() => {
        debouncedFetch.current();
    }, [filterStatus, filterQueue]);

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
                            <select
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
                                    backgroundColor: 'white',
                                    color: '#374151',
                                    fontSize: '14px',
                                }}
                                onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px #3b82f6')}
                                onBlur={(e) => (e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)')}
                            >
                                <option value="">All Statuses</option>
                                <option value="waiting">Waiting</option>
                                <option value="active">Active</option>
                                <option value="answered">Answered</option>
                                <option value="on_hold">On Hold</option>
                                <option value="ended">Ended</option>
                            </select>
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
                                onClick={() => fetchFilteredCalls()}
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
