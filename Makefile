.PHONY: test lint ci cd cicd

test:
	CI=true npm test

lint:
	markdownlint README.md

ci: test lint
	@echo "✓ CI passed"

cd:
	npx wrangler deploy

cicd: ci cd
	@echo "✓ CI/CD completed successfully"
