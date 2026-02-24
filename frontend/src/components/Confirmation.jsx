import { CheckCircle, Calendar, MapPin, Download } from 'lucide-react';

export default function Confirmation({ event, registrationData, paymentId, onHome }) {
    return (
        <div className="card fade-in" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <CheckCircle size={64} style={{ color: 'var(--color-success)', margin: '0 auto' }} />
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Registration Confirmed!</h2>
            <p style={{ color: 'var(--color-text-soft)', marginBottom: '2rem' }}>
                Thank you, {registrationData.firstName}. You are now registered for this event.
            </p>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--color-border)', padding: '1.5rem', borderRadius: 'var(--radius)', textAlign: 'left', marginBottom: '2rem' }}>
                <h3 style={{ fontWeight: '600', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Ticket Details</h3>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-soft)', textTransform: 'uppercase' }}>Event</span>
                        <span style={{ fontWeight: '500' }}>{event.title}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-soft)', textTransform: 'uppercase' }}>Date</span>
                            <span style={{ fontWeight: '500' }}>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-soft)', textTransform: 'uppercase' }}>Time</span>
                            <span style={{ fontWeight: '500' }}>{event.time}</span>
                        </div>
                    </div>

                    <div>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-soft)', textTransform: 'uppercase' }}>Location</span>
                        <span style={{ fontWeight: '500' }}>{event.location}</span>
                    </div>

                    <div>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-soft)', textTransform: 'uppercase' }}>Transaction ID</span>
                        <span style={{ fontFamily: 'monospace', background: 'rgba(255, 255, 255, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>{paymentId}</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={() => window.print()}>
                    <Download size={18} /> Download Ticket
                </button>
                <button className="btn btn-secondary" onClick={onHome}>
                    Browse More Events
                </button>
            </div>
        </div>
    );
}
