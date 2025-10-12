# TODO App - Quick Reference

## Starting the TODO App

### Method 1: Dev Server + Firebase Emulator
```bash
cd frontend
npm run dev:all
```
Access at: http://localhost:3000/todo

### Method 2: Dev Server Only (without Firebase)
```bash
cd frontend
npm run dev
```

### Method 3: Firebase Emulator Only
```bash
cd frontend
npm run emulator
```

## Important Notes

- **Firebase Emulator runs via npm, NOT Docker**
- Emulator ports: 4000 (UI), 8080 (Firestore), 9099 (Auth), 5001 (Functions)
- Backend services (API, DB, etc.) run via Docker Compose
- Set `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true` in `.env.local` for local development

## Docker Compose Services

Firebase Emulator is NOT included in `docker-compose.yml`.

Backend services only:
```bash
docker-compose up -d  # Starts: API, DB, pgAdmin, LocalStack
```

## Troubleshooting

### Firebase Emulator won't start
```bash
# Make sure firebase-tools is installed
cd frontend
npm install

# Try running emulator directly
npx firebase emulators:start --only firestore
```

### Port conflicts
```bash
# Check what's using the port
lsof -i :8080

# Kill the process
kill -9 <PID>
```
