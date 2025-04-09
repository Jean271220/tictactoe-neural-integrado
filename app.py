from flask import Flask, request, jsonify, render_template
import scipy.io
import numpy as np
from flask_cors import CORS

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# Carrega os pesos do modelo treinado no MATLAB
modelo = scipy.io.loadmat("modelo.mat")
W1 = modelo['W1']
b1 = modelo['b1']
W2 = modelo['W2']
b2 = modelo['b2']
W3 = modelo['W3']
b3 = modelo['b3']

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def forward_pass(X):
    a1 = sigmoid(np.dot(W1, X) + b1)
    a2 = sigmoid(np.dot(W2, a1) + b2)
    a3 = sigmoid(np.dot(W3, a2) + b3)
    return a3

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/jogada', methods=['POST'])
def jogada():
    dados = request.get_json()
    estado = np.array(dados['estado']).reshape(18, 1)
    saida = forward_pass(estado)

    jogadas_invalidas = np.array(dados['ocupado']).reshape(9, 1)
    saida[jogadas_invalidas == 1] = -1

    jogada_escolhida = int(np.argmax(saida))
    return jsonify({'jogada': jogada_escolhida})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
