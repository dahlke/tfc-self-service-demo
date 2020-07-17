SHELL := /bin/bash
CWD := $(shell pwd)

DOCKER_HUB_USER=eklhad
APP_IMAGE_NAME = tfc-self-service-demo
APP_IMAGE_VERSION=0.1

##########################
# DEV HELPERS
##########################
.PHONY: todo
todo:
	@ag "TODO" --ignore Makefile

##########################
# WEB APP HELPERS
#########################
.PHONY: npm_build_frontend
npm_build_frontend:
	cd frontend && \
	npm run-script build

.PHONY: docker_build_app
docker_build_app:
	docker build . -t ${DOCKER_HUB_USER}/${APP_IMAGE_NAME}:${APP_IMAGE_VERSION}

.PHONY: docker_run_app
docker_run_app:
	docker run -d \
		-p 5000:5000 \
		-e TFC_URL=${TFC_URL} \
		-e TFC_ORG=${TFC_ORG} \
		-e TFC_TOKEN=${TFC_TOKEN} \
		-e TFC_OAUTH_TOKEN_ID=${TFC_OAUTH_TOKEN_ID} \
		${DOCKER_HUB_USER}/${APP_IMAGE_NAME}:${APP_IMAGE_VERSION}

.PHONY: docker_run_app_dev
docker_run_app_dev:
	docker run -d -v ${CWD}/web:/web \
		-p 5000:5000 \
		-e TFC_URL=${TFC_URL} \
		-e TFC_ORG=${TFC_ORG} \
		-e TFC_TOKEN=${TFC_TOKEN} \
		-e TFC_OAUTH_TOKEN_ID=${TFC_OAUTH_TOKEN_ID} \
		${DOCKER_HUB_USER}/${APP_IMAGE_NAME}:${APP_IMAGE_VERSION}

.PHONY: docker_push_app
docker_push_app:
	docker push ${DOCKER_HUB_USER}/${APP_IMAGE_NAME}:${APP_IMAGE_VERSION}