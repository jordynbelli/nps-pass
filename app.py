from flask import Flask, request, jsonify, session, url_for, redirect, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
from dotenv import load_dotenv
import os
import requests
import json
import traceback
from flask_cors import CORS
from dateutil.parser import parse as parse_date

app = Flask(__name__)

load_dotenv()

# CORS configuration
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:jojo1234@localhost/nationalParksApp'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY') 

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

def create_tables():
    db.create_all()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

# Reservation model
class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    HistoricalReservationID = db.Column(db.String(255))
    OrderNumber = db.Column(db.String(255))
    Agency = db.Column(db.String(255))
    OrgID = db.Column(db.String(255))
    CodeHierarchy = db.Column(db.String(255))
    RegionCode = db.Column(db.String(255))
    RegionDescription = db.Column(db.String(255))
    ParentLocationID = db.Column(db.String(255))
    ParentLocation = db.Column(db.String(255))
    LegacyFacilityID = db.Column(db.String(255))
    Park = db.Column(db.String(255))
    SiteType = db.Column(db.String(255))
    UseType = db.Column(db.String(255))
    ProductID = db.Column(db.String(255))
    InventoryType = db.Column(db.String(255))
    FacilityID = db.Column(db.String(255))
    FacilityZIP = db.Column(db.String(255))
    FacilityState = db.Column(db.String(255))
    FacilityLongitude = db.Column(db.Numeric(10, 7))
    FacilityLatitude = db.Column(db.Numeric(10, 7))
    CustomerZIP = db.Column(db.String(255))
    Tax = db.Column(db.Numeric(10, 2))
    UseFee = db.Column(db.Numeric(10, 2))
    TranFee = db.Column(db.Numeric(10, 2))
    AttrFee = db.Column(db.Numeric(10, 2))
    TotalBeforeTax = db.Column(db.Numeric(10, 2))
    Discount = db.Column(db.Numeric(10, 2))
    TotalPaid = db.Column(db.Numeric(10, 2))
    StartDate = db.Column(db.DateTime)
    EndDate = db.Column(db.DateTime)
    OrderDate = db.Column(db.DateTime)
    Nights = db.Column(db.Integer)
    NumberOfPeople = db.Column(db.Integer)
    EquipmentDescription = db.Column(db.Text)
    EquipmentLength = db.Column(db.Numeric(10, 2))

# Campsite model
class Campsite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    CampsiteID = db.Column(db.String(255), nullable=False)
    FacilityID = db.Column(db.String(255), nullable=False)
    CampsiteName = db.Column(db.String(255), nullable=False)
    CampsiteType = db.Column(db.String(255), nullable=False)
    TypeOfUse = db.Column(db.String(255), nullable=False)
    CampsiteAccessible = db.Column(db.Boolean)
    CampsiteLongitude = db.Column(db.Numeric(10, 7))
    CampsiteLatitude = db.Column(db.Numeric(10, 7))
    CreatedDate = db.Column(db.DateTime, nullable=False)
    LastUpdatedDate = db.Column(db.DateTime, nullable=False)
    ATTRIBUTES = db.Column(db.Text)
    PERMITTEDEQUIPMENT = db.Column(db.Text)
    ENTITYMEDIA = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'CampsiteID': self.CampsiteID,
            'FacilityID': self.FacilityID,
            'CampsiteName': self.CampsiteName,
            'CampsiteType': self.CampsiteType,
            'TypeOfUse': self.TypeOfUse,
            'CampsiteAccessible': self.CampsiteAccessible,
            'CampsiteLongitude': str(self.CampsiteLongitude),
            'CampsiteLatitude': str(self.CampsiteLatitude),
            'CreatedDate': self.CreatedDate.strftime('%Y-%m-%d %H:%M:%S') if self.CreatedDate else None,
            'LastUpdatedDate': self.LastUpdatedDate.strftime('%Y-%m-%d %H:%M:%S') if self.LastUpdatedDate else None,
            'ATTRIBUTES': self.ATTRIBUTES,
            'PERMITTEDEQUIPMENT': self.PERMITTEDEQUIPMENT,
            'ENTITYMEDIA': self.ENTITYMEDIA
        }

