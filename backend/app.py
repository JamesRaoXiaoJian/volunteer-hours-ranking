from __future__ import annotations

import json
import os
import threading
from datetime import datetime, timezone
from uuid import uuid4

from flask import Flask, jsonify, request

DATA_FILE = os.path.join(os.path.dirname(__file__), "data.json")
DATA_LOCK = threading.Lock()

app = Flask(__name__)


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _ensure_data_file() -> None:
    if os.path.exists(DATA_FILE):
        return
    seed = {
        "items": [
            {
                "id": "a1",
                "name": "Alice",
                "hours": 6,
                "note": "Registration desk",
                "created_at": _now_iso(),
                "updated_at": _now_iso(),
            },
            {
                "id": "b2",
                "name": "Bob",
                "hours": 4,
                "note": "Food delivery",
                "created_at": _now_iso(),
                "updated_at": _now_iso(),
            },
            {
                "id": "c3",
                "name": "Cathy",
                "hours": 8,
                "note": "Logistics",
                "created_at": _now_iso(),
                "updated_at": _now_iso(),
            },
        ]
    }
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(seed, f, ensure_ascii=False, indent=2)


def _load_data() -> dict:
    _ensure_data_file()
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def _save_data(data: dict) -> None:
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


@app.route("/api/items", methods=["GET"])
def list_items():
    with DATA_LOCK:
        data = _load_data()
    return jsonify(data["items"])


@app.route("/api/items/<item_id>", methods=["GET"])
def get_item(item_id: str):
    with DATA_LOCK:
        data = _load_data()
    for item in data["items"]:
        if item["id"] == item_id:
            return jsonify(item)
    return jsonify({"error": "not_found"}), 404


@app.route("/api/items", methods=["POST"])
def create_item():
    payload = request.get_json(silent=True) or {}
    name = str(payload.get("name", "")).strip()
    hours = payload.get("hours")
    note = str(payload.get("note", "")).strip()

    if not name:
        return jsonify({"error": "name_required"}), 400
    if not isinstance(hours, int) or hours < 0:
        return jsonify({"error": "hours_must_be_non_negative_int"}), 400

    now = _now_iso()
    item = {
        "id": str(uuid4()),
        "name": name,
        "hours": hours,
        "note": note,
        "created_at": now,
        "updated_at": now,
    }

    with DATA_LOCK:
        data = _load_data()
        data["items"].append(item)
        _save_data(data)

    return jsonify(item), 201


@app.route("/api/items/<item_id>", methods=["PUT"])
def update_item(item_id: str):
    payload = request.get_json(silent=True) or {}

    with DATA_LOCK:
        data = _load_data()
        for item in data["items"]:
            if item["id"] == item_id:
                if "name" in payload:
                    name = str(payload.get("name", "")).strip()
                    if not name:
                        return jsonify({"error": "name_required"}), 400
                    item["name"] = name
                if "hours" in payload:
                    hours = payload.get("hours")
                    if not isinstance(hours, int) or hours < 0:
                        return jsonify({"error": "hours_must_be_non_negative_int"}), 400
                    item["hours"] = hours
                if "note" in payload:
                    item["note"] = str(payload.get("note", "")).strip()

                item["updated_at"] = _now_iso()
                _save_data(data)
                return jsonify(item)

    return jsonify({"error": "not_found"}), 404


@app.route("/api/items/<item_id>", methods=["DELETE"])
def delete_item(item_id: str):
    with DATA_LOCK:
        data = _load_data()
        for idx, item in enumerate(data["items"]):
            if item["id"] == item_id:
                removed = data["items"].pop(idx)
                _save_data(data)
                return jsonify(removed)

    return jsonify({"error": "not_found"}), 404


if __name__ == "__main__":
    _ensure_data_file()
    app.run(host="0.0.0.0", port=3000)
