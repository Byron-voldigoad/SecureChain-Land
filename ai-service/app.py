from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/predict_fraud', methods=['POST'])
def predict():
    req = request.json
    montant = req.get('montant', 0)

    # Règle métier simple pour simuler l'IA :
    # Si montant > 200,000,000 -> SUSPECT
    if montant > 200000000:
        status = "SUSPECT"
        score = 0.95
    else:
        status = "NORMAL"
        score = 0.1

    return jsonify({
        "status": status,
        "score_risque": score,
        "statut_ia": "Analyse via Règles Métier (Mode Dégradé)"
    })

if __name__ == '__main__':
    app.run(port=5001)
