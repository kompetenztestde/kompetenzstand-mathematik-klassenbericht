FROM node:24-alpine

# Setup java for openapi generation
RUN apk add --no-cache bash openjdk21
ENV SHELL=/bin/bash
RUN touch /root/.bashrc
ENV ENV=/root/.bashrc
ENV JAVA_HOME=/usr/lib/jvm/java-21-openjdk
ENV PATH="$JAVA_HOME/bin:$PATH"

# Add support for obsolete package managers (prefered is pnpm)
RUN corepack install -g npm@latest
RUN corepack install -g yarn@1

# Install and run setup for pnpm
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable pnpm
RUN pnpm setup

# Add git, used for operations in gitlab-ci
RUN apk add --no-cache git

# Switching to predefined user, has 1000 as id and group id, which may be equal to your host user.
USER node

WORKDIR /application