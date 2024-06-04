from flask import Flask, request, jsonify
from flask_cors import CORS  # Import the CORS module
import json
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

app = Flask(__name__)
CORS(app)  # Enable CORS

class FileChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path == os.path.join('src', 'data', 'data.json'):
            process_data()

def is_valid_spot(data):
    required_keys = ['latitude', 'longitude']
    if not all(key in data for key in required_keys):
        return False

    if 'insertedBy' in data and data['insertedBy'] == 0:
        required_keys.extend(['umidade', 'temperatura', 'vento'])
        if not all(key in data for key in required_keys):
            return False

        umidade = data['umidade']
        temperatura = data['temperatura']
        vento = data['vento']

        if umidade >= 80 and vento >= 40:
            return True
        elif umidade <= 10 and vento >= 70:
            return True
        elif umidade >= 50 and temperatura < 10 and vento > 60:
            return True
        else:
            return False
    else:
        return True

def is_too_close(spot, spots):
    for existing_spot in spots:
        if abs(existing_spot['latitude'] - spot['latitude']) <= 5 and abs(existing_spot['longitude'] - spot['longitude']) <= 5:
            return True
    return False

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    with open(os.path.join('src', 'data', 'db.json'), 'r') as db_file:
        db = json.load(db_file)
    user = next((user for user in db['users'] if user['id'] == user_id), None)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    return jsonify(user), 200

@app.route('/spots/<int:spot_id>', methods=['PUT'])
def update_spot(spot_id):
    data = request.get_json()
    userId = data.get('userId')
    if not userId:
        return jsonify({'message': 'userId is required'}), 400
    with open(os.path.join('src', 'data', 'db.json'), 'r') as db_file:
        db = json.load(db_file)
    spot = next((spot for spot in db['spots'] if spot['id'] == spot_id), None)
    if not spot:
        return jsonify({'message': 'Spot not found'}), 404
    if userId in spot['users']:
        return jsonify({'message': 'Você já está participando deste spot'}), 400
    spot['users'].append(userId)
    with open(os.path.join('src', 'data', 'db.json'), 'w') as db_file:
        json.dump(db, db_file)
    return jsonify({'message': 'Participação adicionada com sucesso'}), 200

@app.route('/spots', methods=['POST'])
def add_spot():
    data = request.get_json()
    userId = data.get('userId')
    if not userId:
        return jsonify({'message': 'Você precisa fazer login!'}), 400
    spot = request.get_json()
    print(f'Received data: {spot}')  # Debug line
    with open(os.path.join('src', 'data', 'db.json'), 'r') as db_file:
        db = json.load(db_file)
    if is_too_close(spot, db['spots']):
        return jsonify({'message': 'Já existe um ponto próximo'}), 400
    else:
        spot['id'] = len(db['spots']) + 1  # Assign a new ID to the spot
        spot['users'] = []  # Initialize the 'users' list
        spot['insertedBy'] = 1  # Initialize the 'insertedBy' field
        db['spots'].append(spot)
        with open(os.path.join('src', 'data', 'db.json'), 'w') as db_file:
            json.dump(db, db_file)
        print(f'Spot added: {spot}')  # Debug line
        return jsonify({'message': 'Spot adicionado com sucesso'}), 200

def process_data():
    try:
        with open(os.path.join('src', 'data', 'data.json'), 'r') as data_file:
            data = json.load(data_file)
    except (IOError, json.JSONDecodeError):
        print("Error reading or parsing data.json")
        return

    valid_spots = [spot for spot in data if is_valid_spot(spot)]

    try:
        with open(os.path.join('src', 'data', 'db.json'), 'r') as db_file:
            db = json.load(db_file)

            for spot in valid_spots:
                try:
                    # Check if a spot with the same latitude and longitude already exists in 'spots'
                    if any(existing_spot['latitude'] == spot['latitude'] and existing_spot['longitude'] == spot['longitude'] for existing_spot in db['spots']):
                        continue  # Skip this spot

                    # Check if the spot is too close to any existing spot
                    if is_too_close(spot, db['spots']):
                        continue  # Skip this spot

                    # Remove the 'vento', 'umidade', and 'temperatura' keys from the spot
                    spot.pop('vento', None)
                    spot.pop('umidade', None)
                    spot.pop('temperatura', None)
                    
                    spot['id'] = len(db['spots']) + 1  # Assign a new ID to the spot
                    spot['users'] = []  # Initialize the 'users' list
                    spot['insertedBy'] = 0  # Initialize the 'insertedBy' field
                    db['spots'].append(spot)
                except KeyError:
                    print("Error processing spot, missing key")
                    continue

            with open(os.path.join('src', 'data', 'db.json'), 'w') as db_file:
                json.dump(db, db_file)
    except (IOError, json.JSONDecodeError):
        print("Error reading or parsing db.json")

if __name__ == '__main__':
    event_handler = FileChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path=os.path.join('src', 'data'), recursive=False)
    observer.start()

    try:
        process_data()
        app.run(debug=True)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()