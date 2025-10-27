#!/usr/bin/env python3
"""
Google Calendar Clone - Development Server Startup Script

This script starts both the backend (Express.js) and frontend (React) servers
with proper process management and graceful shutdown handling.

Usage:
    python start-dev.py
    python3 start-dev.py

Requirements:
    - Python 3.6+
    - Node.js 18+
    - npm 8+
"""

import subprocess
import os
import sys
import time
import signal
import threading
from pathlib import Path

# ANSI color codes for terminal output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

class DevServer:
    def __init__(self):
        self.backend_process = None
        self.frontend_process = None
        self.project_root = Path(__file__).parent
        self.backend_dir = self.project_root / "backend"
        self.frontend_dir = self.project_root / "frontend"
        
    def print_colored(self, message, color=Colors.ENDC):
        """Print colored message to terminal"""
        print(f"{color}{message}{Colors.ENDC}")
        
    def print_header(self):
        """Print startup header"""
        self.print_colored("=" * 60, Colors.HEADER)
        self.print_colored("🚀 Google Calendar Clone - Development Server", Colors.HEADER + Colors.BOLD)
        self.print_colored("=" * 60, Colors.HEADER)
        
    def check_directories(self):
        """Check if required directories exist"""
        self.print_colored("📁 Checking project structure...", Colors.OKCYAN)
        
        if not self.backend_dir.exists():
            self.print_colored(f"❌ Backend directory not found: {self.backend_dir}", Colors.FAIL)
            return False
            
        if not self.frontend_dir.exists():
            self.print_colored(f"❌ Frontend directory not found: {self.frontend_dir}", Colors.FAIL)
            return False
            
        if not (self.backend_dir / "package.json").exists():
            self.print_colored("❌ Backend package.json not found", Colors.FAIL)
            return False
            
        if not (self.frontend_dir / "package.json").exists():
            self.print_colored("❌ Frontend package.json not found", Colors.FAIL)
            return False
            
        self.print_colored("✅ Project structure verified", Colors.OKGREEN)
        return True
        
    def check_dependencies(self):
        """Check if node_modules exist"""
        self.print_colored("📦 Checking dependencies...", Colors.OKCYAN)
        
        backend_modules = self.backend_dir / "node_modules"
        frontend_modules = self.frontend_dir / "node_modules"
        
        missing_deps = []
        
        if not backend_modules.exists():
            missing_deps.append("backend")
            
        if not frontend_modules.exists():
            missing_deps.append("frontend")
            
        if missing_deps:
            self.print_colored(f"⚠️  Missing dependencies in: {', '.join(missing_deps)}", Colors.WARNING)
            self.print_colored("💡 Run the following commands to install dependencies:", Colors.WARNING)
            for dep in missing_deps:
                self.print_colored(f"   cd {dep} && npm install", Colors.WARNING)
            
            response = input(f"{Colors.WARNING}Continue anyway? (y/N): {Colors.ENDC}")
            if response.lower() != 'y':
                return False
        else:
            self.print_colored("✅ Dependencies verified", Colors.OKGREEN)
            
        return True
        
    def start_backend(self):
        """Start the backend server"""
        self.print_colored("🔧 Starting backend server (port 9999)...", Colors.OKBLUE)
        
        try:
            # Set environment variables for backend
            env = os.environ.copy()
            env['PORT'] = '9999'
            env['NODE_ENV'] = 'development'
            
            self.backend_process = subprocess.Popen(
                ['npm', 'run', 'dev'],
                cwd=self.backend_dir,
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                universal_newlines=True,
                bufsize=1
            )
            
            # Start thread to handle backend output
            backend_thread = threading.Thread(
                target=self._handle_process_output,
                args=(self.backend_process, "BACKEND", Colors.OKBLUE)
            )
            backend_thread.daemon = True
            backend_thread.start()
            
            # Give backend time to start
            time.sleep(3)
            
            if self.backend_process.poll() is None:
                self.print_colored("✅ Backend server started successfully", Colors.OKGREEN)
                return True
            else:
                self.print_colored("❌ Backend server failed to start", Colors.FAIL)
                return False
                
        except Exception as e:
            self.print_colored(f"❌ Error starting backend: {e}", Colors.FAIL)
            return False
            
    def start_frontend(self):
        """Start the frontend server"""
        self.print_colored("🎨 Starting frontend server (port 3000)...", Colors.OKCYAN)
        
        try:
            # Set environment variables for frontend
            env = os.environ.copy()
            env['VITE_API_BASE_URL'] = 'http://localhost:9999/api/v1'
            
            self.frontend_process = subprocess.Popen(
                ['npm', 'run', 'dev'],
                cwd=self.frontend_dir,
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                universal_newlines=True,
                bufsize=1
            )
            
            # Start thread to handle frontend output
            frontend_thread = threading.Thread(
                target=self._handle_process_output,
                args=(self.frontend_process, "FRONTEND", Colors.OKCYAN)
            )
            frontend_thread.daemon = True
            frontend_thread.start()
            
            # Give frontend time to start
            time.sleep(5)
            
            if self.frontend_process.poll() is None:
                self.print_colored("✅ Frontend server started successfully", Colors.OKGREEN)
                return True
            else:
                self.print_colored("❌ Frontend server failed to start", Colors.FAIL)
                return False
                
        except Exception as e:
            self.print_colored(f"❌ Error starting frontend: {e}", Colors.FAIL)
            return False
            
    def _handle_process_output(self, process, name, color):
        """Handle output from subprocess"""
        try:
            for line in iter(process.stdout.readline, ''):
                if line.strip():
                    # Filter out some verbose output
                    if any(skip in line.lower() for skip in ['webpack', 'compiled successfully', 'hot update']):
                        continue
                    self.print_colored(f"[{name}] {line.strip()}", color)
        except Exception:
            pass
            
    def print_status(self):
        """Print server status and URLs"""
        self.print_colored("\n" + "=" * 60, Colors.OKGREEN)
        self.print_colored("🎉 Development servers are running!", Colors.OKGREEN + Colors.BOLD)
        self.print_colored("=" * 60, Colors.OKGREEN)
        self.print_colored("📱 Frontend:  http://localhost:3000", Colors.OKGREEN)
        self.print_colored("🔧 Backend:   http://localhost:9999", Colors.OKGREEN)
        self.print_colored("🏥 Health:    http://localhost:9999/health", Colors.OKGREEN)
        self.print_colored("📚 API Docs:  http://localhost:9999/api/v1", Colors.OKGREEN)
        self.print_colored("=" * 60, Colors.OKGREEN)
        self.print_colored("💡 Press Ctrl+C to stop both servers", Colors.WARNING)
        self.print_colored("=" * 60, Colors.OKGREEN)
        
    def setup_signal_handlers(self):
        """Setup signal handlers for graceful shutdown"""
        def signal_handler(signum, frame):
            self.print_colored("\n🛑 Shutting down servers...", Colors.WARNING)
            self.cleanup()
            sys.exit(0)
            
        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)
        
    def cleanup(self):
        """Clean up processes"""
        if self.backend_process:
            self.print_colored("🔧 Stopping backend server...", Colors.WARNING)
            self.backend_process.terminate()
            try:
                self.backend_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.backend_process.kill()
                
        if self.frontend_process:
            self.print_colored("🎨 Stopping frontend server...", Colors.WARNING)
            self.frontend_process.terminate()
            try:
                self.frontend_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.frontend_process.kill()
                
        self.print_colored("✅ Cleanup completed", Colors.OKGREEN)
        
    def run(self):
        """Main run method"""
        try:
            self.print_header()
            
            # Setup signal handlers
            self.setup_signal_handlers()
            
            # Check project structure
            if not self.check_directories():
                sys.exit(1)
                
            # Check dependencies
            if not self.check_dependencies():
                sys.exit(1)
                
            # Start backend
            if not self.start_backend():
                sys.exit(1)
                
            # Start frontend
            if not self.start_frontend():
                self.cleanup()
                sys.exit(1)
                
            # Print status
            self.print_status()
            
            # Keep the script running
            try:
                while True:
                    time.sleep(1)
                    # Check if processes are still running
                    if self.backend_process.poll() is not None:
                        self.print_colored("❌ Backend process died", Colors.FAIL)
                        break
                    if self.frontend_process.poll() is not None:
                        self.print_colored("❌ Frontend process died", Colors.FAIL)
                        break
            except KeyboardInterrupt:
                pass
                
        except Exception as e:
            self.print_colored(f"❌ Unexpected error: {e}", Colors.FAIL)
        finally:
            self.cleanup()

def main():
    """Main entry point"""
    # Check Python version
    if sys.version_info < (3, 6):
        print(f"{Colors.FAIL}❌ Python 3.6+ required. Current version: {sys.version}{Colors.ENDC}")
        sys.exit(1)
        
    # Check if Node.js is available
    try:
        subprocess.run(['node', '--version'], check=True, capture_output=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print(f"{Colors.FAIL}❌ Node.js not found. Please install Node.js 18+{Colors.ENDC}")
        sys.exit(1)
        
    # Check if npm is available
    try:
        subprocess.run(['npm', '--version'], check=True, capture_output=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print(f"{Colors.FAIL}❌ npm not found. Please install npm 8+{Colors.ENDC}")
        sys.exit(1)
        
    # Start the development server
    server = DevServer()
    server.run()

if __name__ == "__main__":
    main()
