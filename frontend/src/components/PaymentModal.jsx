import { useState } from 'react';
import { CreditCard, Lock, AlertCircle, CheckCircle } from 'lucide-react';

export default function PaymentModal({ amount, onCancel, onSuccess }) {
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [cardData, setCardData] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: ''
    });

    const handleChange = (e) => {
        let { name, value } = e.target;

        // Simple formatting
        if (name === 'number') {
            value = value.replace(/\D/g, '').substring(0, 16);
            value = value.replace(/(.{4})/g, '$1 ').trim();
        } else if (name === 'expiry') {
            value = value.replace(/\D/g, '').substring(0, 4);
            if (value.length >= 2) value = value.substring(0, 2) + '/' + value.substring(2);
        } else if (name === 'cvc') {
            value = value.replace(/\D/g, '').substring(0, 3);
        }

        setCardData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setProcessing(true);

        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Basic "Validation" simulation
            if (cardData.number.replace(/\s/g, '').length !== 16) {
                throw new Error("Invalid card number");
            }

            onSuccess(Math.random().toString(36).substring(7).toUpperCase());
        } catch (err) {
            setError(err.message || "Payment failed. Please try again.");
            setProcessing(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }} className="fade-in">
            <div className="card" style={{ width: '100%', maxWidth: '450px', position: 'relative' }}>
                <button
                    type="button"
                    onClick={onCancel}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '1.5rem', background: 'none', color: 'var(--color-text-soft)' }}
                >
                    &times;
                </button>

                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ width: '50px', height: '50px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <Lock className="text-primary" style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Secure Payment</h2>
                    <p style={{ color: 'var(--color-text-soft)' }}>Amount to pay: <b>${amount.toFixed(2)}</b></p>
                </div>

                {error && (
                    <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', color: 'var(--color-error)', borderRadius: 'var(--radius)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Card Number</label>
                        <div style={{ position: 'relative' }}>
                            <CreditCard size={20} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--color-text-soft)' }} />
                            <input
                                type="text"
                                name="number"
                                className="form-input"
                                style={{ paddingLeft: '2.5rem' }}
                                placeholder="0000 0000 0000 0000"
                                value={cardData.number}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Expiry Date</label>
                            <input
                                type="text"
                                name="expiry"
                                className="form-input"
                                placeholder="MM/YY"
                                value={cardData.expiry}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">CVC</label>
                            <input
                                type="text"
                                name="cvc"
                                className="form-input"
                                placeholder="123"
                                value={cardData.cvc}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Cardholder Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-input"
                            placeholder="Name on card"
                            value={cardData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem' }}
                        disabled={processing}
                    >
                        {processing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--color-text-soft)' }}>
                        <Lock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        Your payment info is encrypted and secure.
                    </div>
                </form>
            </div>
        </div>
    );
}
