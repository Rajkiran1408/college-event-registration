const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// CORS — allow your frontend origin(s)
const allowedOrigins = [
    'http://localhost:5173',         // Vite dev server default
    'http://localhost:5174',         // Vite dev server fallback port
    'http://localhost:3000',         // alternative local dev
    process.env.FRONTEND_URL,        // production frontend URL (set in .env)
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
    console.error("❌ Error: Missing Supabase credentials!");
    console.error("Please create a .env file in the backend directory with SUPABASE_URL and SUPABASE_ANON_KEY.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- API Routes ---

// Get all events
app.get('/api/events', async (req, res) => {
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

// --- Static Frontend Serving (for Production) ---

// Serve static files from the frontend build folder
const frontendBuildPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendBuildPath));

// Catch-all route to serve the frontend index.html for any non-API routes
app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
