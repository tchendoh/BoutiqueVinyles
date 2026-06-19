const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { pool } = require('../db/mysql')

// POST /auth/register
router.post('/register', async (req, res) => {

    try {
        const {firstName, lastName, email, password} = req.body;

        const saltRounds = 11;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const query = 'INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)'

        const [result] = await pool.execute(query, [firstName, lastName, email, hashedPassword])
        const userId = result.insertId

        req.session.userId = userId
        req.session.firstName = firstName

        res.status(201).json({message : "Utilisateur inscrit avec succès (sécurisé)"})

    } catch (error) {
        console.log(error);
        res.status(500).json({erreur : "Serveur en erreur"})
    }

})

// POST /auth/login
router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        const query = 'SELECT id, first_name, password_hash FROM users WHERE email = ?'

        const [result] = await pool.execute(query, [email])
        
        if (result.length > 0) {
            if (await bcrypt.compare(password, result[0].password_hash)) {
                req.session.userId = result[0].id
                req.session.firstName = result[0].first_name
                return res.status(200).json({message : "Utilisateur logué avec succès (sécurisé)"})
            }
        }
        res.status(401).json({message : "Non autorisé."})
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({erreur : "Serveur en erreur"})
    }
})

// POST /auth/logout
router.post('/logout', (req, res) => {
    req.session.destroy()
    res.status(200).json({message : "Déconnexion réussie"})
})

// GET /auth/me
router.get('/me', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Non connecté' })
    }
    res.json({ 
        'userId' : req.session.userId,
        'firstName' : req.session.firstName
     })
})

module.exports = router
