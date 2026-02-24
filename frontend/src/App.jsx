import { useState, useEffect } from 'react';
import EventCard from './components/EventCard';
import RegistrationForm from './components/RegistrationForm';
import PaymentModal from './components/PaymentModal';
import Confirmation from './components/Confirmation';
import { Ticket, Loader2 } from 'lucide-react';

// API Configuration
const API_URL = 'http://localhost:5000/api';

function App() {
  const [view, setView] = useState('list'); // list, register, confirmation, tickets
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('tickets');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  }, [tickets]);

  async function fetchEvents() {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/events`);

      if (!response.ok) {
        throw new Error('Failed to fetch events from backend');
      }

      const data = await response.json();
      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Ensure backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  }

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setView('register');
    window.scrollTo(0, 0);
  };

  const handleBackToEvents = () => {
    setSelectedEvent(null);
    setView('list');
    setFormData(null);
    window.scrollTo(0, 0);
  };

  const handleRegistrationSubmit = (data) => {
    setFormData(data);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (id) => {
    setPaymentId(id);

    // Save to Backend
    let dbRegistration = null;
    try {
      const response = await fetch(`${API_URL}/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: selectedEvent.id,
          full_name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          student_id: formData.studentId,
          department: formData.department,
          year: formData.year,
          payment_id: id,
          amount: selectedEvent.price
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed on backend');
      }

      dbRegistration = await response.json();

    } catch (err) {
      console.error('Unexpected error saving registration:', err);
      // Still show success to user as payment went through, but log error
    }

    const newTicket = {
      id: id,
      event: selectedEvent,
      registration: formData,
      date: new Date().toISOString(),
      dbId: dbRegistration?.id
    };

    setTickets(prev => [newTicket, ...prev]);
    setShowPayment(false);
    setView('confirmation');
    window.scrollTo(0, 0);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  const handleHome = () => {
    setView('list');
    setSelectedEvent(null);
    setFormData(null);
    setPaymentId(null);
    window.scrollTo(0, 0);
  };

  const handleMyTickets = () => {
    setView('tickets');
    setSelectedEvent(null);
    setFormData(null);
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '3rem' }}>
      <header style={{
        background: 'rgba(2, 6, 23, 0.8)', // Dark background
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        marginBottom: '2rem'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 className="title" style={{ fontSize: '1.5rem', marginBottom: 0, cursor: 'pointer' }} onClick={handleHome}>
            UniEvents
          </h1>
          <nav>
            <button className="btn btn-secondary" style={{ border: 'none', background: 'transparent' }} onClick={handleHome}>Home</button>
            <button className="btn btn-secondary" style={{ border: 'none', background: 'transparent' }} onClick={handleMyTickets}>My Tickets</button>
          </nav>
        </div>
      </header>

      <main className="container">
        {view === 'list' && (
          <div className="fade-in">
            <div style={{ textAlign: 'center', margin: '2rem 0 3rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.025em' }}>
                Discover Upcoming <span style={{ color: 'var(--color-primary)' }}>College Events</span>
              </h2>
              <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--color-text-soft)', fontSize: '1.125rem' }}>
                Browse and register for the latest academic, cultural, and recreational events on campus.
              </p>
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                <Loader2 className="animate-spin" size={48} color="var(--color-primary)" />
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'red' }}>
                <p>{error}</p>
                <p style={{ fontSize: '0.875rem', marginTop: '1rem', color: 'var(--color-text-soft)' }}>
                  (Make sure the backend is running and valid credentials are in .env)
                </p>
              </div>
            ) : events.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem' }}>
                <p>No events found.</p>
              </div>
            ) : (
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {events.map(event => (
                  <EventCard key={event.id} event={event} onSelect={handleEventSelect} />
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'register' && selectedEvent && (
          <RegistrationForm
            event={selectedEvent}
            onBack={handleBackToEvents}
            onSubmit={handleRegistrationSubmit}
          />
        )}

        {view === 'confirmation' && selectedEvent && formData && (
          <Confirmation
            event={selectedEvent}
            registrationData={formData}
            paymentId={paymentId}
            onHome={handleHome}
          />
        )}

        {view === 'tickets' && (
          <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>My Tickets</h2>

            {tickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--color-surface)', borderRadius: 'var(--radius)', border: '1px dashed var(--color-border)' }}>
                <p style={{ color: 'var(--color-text-soft)', marginBottom: '1rem' }}>You haven't purchased any tickets yet.</p>
                <button className="btn btn-primary" onClick={handleHome}>Browse Events</button>
              </div>
            ) : (
              <div className="grid">
                {tickets.map(ticket => (
                  <div key={ticket.id} className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: 'var(--color-primary)',
                      borderRadius: 'var(--radius)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      flexShrink: 0
                    }}>
                      <Ticket size={32} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.25rem' }}>{ticket.event.title}</h3>
                      <p style={{ color: 'var(--color-text-soft)', fontSize: '0.875rem' }}>
                        {new Date(ticket.event.date).toLocaleDateString()} • {ticket.event.time}
                      </p>
                      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
                        <span style={{ background: '#eff6ff', padding: '2px 8px', borderRadius: '999px', color: 'var(--color-primary)' }}>
                          Attendee: {ticket.registration.firstName}
                        </span>
                        <span style={{ color: 'var(--color-text-soft)' }}>ID: {ticket.id}</span>
                        {ticket.dbId && <span style={{ color: 'green', marginLeft: 'auto' }}>✓ Synced</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {showPayment && selectedEvent && (
        <PaymentModal
          amount={selectedEvent.price}
          onCancel={handlePaymentCancel}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

export default App;
