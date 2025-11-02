const express = require('express');
const cors = require('cors');

const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')
require('dotenv').config();

const bcrypt = require('bcrypt');
const path = require('path');
const pool = require('./db.js');
const cookieParser = require('cookie-parser');
const saltRound = 10;

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

function createToken(userId) {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIREC_IN }
    )
}

function saveCookie(res, name, value) {
    res.cookie(name, value, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
    })
}

function verifyToken(req, res, next) {
    const token = req.cookies.token;
    if(!token) { return res.status(401).json({ message: 'Not authorized' }) };

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;

        next();
    } catch(err) {
        console.error(`Error: ${err.message}`);
        return res.status(401).json({ message: 'Invalid token' });
    }
}

async function preloadToken(req, res, email) {
    try {
        if(!req.cookies.token) {
            const id = await getIdByEmail(email);

            if(!id) { throw new Error('User not found') }

            const token = createToken(id);
            saveCookie(res, 'token', token);
        }
    } catch(err) {
        console.error(err)
        return res.status(500).json({ message: 'Token error' });
    }
}

async function getIdByEmail(email) {
    try {
        const sql = 'SELECT id FROM users WHERE email = ?';
        const [ rows ] = await pool.execute(sql, [ email ]);

        if(rows.length <= 0) { return null };

        return rows[0].id;
    } catch(err) {
        console.error(err);
        throw err;
    }
}

async function hashPassword(password) {
    try {
        const hash = await bcrypt.hash(password, saltRound);
        return hash;
    } catch(err) {
        console.error(`Error: ${err.message}`);
        throw err;
    }
}

async function getUserByEmail(email) {
    const [ rows ] = await pool.execute('SELECT * FROM users WHERE email = ?', [ email ]);
    return rows[0]
}

async function isNameExists(name) {
    const [ rows ] = await pool.execute('SELECT * FROM users WHERE name = ?', [ name ]);
    return rows.length > 0;
}

async function comparePassword(password, email) {
    const user = await getUserByEmail(email);
    if(!user) return false;
    const isMatch = await bcrypt.compare(password, user.password);

    return isMatch;
}

app.get('/user', verifyToken, async (req, res) => {
    try {
        const sql = 'SELECT * FROM users WHERE id = ?';

        const [ data ] = await pool.execute(sql, [ req.userId ]);

        if(data.length <= 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ user: data[0] });
    } catch(err) {
        console.error(`Error: ${err.message}`);
        res.status(500).json({ error: 'DB error' });
    }   
})

app.post('/reg', async (req, res) => {
    try {
        const { name , email, password } = req.body;
        const existingUser = await getUserByEmail(email); 

        if(await isNameExists(name)) { return res.status(400).json({ message: "Name has been already taken" }) }
        if(existingUser) { return res.status(400).json({ message: "Account with this email already exists" }) }
        if(password.length < 6) { return res.status(400).json({ message: 'The password must contain at least 6 characters' }) }

        const hashedPassword = await hashPassword(password);
        
        await pool.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

        await preloadToken(req, res, email);

        res.status(201).json({ message: 'Successfully registered' })
    } catch(err) {
        console.error(`Error: ${err.message}`);
        res.status(500).json({ error: 'DB error' });
    }
    
})

app.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;
        const existingUser = await getUserByEmail(email);
        
        if(!existingUser) { return res.status(404).json({ message: 'Incorect login' }) };
        if(!await comparePassword(password, email)) { return res.status(400).json({ message: 'Incorect password' }) };

        await preloadToken(req, res, email);

        res.status(200).json({ message: 'Successfully logged in' })
    } catch(err) {
        console.error(`Error: ${err.message}`);
        res.status(500).json({ error: 'DB error' });
    }
})

app.listen(PORT, () => {
    console.log(`Server started: http://localhost:${PORT}`);
})