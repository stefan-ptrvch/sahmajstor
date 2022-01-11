from flask import Flask, request, jsonify
from flask_cors import CORS
import plakychess

app = Flask(__name__)
CORS(app)

@app.route("/api", methods=["GET", "POST"])
def api_handler():
    """
    Gets JSON representation of board state and generates next move.
    """

    # NOTE: Used for development, since the Rust library gets recompiled and
    # Python doesn't reload it automatically
    from importlib import reload
    import plakychess
    reload(plakychess)

    if request.method == "GET":
        return jsonify({"hello": "world"})
    if request.method == "POST":
        game_state = request.get_json()
        print(game_state)
        print(plakychess.get_next_move(game_state["board"]))
        return jsonify()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5001", debug=True)
