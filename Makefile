copy_env:
	cp .env.example .env

install:
	cd backend && npm install
	cd frontend && npm install

build-server:
	cd backend && npm run build

build-client:
	cd frontend && npm run build

dev:
	make build-client
	cd backend && npm run dev

start-server:
	cd backend && npm start

start:
	make build-client
	make build-server
	make start-server

knip:
	cd backend && npm run knip
	cd frontend && npm run knip