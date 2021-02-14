---
title: Linux Cheat Sheet
date: 2021-01-12
tags:
  - Linux
---

## Check Kernel Version

```bash
uname -a
```

## Check IP

```bash
ifconfig
```

```bash
ip addr show
```

## Check disk space

```bash
df -ah
```

## Work with services

```bash
service <service-name> status
systemctl status <service-name>
```

## Check folder size

Disk use

```bash
du -sh <directory>
```

## Check for open ports

```bash
netstat
```

## Check CPU usage

```bash
ps aux | grep <process-name>
```

```bash
top
```

## Mounting

```bash
mount /dev/sda2 /mnt
```

Check for existing

```bash
mounts
```

Auto mount in file

```bash
/etc/fstab
```

## Manpages

Manual pages

```bash
man <command>
```

## Permissions

Show permissions

```bash
stat file.txt
```

Change permissions

```bash
# denies file read for others
chmod o-r file.txt
# read for user, read for group, deny access to others
chmod u=r,g=r,o= file.txt
```
