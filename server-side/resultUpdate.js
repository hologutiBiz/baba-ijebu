
const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
const secret = 'e7bc73e68687b432fe3263217cdcbc9ad98ed29f';

app.use(bodyParser.json());


function verifySignature(req, res, next) {
    const signature = req.headers['x-hub-signature-256'];
    const payload = JSON.stringify(req.body);
    const hmac = crypto.createHmac('sha256', secret);
    const digest = 'sha256' + hmac.update(payload).digest('hex');

    if (signature === digest) {
        next();

    } else {
        res.status(401).send('Unauthorized');
    }
}


app.post('/webhook', verifySignature, (req, res) => {
    const payload = req.body;
    const updateType = payload.update_type;

    const message = updateType === 'result' ? 'Incoming result. New result updated' : 'Update available. Please refresh the page';
    const options = {
        method: 'POST', 
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({message})
    };

    fetch('https://vlb.hologutibusinesscentre.com/', options)
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    
    res.status(200).send('webhook received');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

