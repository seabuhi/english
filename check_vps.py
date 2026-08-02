import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')

VPS_IP = '217.154.185.63'
VPS_USER = 'root'
VPS_PASS = 'D7C3lymDEQBcaKt'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(VPS_IP, username=VPS_USER, password=VPS_PASS, timeout=15)

def check_cmd(cmd):
    print(f"=== {cmd} ===")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='ignore')
    print(out[:500])

check_cmd("curl -s -H 'Host: savelya.co' http://127.0.0.1:80 | head -n 20")
check_cmd("curl -sk -H 'Host: savelya.co' https://127.0.0.1:443 | head -n 20")

ssh.close()
