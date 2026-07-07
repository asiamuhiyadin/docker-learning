# Docker Learning 🐳

A collection of containerized projects built while learning Docker — starting from a single-container "hello world" and progressing to a multi-container, load-balanced app with persistent state.

Each project lives in its own folder with its own README covering what it does, how to run it, and what I learned.

---

## 📂 Projects

### [flask-redis-counter](./flask-redis-counter) — ⭐ Featured
A production-flavoured, containerised Flask + Redis dashboard demonstrating stateless horizontal scaling and Nginx load balancing. Multi-page UI, health checks, live metrics, and a full request-lifecycle visualisation — built to mirror real DevOps architecture, not just a tutorial counter app.

**Stack:** Flask · Redis · Nginx · Docker Compose

### [hello_flask](./hello_flask)
The starting point — a minimal single-container Flask app, used to learn the basics of writing a Dockerfile, building an image, and running a container.

**Stack:** Flask · Docker

### [flask-redis-counter-backup](./flask-redis-counter-backup)
An earlier snapshot of `flask-redis-counter`, kept as a restore point during development. The current, actively maintained version is in `flask-redis-counter` above.

---

## 🧭 Progression

This repo is organized to show the learning path in order:

1. **hello_flask** — single container, no dependencies
2. **flask-redis-counter** — multi-container app, shared state via Redis, load balanced via Nginx, scaled with Docker Compose

---

## 🔧 Tech Stack Across This Repo

![Docker](https://img.shields.io/badge/-DOCKER-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Flask](https://img.shields.io/badge/-FLASK-000000?style=for-the-badge&logo=flask&logoColor=white)
![Redis](https://img.shields.io/badge/-REDIS-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Nginx](https://img.shields.io/badge/-NGINX-009639?style=for-the-badge&logo=nginx&logoColor=white)
![Python](https://img.shields.io/badge/-PYTHON-3776AB?style=for-the-badge&logo=python&logoColor=white)

---

## 🙋 About

Built by **Asia** — learning DevOps and containerization by shipping real, working projects rather than following tutorials passively. More projects (Linux troubleshooting labs, OverTheWire Bandit walkthroughs) live in separate repos on my profile.

[LinkedIn](https://www.linkedin.com/in/asia-m-194384280) · [GitHub](https://github.com/asiamuhiyadin)
