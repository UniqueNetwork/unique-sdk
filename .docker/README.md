# Unique Network web-API Docker image

[![dockerhub](https://img.shields.io/docker/pulls/uniquenetwork/web.svg?logo=docker&style=flat-square)](https://hub.docker.com/r/uniquenetwork/web)

## How to use this image
start container with command 

```shell
docker run -p 3000:3000 -e CHAIN_WS_URL=wss://ws-quartz.unique.network uniquenetwork/web:latest
```

... or via docker-compose

```
version: '3'

services:
  unique-web:
    image: uniquenetwork/web:latest
    ports:
      - '3000:3000'
    environment:
      - CHAIN_WS_URL=wss://ws-quartz.unique.network
```

explore available methods on

http://localhost:3000/swagger/

## Environment Variables

### Required variables

```
CHAIN_WS_URL=wss://ws-quartz.unique.network
```

Other variables are optional, full list is available in [WEB docs](https://github.com/UniqueNetwork/unique-sdk/tree/develop/packages/web#sdk-deployment---getting-started-guide)
