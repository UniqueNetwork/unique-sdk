# Unique network web API

## How to use this image
start container with command 

```shell
docker run -p 3000:3000 -e CHAIN_WS_URL=wss://ws-quartz.unique.network uniquenetwork/web:develop
```

... or via docker-compose

```
version: '3'

services:
  unique-web:
    image: uniquenetwork/web:develop
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

Other variables are optional, full list is available in [WEB docs](../packages/web#sdk-deployment---getting-started-guide)
