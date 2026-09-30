const fs = require('fs');
const http = require('http');
const path = require('path');

// This is your "Database" file
const DB_FILE = path.join(__dirname, 'database.json');

const server = http.createServer((req, res) => {
    // Set CORS headers so the website can talk to this server
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/save' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);

                // Read existing data
                let db = [];
                if (fs.existsSync(DB_FILE)) {
                    db = JSON.parse(fs.readFileSync(DB_FILE));
                }

                // Add new data
                db.push({
                    timestamp: new Date().toISOString(),
                    ...data
                });

                // Save back to the file
                fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Saved successfully to database.json!' }));
            } catch (e) {
                res.writeHead(400);
                res.end('Invalid data');
            }
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('🚀 Local Database Server running at http://localhost:3000');
    console.log('📝 Data will be saved to database.json in this folder');
});
