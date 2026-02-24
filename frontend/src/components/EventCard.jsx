import { Calendar, Clock, MapPin, Users } from 'lucide-react';

export default function EventCard({ event, onSelect }) {
    return (
        <div className="card fade-in">
            <img
                src={event.image}
                alt={event.title}
                className="event-image"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000';
                }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span className="badge">{event.category}</span>
                <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>${event.price}</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{event.title}</h3>
            <p style={{ color: 'var(--color-text-soft)', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: '1.4' }}>
                {event.description}
            </p>

            <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-soft)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} />
                    {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} />
                    {event.time}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} />
                    {event.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={16} />
                    {event.capacity} spots available
                </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => onSelect(event)}>
                Register Now
            </button>
        </div>
    );
}
