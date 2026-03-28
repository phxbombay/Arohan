import subprocess, json
import base64
import os

env = os.environ.copy()
env['AWS_DEFAULT_REGION'] = 'ap-south-1'
res = subprocess.run(
    ["aws", "ec2", "get-console-output", "--instance-id", "i-05b8f3e917f743f8e", "--output", "json"],
    env=env,
    capture_output=True
)

if res.returncode == 0:
    data = json.loads(res.stdout)
    out_b64 = data.get('Output', '')
    decoded = base64.b64decode(out_b64).decode('utf-8', errors='replace')
    with open('console_output.txt', 'w', encoding='utf-8') as f:
        f.write(decoded)
    print("SUCCESS: Log written to console_output.txt")
else:
    print("ERROR:", res.stderr.decode('utf-8'))
