import os
import time
import socket
import platform
import datetime
from flask import Flask, render_template, jsonify
import redis

app = Flask(__name__)

# ── Redis connection ──────────────────────────────────────────────────────────
REDIS_HOST = os.environ.get("REDIS_HOST", "redis")
REDIS_PORT = int(os.environ.get("REDIS_PORT", 6379))

def get_redis():
    return redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)

def redis_ping():
    try:
        r = get_redis()
        r.ping()
        return True
    except Exception:
        return False

# ── Helpers ───────────────────────────────────────────────────────────────────
def get_container_id():
    """Return a short container/host identifier."""
    return socket.gethostname()

def get_visit_stats(r):
    """Return total visits and today's visits from Redis."""
    total = int(r.get("visits:total") or 0)
    today_key = f"visits:{datetime.date.today().isoformat()}"
    today = int(r.get(today_key) or 0)
    return total, today

def record_visit(r):
    """Increment total and daily visit counters."""
    r.incr("visits:total")
    today_key = f"visits:{datetime.date.today().isoformat()}"
    r.incr(today_key)
    r.expire(today_key, 86400 * 7)          # keep daily keys for 7 days

def get_weekly_traffic(r):
    """Return list of (date_label, count) for the last 7 days."""
    today = datetime.date.today()
    result = []
    for i in range(6, -1, -1):
        day = today - datetime.timedelta(days=i)
        key = f"visits:{day.isoformat()}"
        count = int(r.get(key) or 0)
        result.append({"day": day.strftime("%a"), "count": count})
    return result

def uptime_string():
    """Approximate process uptime (resets on container restart)."""
    try:
        with open("/proc/uptime") as f:
            secs = float(f.read().split()[0])
    except Exception:
        secs = 0
    h = int(secs // 3600)
    m = int((secs % 3600) // 60)
    return f"{h}h {m}m"

# ── Routes ────────────────────────────────────────────────────────────────────
@app.route("/")
def index():
    r = get_redis()
    record_visit(r)
    total, today = get_visit_stats(r)
    weekly = get_weekly_traffic(r)
    context = {
        "container_id": get_container_id(),
        "redis_ok": redis_ping(),
        "total_visits": total,
        "today_visits": today,
        "weekly_traffic": weekly,
        "uptime": uptime_string(),
        "python_version": platform.python_version(),
        "timestamp": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
    }
    return render_template("index.html", **context)


@app.route("/pipeline")
def pipeline():
    return render_template(
        "pipeline.html",
        container_id=get_container_id(),
        redis_ok=redis_ping(),
    )


@app.route("/stack")
def stack():
    return render_template(
        "stack.html",
        container_id=get_container_id(),
        redis_ok=redis_ping(),
    )


@app.route("/about")
def about():
    return render_template(
        "about.html",
        container_id=get_container_id(),
        redis_ok=redis_ping(),
    )


# ── API / health endpoints ────────────────────────────────────────────────────
@app.route("/health")
def health():
    redis_ok = redis_ping()
    status = "healthy" if redis_ok else "degraded"
    code = 200 if redis_ok else 503
    return jsonify({
        "status": status,
        "container_id": get_container_id(),
        "redis": "up" if redis_ok else "down",
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "uptime": uptime_string(),
    }), code


@app.route("/api/stats")
def api_stats():
    try:
        r = get_redis()
        total, today = get_visit_stats(r)
        weekly = get_weekly_traffic(r)
        redis_ok = True
    except Exception:
        total = today = 0
        weekly = []
        redis_ok = False
    return jsonify({
        "total_visits": total,
        "today_visits": today,
        "weekly_traffic": weekly,
        "redis_status": "up" if redis_ok else "down",
        "container_id": get_container_id(),
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)