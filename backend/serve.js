/**
 * Development server script that runs both the FastAPI backend and Next.js frontend
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const BACKEND_PORT = process.env.BACKEND_PORT || 8000;
const FRONTEND_PORT = process.env.FRONTEND_PORT || 3000;
const BACKEND_DIR = path.join(__dirname);
const FRONTEND_DIR = path.join(__dirname, '..');

// Function to check if Python and Node are installed
function checkDependencies() {
  try {
    // Check Python version
    const pythonVersion = spawn('python', ['--version']);
    pythonVersion.on('error', (err) => {
      console.error('\x1b[31mFailed to start Python. Make sure Python is installed!\x1b[0m');
      process.exit(1);
    });

    // Check Node version
    const nodeVersion = spawn('node', ['--version']);
    nodeVersion.on('error', (err) => {
      console.error('\x1b[31mFailed to start Node.js. Make sure Node.js is installed!\x1b[0m');
      process.exit(1);
    });
  } catch (error) {
    console.error('\x1b[31mError checking dependencies:', error.message, '\x1b[0m');
    process.exit(1);
  }
}

// Function to check if requirements.txt is installed
function checkPythonDependencies() {
  try {
    const requirementsPath = path.join(BACKEND_DIR, 'requirements.txt');
    if (!fs.existsSync(requirementsPath)) {
      console.error('\x1b[31mrequirements.txt not found in backend directory!\x1b[0m');
      process.exit(1);
    }
  } catch (error) {
    console.error('\x1b[31mError checking Python dependencies:', error.message, '\x1b[0m');
    process.exit(1);
  }
}

// Function to start the backend server
function startBackend() {
  console.log('\x1b[36mStarting backend server...\x1b[0m');
  
  // Use Python to run the backend
  const backend = spawn('python', ['run.py'], {
    cwd: BACKEND_DIR,
    env: { ...process.env, PORT: BACKEND_PORT }
  });
  
  backend.stdout.on('data', (data) => {
    console.log(`\x1b[36m[BACKEND] ${data.toString().trim()}\x1b[0m`);
  });
  
  backend.stderr.on('data', (data) => {
    console.error(`\x1b[31m[BACKEND ERROR] ${data.toString().trim()}\x1b[0m`);
  });
  
  backend.on('close', (code) => {
    console.log(`\x1b[36m[BACKEND] Process exited with code ${code}\x1b[0m`);
  });
  
  return backend;
}

// Function to start the frontend server
function startFrontend() {
  console.log('\x1b[35mStarting frontend server...\x1b[0m');
  
  // Check if using npm or pnpm
  const packageLockExists = fs.existsSync(path.join(FRONTEND_DIR, 'package-lock.json'));
  const pnpmLockExists = fs.existsSync(path.join(FRONTEND_DIR, 'pnpm-lock.yaml'));
  
  let command = 'npm';
  if (pnpmLockExists) {
    command = 'pnpm';
  }
  
  // Start Next.js dev server
  const frontend = spawn(command, ['run', 'dev'], {
    cwd: FRONTEND_DIR,
    env: { ...process.env, PORT: FRONTEND_PORT }
  });
  
  frontend.stdout.on('data', (data) => {
    console.log(`\x1b[35m[FRONTEND] ${data.toString().trim()}\x1b[0m`);
  });
  
  frontend.stderr.on('data', (data) => {
    console.error(`\x1b[31m[FRONTEND ERROR] ${data.toString().trim()}\x1b[0m`);
  });
  
  frontend.on('close', (code) => {
    console.log(`\x1b[35m[FRONTEND] Process exited with code ${code}\x1b[0m`);
  });
  
  return frontend;
}

// Main function to run the development servers
function main() {
  console.log('\x1b[32m========================================\x1b[0m');
  console.log('\x1b[32m  Niel\'s Fitness Gym Development Server\x1b[0m');
  console.log('\x1b[32m========================================\x1b[0m');
  
  // Check dependencies
  checkDependencies();
  checkPythonDependencies();
  
  // Start servers
  const backendProcess = startBackend();
  const frontendProcess = startFrontend();
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n\x1b[33mShutting down servers...\x1b[0m');
    backendProcess.kill('SIGINT');
    frontendProcess.kill('SIGINT');
    process.exit(0);
  });
}

// Run the main function
main(); 