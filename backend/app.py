from __future__ import annotations

import json
import os
import threading
from datetime import datetime, timezone
from uuid import uuid4

from flask import Flask, jsonify, request

DATA_FILE = os.path.join(os.path.dirname(__file__), "teachers.json")
CHANGELOG_FILE = os.path.join(os.path.dirname(__file__), "changelog.json")
DATA_LOCK = threading.Lock()

app = Flask(__name__)


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _ensure_data_file() -> None:
    if os.path.exists(DATA_FILE):
        return

    seed = []
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(seed, f, ensure_ascii=False, indent=2)


def _load_data() -> list:
    _ensure_data_file()
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def _save_data(data: list) -> None:
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


@app.after_request
def _add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/api/teachers", methods=["GET"])
def list_teachers():
    with DATA_LOCK:
        data = _load_data()
    return jsonify(data)


@app.route("/api/teachers", methods=["PUT"])
def save_teachers():
    payload = request.get_json(silent=True)
    if not isinstance(payload, list):
        return jsonify({"error": "teachers_must_be_array"}), 400

    with DATA_LOCK:
        _save_data(payload)

    return jsonify({"status": "ok"})


def _load_changelog() -> list:
    if not os.path.exists(CHANGELOG_FILE):
        return []
    try:
        with open(CHANGELOG_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, ValueError):
        return []


def _save_changelog(data: list) -> None:
    with open(CHANGELOG_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


@app.route("/api/changelog", methods=["GET"])
def get_changelog():
    with DATA_LOCK:
        entries = _load_changelog()
    return jsonify(entries)


@app.route("/api/changelog", methods=["POST"])
def add_changelog():
    entry = request.get_json(silent=True)
    if not isinstance(entry, dict) or "action" not in entry:
        return jsonify({"error": "invalid_entry"}), 400

    entry.setdefault("id", str(uuid4()))
    entry.setdefault("timestamp", _now_iso())

    with DATA_LOCK:
        log = _load_changelog()
        log.append(entry)
        _save_changelog(log)

    return jsonify({"status": "ok"})


if __name__ == "__main__":
    _ensure_data_file()
    app.run(host="0.0.0.0", port=3000)
