import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('217.154.185.63', username='root', password='D7C3lymDEQBcaKt', timeout=10)

commands = [
    ('Active Ports', 'ss -tulpn'),
    ('Nginx Sites', 'ls -la /etc/nginx/sites-enabled/'),
    ('Nginx Config Content', 'cat /etc/nginx/sites-enabled/*'),
    ('PostgreSQL Databases', 'sudo -u postgres psql -l')
]

for title, cmd in commands:
    print(f'=== {title} ({cmd}) ===')
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='ignore')
    err = stderr.read().decode('utf-8', errors='ignore')
    if out:
        print(out.strip())
    if err:
        print('[STDERR]:', err.strip())
    print('-' * 60)

ssh.close()
