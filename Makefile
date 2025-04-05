copy_env:
	cp .env.example .env

# Install dependencies
install:
	cd backend && npm install
	cd frontend && npm install

# Start development server
dev:
	cd frontend && npm run build
	cd backend && npm run dev

# Build for production
build:
	cd backend && npm run build

# Start production server
start:
	cd backend && npm start

# Check for unused code
knip:
	cd backend && npm run knip
	cd frontend && npm run knip