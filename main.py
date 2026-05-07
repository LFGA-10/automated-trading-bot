import subprocess
import sys
import os

def start_backend():
    print("Starting Backend...")
    return subprocess.Popen([sys.executable, "backend/main.py"])

def start_frontend():
    print("Starting Frontend...")
    # Using npm run dev assumes dependencies are installed
    return subprocess.Popen(["npm", "run", "dev"], cwd="frontend", shell=True)

if __name__ == "__main__":
    backend_proc = start_backend()
    frontend_proc = start_frontend()
    
    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        backend_proc.terminate()
        frontend_proc.terminate()
        print("Shutting down...")