@app.route('/check_user', methods=['POST'])
def check_user():
    data = request.get_json()
    username = data.get('username')

    user = User.query.filter_by(username=username).first()

    if user:
        return jsonify({'exists': True})
    else:
        return jsonify({'exists': False})

@app.route('/')
def home():
    return "NPS Express Pass"

@app.route('/purchase', methods=['POST'])
def purchase():
    data = request.json
    # Purchase logic here
    # Mock response for now
    return jsonify({"message": "Purchase successful"}), 200

@app.route('/findapark')
def find_a_park():
    return render_template('findapark.html')

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not all(key in data for key in ('username', 'email', 'password')):
        return jsonify({'message': 'Missing required fields'}), 400

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"message": "Missing required fields"}), 422
    user = User.query.filter_by(email=data['email']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity={'email': user.email})
        return jsonify(access_token=access_token), 200
    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/useredit', methods=['PUT'])
@jwt_required()
def update_user():
    current_user = get_jwt_identity()
    if not isinstance(current_user, dict) or 'email' not in current_user:
        return jsonify({"message": "Invalid user identity"}), 422
    
    data = request.get_json()
    if not data:
        return jsonify({"message": "No data provided"}), 422

    user = User.query.filter_by(email=current_user['email']).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    if 'newEmail' in data:
        if not data['newEmail']:
            return jsonify({"message": "New email cannot be empty"}), 422
        user.email = data['newEmail']

    if 'password' in data:
        if not data['password']:
            return jsonify({"message": "Password cannot be empty"}), 422
        user.password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    db.session.commit()
    return jsonify({"message": "User updated successfully"}), 200

@app.route('/delete_account', methods=['DELETE'])
@jwt_required()
def delete_user():
    current_user = get_jwt_identity()
    if not isinstance(current_user, dict) or 'email' not in current_user:
        return jsonify({"message": "Invalid user identity"}), 422

    user = User.query.filter_by(email=current_user['email']).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200

@app.route('/logout')
def logout():
    # Clear the session
    session.clear()
    # Redirect to home page
    return redirect(url_for('home'))

@app.route('/fetch_campsites', methods=['GET'])
def fetch_campsites():
    state = request.args.get('state')
    if not state:
        return jsonify({'message': 'State is required'}), 400

    api_url = 'https://ridb.recreation.gov/api/v1/campsites'
    params = {
        'apikey': os.getenv('RIDB_API_KEY'),  # Ensure you have this key in your .env file
        'limit': 10, 
        'state': state
    }

    try:
        response = requests.get(api_url, params=params)
        response.raise_for_status()
        data = response.json()
        campsites = []
        for item in data['RECDATA']:
            try:
                campsite = {
                    'CampsiteID': item['CampsiteID'],
                    'FacilityID': item['FacilityID'],
                    'CampsiteName': item['CampsiteName'],
                    'CampsiteType': item['CampsiteType'],
                    'TypeOfUse': item['TypeOfUse'],
                    'CampsiteAccessible': item.get('CampsiteAccessible', False),
                    'CampsiteLongitude': item.get('CampsiteLongitude'),
                    'CampsiteLatitude': item.get('CampsiteLatitude'),
                    'CreatedDate': parse_date(item['CreatedDate']),
                    'LastUpdatedDate': parse_date(item['LastUpdatedDate']),
                    'ATTRIBUTES': str(item.get('ATTRIBUTES', '')),
                    'PERMITTEDEQUIPMENT': str(item.get('PERMITTEDEQUIPMENT', '')),
                    'ENTITYMEDIA': str(item.get('ENTITYMEDIA', '')),
                    'image': item['ENTITYMEDIA'][0]['URL'] if 'ENTITYMEDIA' in item and item['ENTITYMEDIA'] else None
                }
                campsites.append(campsite)
            except ValueError as e:
                print(f"Date parsing error: {e}")
                continue

        return jsonify(campsites=campsites), 200
    except requests.exceptions.RequestException as e:
        print(f"RequestException: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'message': 'Error fetching campsites', 'error': str(e)}), 500
    except Exception as e:
        print(f"Exception: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'message': 'Internal server error', 'error': str(e)}), 500
    
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
