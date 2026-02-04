import axios from 'axios';

const runPerfTest = async () => {
    // Inside container, localhost:5000 is correct for the app itself if listening on 0.0.0.0
    // But better to use http://localhost:5000 since we are inside the container node context
    const URL = 'http://localhost:5000/health';
    const REQUESTS = 100;
    const latencies = [];

    console.log(`🚀 Starting Performance Test: ${REQUESTS} requests to ${URL}...`);

    const startTotal = Date.now();

    for (let i = 0; i < REQUESTS; i++) {
        const start = Date.now();
        try {
            await axios.get(URL);
            const duration = Date.now() - start;
            latencies.push(duration);
            process.stdout.write('.');
        } catch (err) {
            process.stdout.write('x');
            if (i === 0) console.error('\nFirst Error:', err.message);
        }
    }

    const endTotal = Date.now();
    const totalTime = (endTotal - startTotal) / 1000;

    console.log('\n\n📊 Results:');
    if (latencies.length === 0) {
        console.log('No successful requests.');
        return;
    }

    const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    const min = Math.min(...latencies);
    const max = Math.max(...latencies);

    console.log(`Total Time: ${totalTime.toFixed(2)}s`);
    console.log(`Avg Latency: ${avg.toFixed(2)}ms`);
    console.log(`Min Latency: ${min}ms`);
    console.log(`Max Latency: ${max}ms`);
    console.log(`Requests/Sec: ${(REQUESTS / totalTime).toFixed(2)}`);
};

runPerfTest();
