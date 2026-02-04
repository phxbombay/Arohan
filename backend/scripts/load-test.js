import autocannon from 'autocannon';

const instance = autocannon({
    url: 'http://localhost:5000',
    connections: 100, // default
    pipelining: 1, // default
    duration: 10, // default
    workers: 4,
    requests: [
        {
            method: 'GET',
            path: '/health',
        },
        {
            method: 'GET',
            path: '/v1/blog/public' // Testing a public endpoint
        }
    ],
}, console.log);

// this is used to kill the instance on CTRL-C
process.once('SIGINT', () => {
    instance.stop();
});

autocannon.track(instance, { renderProgressBar: true });
