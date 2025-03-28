.PHONY: help production-build production-start test-up test-down development stop-development remove-development

help:
	@echo ""
	@echo "***************************************"
	@echo "Welcome to iat.et Deployment!"
	@echo "***************************************"
	@echo ""
	@echo "Available commands:"
	@echo "  make prod-up                - Build for production"
	@echo "  make prod-stop              - Start production deployment"
	@echo "  make test-up                - Start deployment test"
	@echo "  make test-down              - Stop deployment test"
	@echo "  make dev-up                 - Start development"
	@echo "  make dev-stop               - Stop development"
	@echo "  make dev-down               - Remove development"
	@echo ""

prod-up:
	@echo "\nStarting Production Build...\n"
	docker compose -p wecare --env-file ./.env -f ./docker-compose.yml build

prod-stop:
	@echo "\nStarting Production Deployment...\n"
	docker compose --env-file ./.env -p wecare -f ./docker-compose.yml up --build --scale api=32 -d && docker stop adminer

test-up:
	@echo "\nStarting Deployment Test at https://iat.et...\n"
	docker compose --env-file ./backend/env/test.env -p wecare -f ./docker-compose.test.yml up --build --scale wecare-api=4 -d

test-down:
	@echo "\nStopping Deployment Test at https://iat.et...\n"
	docker compose --env-file ./backend/env/test.env -p wecare -f ./docker-compose.test.yml down

dev-up:
	@echo "\nStarting localhost Deployment...\n"
	docker compose --env-file ./backend/env/development.env -f ./docker-compose.dev.yml up --build -d

dev-stop:
	@echo "\nStopping localhost Deployment...\n"
	docker compose --env-file ./backend/env/development.env -f ./docker-compose.dev.yml stop

dev-down:
	@echo "\nRemoving localhost Deployment...\n"
	docker compose --env-file ./backend/env/development.env -f ./docker-compose.dev.yml down

