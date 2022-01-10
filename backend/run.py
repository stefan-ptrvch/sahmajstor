from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api", methods=["GET", "POST"])
def api_handler():
    """
    Gets JSON representation of board state and generates next move.
    """
    if request.method == "GET":
        return jsonify({"hello": "world"})
    if request.method == "POST":
        data = request.get_json()
        print(data)
        return jsonify({"hello": "world"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5001", debug=True)
