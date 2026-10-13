const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    // Vercel ba cloud hosting er jonno x-forwarded-for header theke IP ana
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    let clientIp = rawIp ? rawIp.split(',')[0].trim() : '127.0.0.1';
    
    // Localhost test korle IP fix korar jonno
    if (clientIp === '::1' || clientIp === '127.0.0.1') {
        clientIp = '103.102.27.0'; // Example IP ba nijer moto rakhte paren
    }

    let country = 'Unknown';

    try {
        const response = await fetch(`http://ip-api.com/json/${clientIp}`);
        const data = await response.json();
        
        if (data.status === 'success') {
            country = data.country;
        }
    } catch (error) {
        console.error('Error fetching country:', error);
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>IP & Country Finder</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; margin-top: 100px; background-color: #f4f4f9; }
                .card { background: white; padding: 30px; border-radius: 10px; display: inline-block; box-shadow: 0px 0px 10px rgba(0,0,0,0.1); }
                h2 { color: #333; }
                p { font-size: 18px; color: #555; }
            </style>
        </head>
        <body>
            <div class="card">
                <h2>Your Network Info</h2>
                <p><strong>Your IP:</strong> ${clientIp}</p>
                <p><strong>Your Country:</strong> ${country}</p>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
