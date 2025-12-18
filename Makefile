.PHONY: test lint audit validate ci cd cicd

test:
	CI=true npm test

lint:
	markdownlint README.md

audit:
	npm audit --audit-level=moderate

validate:
	npx wrangler types > /dev/null

ci: test lint audit validate
	@echo "✓ CI passed"

cd:
	npx wrangler deploy

cicd: ci cd
	@echo "✓ CI/CD completed successfully"
