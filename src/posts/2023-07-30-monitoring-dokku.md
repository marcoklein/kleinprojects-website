---
tags: [impromat]
title: Prometheus and Grafana with Dokku
date: 2023-07-30
---

The following instructions describe how I have setup server-side monitoring for [Impromat.app](https://impromat.app). The server is running [Dokku](https://dokku.com) for managing all services.

The monitoring primarily relies on:

- Prometheus
- Grafana
- node-exporter
- cAdvisor

Tested with:

- Ubuntu 22.04
- Dokku 0.30.2

Based on [this article](https://richardwillis.info/blog/monitor-dokku-server-prometheus-loki-grafana) with adaptions to make it work with dokku version `0.30.2`.

> Replace `impromat.app` with your own domain.

## Install required plugins

```sh
sudo dokku plugin:install http-auth https://github.com/dokku/dokku-http-auth.git
sudo dokku plugin:install letsencrypt https://github.com/dokku/dokku-letsencrypt.git
```

## Install Prometheus

Add dedicated network for prometheus services (see [Dokku Networking](https://dokku.com/docs/networking/network/)):

```sh
dokku network:create prometheus-bridge
```

Create `prometheus` app:

```sh
dokku apps:create prometheus
dokku proxy:ports-add prometheus http:80:9090
dokku network:set prometheus attach-post-deploy prometheus-bridge
```

Create volume mappings:

```sh
sudo mkdir -p /var/lib/dokku/data/storage/prometheus/{config,data}
sudo touch /var/lib/dokku/data/storage/prometheus/config/{alert.rules,prometheus.yml}
sudo chown -R nobody:nogroup /var/lib/dokku/data/storage/prometheus

dokku storage:mount prometheus /var/lib/dokku/data/storage/prometheus/config:/etc/prometheus
dokku storage:mount prometheus /var/lib/dokku/data/storage/prometheus/data:/prometheus
```

Add prometheus docker start command:

```sh
dokku config:set --no-restart prometheus DOKKU_DOCKERFILE_START_CMD="--config.file=/etc/prometheus/prometheus.yml
--storage.tsdb.path=/prometheus
--web.console.libraries=/usr/share/prometheus/console_libraries
--web.console.templates=/usr/share/prometheus/consoles
--web.enable-lifecycle
--storage.tsdb.no-lockfile"
```

> `--config.file` sets the location of the prometheus config path.

Create config file at `/var/lib/dokku/data/storage/prometheus/config/prometheus.yml`:

```yml
global:
scrape_interval: 15s

scrape_configs:
  - job_name: "prometheus"
    scrape_interval: 15s
    static_configs:
      - targets:
          - "localhost:9090"
  - job_name: node-exporter
    scrape_interval: 15s
    scheme: https
    basic_auth:
    username: <username>
    password: <password>
    static_configs:
      - targets:
          - "node-exporter.impromat.app"
  - job_name: cadvisor
    scrape_interval: 15s
    scheme: http
    static_configs:
      - targets:
          - cadvisor.web:8080
```

Deploy prometheus:

```sh
docker pull prom/prometheus:latest
docker tag prom/prometheus:latest dokku/prometheus:latest
dokku git:from-image prometheus dokku/prometheus:latest
dokku domains:set prometheus prometheus.impromat.app

dokku letsencrypt:enable prometheus
dokku http-auth:enable prometheus USER PASSWORD
```

Validate running Prometheus at https://prometheus.impromat.app/targets (using respective `USER` and `PASSWORD`)

## Create node-exporter

```sh
dokku apps:create node-exporter
dokku proxy:ports-set node-exporter http:80:9100
dokku config:set --no-restart node-exporter DOKKU_DOCKERFILE_START_CMD="--collector.textfile.directory=/data --path.procfs=/host/proc --path.sysfs=/host/sys"

dokku docker-options:add node-exporter deploy "--net=host"
dokku checks:disable node-exporter
```

Storage mounts:

```sh
sudo mkdir -p /var/lib/dokku/data/storage/node-exporter
sudo chown nobody:nogroup /var/lib/dokku/data/storage/node-exporter

dokku storage:mount node-exporter /proc:/host/proc:ro
dokku storage:mount node-exporter /:/rootfs:ro
dokku storage:mount node-exporter /sys:/host/sys:ro
dokku storage:mount node-exporter /var/lib/dokku/data/storage/node-exporter:/data
```

Deploy node-exporter:

```sh
docker image pull prom/node-exporter:latest
docker image tag prom/node-exporter:latest dokku/node-exporter:latest

dokku git:from-image node-exporter dokku/node-exporter:latest
dokku domains:set node-exporter node-exporter.impromat.app

dokku letsencrypt:enable node-exporter
dokku http-auth:enable node-exporter USER PASSWORD
```

## Create cAdvisor

```sh
dokku apps:create cadvisor
dokku proxy:ports-set cadvisor http:80:8080
dokku config:set --no-restart cadvisor DOKKU_DOCKERFILE_START_CMD="--docker_only --housekeeping_interval=10s --max_housekeeping_interval=60s"
dokku network:set cadvisor attach-post-deploy prometheus-bridge
```

Storage mounts:

```sh
dokku storage:mount cadvisor /:/rootfs:ro
dokku storage:mount cadvisor /sys:/sys:ro
dokku storage:mount cadvisor /var/lib/docker:/var/lib/docker:ro
dokku storage:mount cadvisor /var/run:/var/run:rw
```

Deploy cadvisor:

```sh
docker image pull gcr.io/cadvisor/cadvisor:latest
docker image tag gcr.io/cadvisor/cadvisor:latest dokku/cadvisor:latest

dokku git:from-image cadvisor dokku/cadvisor:latest
```

## Setup Grafana

Create app:

```sh
dokku apps:create grafana
dokku proxy:ports-add grafana http:80:3000
dokku network:set grafana attach-post-deploy prometheus-bridge
```

Storage mounts:

```sh
sudo mkdir -p /var/lib/dokku/data/storage/grafana/{config,data,plugins}
sudo mkdir -p /var/lib/dokku/data/storage/grafana/config/provisioning/datasources
sudo chown -R 472:472 /var/lib/dokku/data/storage/grafana

dokku storage:mount grafana /var/lib/dokku/data/storage/grafana/config/provisioning/datasources:/etc/grafana/provisioning/datasources
dokku storage:mount grafana /var/lib/dokku/data/storage/grafana/data:/var/lib/grafana
dokku storage:mount grafana /var/lib/dokku/data/storage/grafana/plugins:/var/lib/grafana/plugins
```

Add `prometheus` data source to `/var/lib/dokku/data/storage/grafana/config/provisioning/datasources/prometheus.yml`:

```sh
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    orgId: 1
    url: http://prometheus.web:9090
    basicAuth: false
    isDefault: true
    version: 1
    editable: true
```

Deploy Grafana:

```sh
docker pull grafana/grafana:latest
docker tag grafana/grafana:latest dokku/grafana:latest
dokku git:from-image grafana dokku/grafana:latest
dokku letsencrypt:enable grafana
```

## Login to Grafana

Go to https://grafana.impromat.app. Login via `admin`/`admin` and set a new password.
