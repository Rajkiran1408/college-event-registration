import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function RegistrationForm({ event, onBack, onSubmit }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        studentId: '',
        department: '',
        year: '1'
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.studentId.trim()) newErrors.studentId = 'Student ID is required';
        if (!formData.department.trim()) newErrors.department = 'Department is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    return (
        <div className="card fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <button
                onClick={onBack}
                className="btn btn-secondary"
                style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
                <ChevronLeft size={16} /> Back to Events
            </button>

            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Register for {event.title}</h2>
                <p style={{ color: 'var(--color-text-soft)' }}>Please fill in your details to proceed to payment.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            className="form-input"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="John"
                        />
                        {errors.firstName && <div className="form-error">{errors.firstName}</div>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            className="form-input"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Doe"
                        />
                        {errors.lastName && <div className="form-error">{errors.lastName}</div>}
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        className="form-input"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john.doe@university.edu"
                    />
                    {errors.email && <div className="form-error">{errors.email}</div>}
                </div>

                <div className="form-group">
                    <label className="form-label">Student ID</label>
                    <input
                        type="text"
                        name="studentId"
                        className="form-input"
                        value={formData.studentId}
                        onChange={handleChange}
                        placeholder="12345678"
                    />
                    {errors.studentId && <div className="form-error">{errors.studentId}</div>}
                </div>

                <div className="form-group">
                    <label className="form-label">Department</label>
                    <select
                        name="department"
                        className="form-input"
                        value={formData.department}
                        onChange={handleChange}
                    >
                        <option value="">Select Department</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Business">Business</option>
                        <option value="Arts">Arts</option>
                        <option value="Science">Science</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.department && <div className="form-error">{errors.department}</div>}
                </div>

                <div className="form-group">
                    <label className="form-label">Year of Study</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {[1, 2, 3, 4].map(year => (
                            <label key={year} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="year"
                                    value={year}
                                    checked={formData.year == year}
                                    onChange={handleChange}
                                />
                                Year {year}
                            </label>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 'bold' }}>
                        <span>Total Amount</span>
                        <span>${event.price.toFixed(2)}</span>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Proceed to Payment
                    </button>
                </div>
            </form>
        </div>
    );
}
