# DevOps Mission Control 🛰️

Built by **Asia** — a production-flavoured containerised web dashboard demonstrating stateless horizontal scaling, Redis persistence, and Nginx load balancing. This started as a DevOps challenge and became a fully polished "Mission Control" dashboard that shows the complete request lifecycle from browser to database and back.

Live at `http://localhost:5002` after a single `docker compose up` command.

---

## What This Project Does

Rather than a basic tutorial counter app, this is a multi-page dashboard with real DevOps architecture underneath. Every request travels through Nginx, gets load balanced across multiple Flask containers, and hits a persistent Redis store — exactly how a production stateless service works. The UI visualises all of this in real time with animated diagrams, live stats cards, a weekly traffic chart, and service status indicators.

The project has six routes: a main dashboard at `/`, a pipeline visualisation page at `/pipeline` that animates the full request flow, a tech stack inventory at `/stack`, an about page at `/about` with project narrative and profile card, a machine-readable health check at `/health` that returns JSON with Redis status and container ID, and a raw metrics endpoint at `/api/stats` for external tooling.

---

## Architecture

Every public request hits Nginx on port 5002. Nginx applies round-robin load balancing across however many Flask replicas are running — scaled with a single flag. Flask containers are completely stateless; they hold no session data. All shared state lives in Redis, which is backed by a named Docker volume so visit counters and analytics survive container restarts and even `docker compose down`. The only way to wipe the data is to explicitly pass `--volumes`.

Docker Compose defines the entire topology. The Flask service name resolves automatically via Docker's internal DNS, so Nginx can route to `flask:5000` regardless of how many replicas exist. Environment variables (`REDIS_HOST`, `REDIS_PORT`) follow twelve-factor app principles, making the app portable across environments without code changes.

```
Browser
  │
  ▼  port 5002
[ Nginx ]  ── round-robin ──┐
  │                         │
  ▼                         ▼
[ Flask_1 ]           [ Flask_N ]
  │                         │
  └──────────┬──────────────┘
             ▼  port 6379
          [ Redis ]
             │
      [ Volume: redis-data ]
```

---

## Quick Start

```bash
git clone https://github.com/asiamuhiyadin/docker-learning.git
cd flask-redis-counter
docker compose up --build --scale flask=3 -d
```

Then open `http://localhost:5002` in your browser.

---

## Scaling

```bash
docker compose up --scale flask=5 -d
```

Watch the container ID change on the dashboard with each refresh — that is Nginx distributing requests across replicas in real time.

---

## Health Check

```bash
curl http://localhost:5002/health
```

Returns JSON with Redis status, container ID, uptime, and timestamp — ready for a load balancer probe or uptime monitor.

```json
{
  "status": "healthy",
  "container_id": "a3f9c812e4b1",
  "redis": "up",
  "timestamp": "2024-01-15T12:34:56Z",
  "uptime": "2h 14m"
}
```

---

## Tech Stack

Python Flask for the web layer, Redis 7 for shared persistent state, Nginx 1.25 as the sole public-facing reverse proxy, Docker and Docker Compose for containerisation and orchestration, and vanilla HTML, CSS, and JavaScript for the frontend with no framework dependencies.

---

## Key Design Decisions

Stateless Flask means no session data is stored in-process, so any replica can handle any request. Redis holds the only mutable state, meaning visit counters and daily analytics survive container restarts. Nginx is the sole public interface — Flask is never exposed directly, which mirrors real production topology. The named Docker volume ensures data persists across `docker compose down` and only gets wiped if you explicitly pass `--volumes`. Environment variables follow twelve-factor app principles, making the app portable without code changes. The non-root `appuser` inside the container is a small but meaningful security baseline that most tutorial projects skip.

---

## What I Learned

The trickiest part was not the code — it was understanding how Docker's internal DNS resolves service names at runtime, debugging container networking from inside a running container with `docker exec` and `curl`, and understanding why data persistence requires explicit volume configuration rather than relying on container storage. Building this gave me hands-on experience with the exact patterns used in real microservice deployments.

---

## Next Steps

- [ ] Swap Nginx for Traefik with automatic TLS via Let's Encrypt
- [ ] Add a Prometheus metrics endpoint and Grafana dashboard
- [ ] Write a GitHub Actions CI pipeline to build and push images on every commit
- [ ] Deploy to a cloud VM (DigitalOcean / EC2) behind a real domain
- [ ] Migrate the architecture to Kubernetes with a Deployment, Service, and PersistentVolumeClaim

---

Built by **Asia** · Flask · Redis · Docker · Nginx