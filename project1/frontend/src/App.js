import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [numberId, setNumberId] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState('');

    const fetchNumbers = async () => {
        try {
            setError('');
            const res = await axios.post('http://localhost:9876/numbers/${numberId}', {}, {
                headers: {
                    'Authorization': ''
                }
            });
            setResponse(res.data);
        } catch (err) {
            setError('Error fetching numbers');
        }
    };

    return (
        <div>
            <h1>Average Calculator</h1>
            <input 
                type="text"
                value={numberId}
                onChange={(e) => setNumberId(e.target.value)}
                placeholder="Enter number ID (p, f, e, r)"
            />
            <button onClick={fetchNumbers}>Fetch Numbers</button>
            {error && <p>{error}</p>}
            {response && (
                <div>
                    <h2>Previous State:</h2>
                    <pre>{JSON.stringify(response.windowPrevState, null, 2)}</pre>
                    <h2>Current State:</h2>
                    <pre>{JSON.stringify(response.windowCurrState, null, 2)}</pre>
                    <h2>Fetched Numbers:</h2>
                    <pre>{JSON.stringify(response.numbers, null, 2)}</pre>
                    <h2>Average:</h2>
                    <pre>{response.avg}</pre>
                </div>
            )}
        </div>
    );
};

export default App;