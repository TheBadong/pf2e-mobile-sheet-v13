
.PHONY: clean default update refresh build
.ONESHELL:

PF2E_REPO_PATH := $(shell node -e 'console.log(JSON.parse(require("fs").readFileSync("foundryconfig.json")).pf2eRepoPath);')

build:
	yarn build
deps:
	yarn install
build_dev:
	yarn build:dev
clean:
	yarn clean
watch:
	yarn watch
hot:
	yarn hot
lint:
	yarn lint
lint_ts:
	yarn lint:ts
lint_json:
	yarn lint:json
lint_fix:
	yarn lint:fix

android_debug:
	adb forward tcp:9222 localabstract:chrome_devtools_remote


include types/Makefile
