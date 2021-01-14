---
title: Linux Cheat Sheet
date: 2021-01-12
tags:
  - Linux
---

## Check Kernel Version

```
uname -a
```

## Check IP

```
ifconfig
```

```
ip addr show
```

## Check disk space

```
df -ah
```

## Work with services

```
service <service-name> status
systemctl status <service-name>
```

## Check folder size

Disk use

```
du -sh <directory>
```

## Check for open ports

```
netstat
```

## Check CPU usage

```
ps aux | grep <process-name>
```

```
top
```

## Mounting

```
mount /dev/sda2 /mnt
```

Check for existing

```
mounts
```

Auto mount in file

```
/etc/fstab
```

## Manpages

Manual pages

```
man <command>
```
