const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const pool = require('./db.js');
const saltRound = 10;

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

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

app.post('/reg', async (req, res) => {
    try {
        const { name , email, password } = req.body;
        const existingUser = await getUserByEmail(email); 

        if(await isNameExists(name)) { return res.status(400).json({ message: "Name has been already taken" }) }
        if(existingUser) { return res.status(400).json({ message: "Account with this email already exists" }) }
        if(password.length < 6) { return res.status(400).json({ message: 'The password must contain at least 6 characters' }) }

        const hashedPassword = await hashPassword(password);
        
        await pool.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
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
        
        if(!existingUser) { return res.status(404).json({ message: 'Incorect login' }) }
        if(!await comparePassword(password, email)) { return res.status(400).json({ message: 'Incorect password' }) }

        res.status(200).json({ message: 'Successfully logined' })
    } catch(err) {
        console.error(`Error: ${err.message}`);
        res.status(500).json({ error: 'DB error' });
    }
})

app.listen(PORT, () => {
    console.log(`Server started: http://localhost:${PORT}`);
})