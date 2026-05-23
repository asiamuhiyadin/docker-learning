#app.py
import os
from flask import Flask
import redis

app = Flask(__name__)
redis_host = os.getenv('REDIS_HOST','redis')
redis_port = int(os.getenv('REDIS_PORT',6379))
r= redis.Redis(host=redis_host, port=redis_port)


@app.route('/')
def welcome_page():
    return f'Welcome to the flask application.'

@app.route('/count')
def counter():
    count = r.incr('count')
    return f'Count value: {count}'

app.run(host="0.0.0.0", port=5000)
