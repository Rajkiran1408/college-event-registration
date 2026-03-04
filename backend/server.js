const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// CORS — allow your frontend origin(s)
const allowedOrigins = [
    'http://localhost:5173',         // Vite dev server default
    'http://localhost:5174',         // Vite dev server fallback port
    'http://localhost:3000',         // alternative local dev
    // Strip trailing slash — browsers send origins without one
    process.env.FRONTEND_URL?.replace(/\/$/, ''),
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, Postman)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS policy: origin ${origin} not allowed`));
        }
    },
    credentials: true,
}));
app.use(express.json());

// Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Error: Missing Supabase credentials in environment variables!");
    // Don't call process.exit(1) — that crashes Vercel serverless functions
}

const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

// --- API Routes ---

// Health check
app.get('/api', (req, res) => {
    res.json({ status: 'Backend is running ✅' });
});

// Get all events
app.get('/api/events', async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: 'Server misconfigured: missing Supabase credentials.' });
    }
    try {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('date', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create registration
app.post('/api/registrations', async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: 'Server misconfigured: missing Supabase credentials.' });
    }
    const { event_id, full_name, email, student_id, department, year, payment_id, amount } = req.body;

    try {
        const { data, error } = await supabase
            .from('registrations')
            .insert([
                {
                    event_id,
                    full_name,
                    email,
                    student_id,
                    department,
                    year: year.toString(),
                    payment_id,
                    amount
                }
            ])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating registration:', error);
        res.status(500).json({ error: error.message });
    }
});

// Only start the local server when NOT running on Vercel
if (process.env.VERCEL !== '1') {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

// Export for Vercel serverless
module.exports = app;

