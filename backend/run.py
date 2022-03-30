from flask import Flask, request, jsonify, session
from flask_cors import CORS, cross_origin
import plakychess

app = Flask(__name__)
app.secret_key = 'b409cfe2f5bb8af9898ac423ca728840934c5f65feb0e979778159aed78b2b81'
CORS(app, resources={r'/api/*': {'origins': 'http://localhost:8080'}})

@app.route("/api", methods=["GET", "POST"])
@cross_origin(supports_credentials=True)
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
        return jsonify(plakychess.get_next_move(game_state["board"]))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5001", debug=True)
