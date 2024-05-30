const express = require('express');
const axios = require('axios');

const app = express();
const port =  9876;
const WINDOW_SIZE = 10;
const TIMEOUT = 500;

let window = [];


const checkAuthToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (token !== 'your-authorization-token') {
        return res.status(401).send('Unauthorized');
    }
    next();
};

app.use(express.json());
app.use(checkAuthToken);


const calculateAverage = (numbers) => {
    if (numbers.length === 0) return 0.0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
};


const numberTypeUrls = {
    'p': 'http://20.244.56.144/test/primes',
    'f': 'http://20.244.56.144/test/fibonacci',
    'e': 'http://20.244.56.144/test/even',
    'r': 'http://20.244.56.144/test/random'
};


app.post('/numbers/:id', async (req, res) => {
    const { id } = req.params;

    if (!numberTypeUrls[id]) {
        return res.status(400).send('Invalid number ID');
    }

   
    try {
        const response = await axios.get(numberTypeUrls[id], { timeout: TIMEOUT });
        const numbers = response.data.numbers.filter(num => !window.includes(num));

        // Update window
        const windowPrevState = [...window];
        window = [...window, ...numbers].slice(-WINDOW_SIZE);

        
        const avg = calculateAverage(window);

        res.json({
            windowPrevState,
            windowCurrState: window,
            numbers,
            avg
        });
    } catch (error) {
        res.status(500).send('Error fetching numbers');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port : ${port}`);
});