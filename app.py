from flask import Flask, request, jsonify, session, url_for, redirect, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
from dotenv import load_dotenv
import os
from werkzeug.security import generate_password_hash, check_password_hash
import requests
import json
from flask_cors import CORS

app = Flask(__name__)

load_dotenv()

# CORS configuration
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:jojo1234@localhost/nationalParksApp'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')  # Python generated secret key token 

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }

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

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'HistoricalReservationID': self.HistoricalReservationID,
            'OrderNumber': self.OrderNumber,
            'Agency': self.Agency,
            'OrgID': self.OrgID,
            'CodeHierarchy': self.CodeHierarchy,
            'RegionCode': self.RegionCode,
            'RegionDescription': self.RegionDescription,
            'ParentLocationID': self.ParentLocationID,
            'ParentLocation': self.ParentLocation,
            'LegacyFacilityID': self.LegacyFacilityID,
            'Park': self.Park,
            'SiteType': self.SiteType,
            'UseType': self.UseType,
            'ProductID': self.ProductID,
            'InventoryType': self.InventoryType,
            'FacilityID': self.FacilityID,
            'FacilityZIP': self.FacilityZIP,
            'FacilityState': self.FacilityState,
            'FacilityLongitude': str(self.FacilityLongitude),
            'FacilityLatitude': str(self.FacilityLatitude),
            'CustomerZIP': self.CustomerZIP,
            'Tax': str(self.Tax),
            'UseFee': str(self.UseFee),
            'TranFee': str(self.TranFee),
            'AttrFee': str(self.AttrFee),
            'TotalBeforeTax': str(self.TotalBeforeTax),
            'Discount': str(self.Discount),
            'TotalPaid': str(self.TotalPaid),
            'StartDate': self.StartDate.strftime('%Y-%m-%d %H:%M:%S') if self.StartDate else None,
            'EndDate': self.EndDate.strftime('%Y-%m-%d %H:%M:%S') if self.EndDate else None,
            'OrderDate': self.OrderDate.strftime('%Y-%m-%d %H:%M:%S') if self.OrderDate else None,
            'Nights': self.Nights,
            'NumberOfPeople': self.NumberOfPeople,
            'EquipmentDescription': self.EquipmentDescription,
            'EquipmentLength': str(self.EquipmentLength)
        }

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

# PermitEntrance model
class PermitEntrance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    PermitEntranceID = db.Column(db.String(255), nullable=False)
    FacilityID = db.Column(db.String(255), nullable=False)
    PermitEntranceName = db.Column(db.String(255), nullable=False)
    PermitEntranceDescription = db.Column(db.Text)
    District = db.Column(db.String(255))
    Town = db.Column(db.String(255))
    PermitEntranceAccessible = db.Column(db.Boolean)
    Longitude = db.Column(db.Numeric(10, 7), nullable=False)
    Latitude = db.Column(db.Numeric(10, 7), nullable=False)
    GEOJSON = db.Column(db.JSON)
    CreatedDate = db.Column(db.DateTime, nullable=False)
    LastUpdatedDate = db.Column(db.DateTime, nullable=False)
    ATTRIBUTES = db.Column(db.Text)
    ENTITYMEDIA = db.Column(db.Text)
    ZONES = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'PermitEntranceID': self.PermitEntranceID,
            'FacilityID': self.FacilityID,
            'PermitEntranceName': self.PermitEntranceName,
            'PermitEntranceDescription': self.PermitEntranceDescription,
            'District': self.District,
            'Town': self.Town,
            'PermitEntranceAccessible': self.PermitEntranceAccessible,
            'Longitude': str(self.Longitude),
            'Latitude': str(self.Latitude),
            'GEOJSON': self.GEOJSON,
            'CreatedDate': self.CreatedDate.strftime('%Y-%m-%d %H:%M:%S') if self.CreatedDate else None,
            'LastUpdatedDate': self.LastUpdatedDate.strftime('%Y-%m-%d %H:%M:%S') if self.LastUpdatedDate else None,
            'ATTRIBUTES': self.ATTRIBUTES,
            'ENTITYMEDIA': self.ENTITYMEDIA,
            'ZONES': self.ZONES
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
@app.route('/home')
def home():
    return "NPS Express Pass"

@app.route('/purchase', methods=['POST'])
def purchase():
    data = request.json
    # Purchase logic here
    # Mock response for now
    return jsonify({"message": "Purchase successful"}), 200

# A route to handle the preflight OPTIONS request
@app.route('/', methods=['OPTIONS'])
def handle_options_request():
    # Set CORS headers for the OPTIONS request
    headers = {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': 86400 
    }
    return ('', 204, headers)

@app.route('/findapark')
def find_a_park():
    return render_template('findapark.html')

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not all(key in data for key in ('username', 'email', 'password')):
        return jsonify({'message': 'Missing required fields'}), 400

    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    new_user = User(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not all(key in data for key in ('email', 'password')):
        return jsonify({'message': 'Missing required fields'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user:
        return jsonify({'message': 'User not found!'}), 404

    if check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify({'message': 'Login successful', 'access_token': access_token}), 200
    else:
        return jsonify({'message': 'Incorrect password'}), 401
    
@app.route('/logout')
def logout():
    # Clear the session
    session.clear()
    # Redirect to home page
    return redirect(url_for('home'))


@app.route('/permits', methods=['GET', 'POST'])
@jwt_required()
def permits():
    if request.method == 'POST':
        data = request.get_json()
        user_id = get_jwt_identity()
        new_permit = PermitEntrance(**data)
        db.session.add(new_permit)
        db.session.commit()
        return jsonify(message='Permit added'), 201
    else:
        user_id = get_jwt_identity()
        permits = PermitEntrance.query.all()
        return jsonify(permits=[permit.to_dict() for permit in permits]), 200



@app.route('/search_campsite_reservations', methods=['GET'])
def search_campsite_reservations():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    if not start_date or not end_date:
        return jsonify({'message': 'Start date and end date are required'}), 400

    parks = [
        "Yellowstone National Park",
        "Yosemite National Park",
        "Rocky Mountain National Park",
        "Bryce Canyon National Park",
        "Hawaii Volcanoes National Park",
        "Great Smoky Mountains National Park",
        "Arches National Park",
        "Glacier National Park",
        "Joshua Tree National Park",
        "Grand Canyon National Park",
        "Zion National Park",
        "Mount Rushmore National Memorial",
        "Grand Teton National Park",
        "Sequoia National Park",
        "Denali National Park",
        "Badlands National Park",
        "Everglades National Park",
        "Death Valley National Park",
        "Acadia National Park",
        "Olympic National Park",
        "Shenandoah National Park",
        "Canyonlands National Park",
        "Petrified Forest National Park",
        "Mesa Verde National Park"
    ]

    try:
        response = requests.get('https://ridb.recreation.gov/api/v1/facilities', {
            'apikey': '6f0e166b-0807-4a4a-a1bb-fe9c10e60bd8',
            'activity': 'camping',
            'limit': 50,
            'start_date': start_date,
            'end_date': end_date
        })
        response.raise_for_status()
        data = response.json()
        filtered_reservations = [facility for facility in data['RECDATA'] if facility['FacilityName'] in parks]
        return jsonify(filtered_reservations), 200
    except requests.exceptions.RequestException as e:
        print(e)
        return jsonify({'message': 'Error fetching reservations'}), 500



    response = requests.get(api_url, params=params)
    data = response.json()

    for item in data['RECDATA']:
        new_permit_entrance = PermitEntrance(
            PermitEntranceID=item['PermitEntranceID'],
            FacilityID=item['FacilityID'],
            PermitEntranceName=item['PermitEntranceName'],
            PermitEntranceDescription=item.get('PermitEntranceDescription', ''),
            District=item.get('District', ''),
            Town=item.get('Town', ''),
            PermitEntranceAccessible=item.get('PermitEntranceAccessible', False),
            Longitude=item['Longitude'],
            Latitude=item['Latitude'],
            GEOJSON=json.dumps(item.get('GEOJSON', {})),
            CreatedDate=datetime.strptime(item['CreatedDate'], '%Y-%m-%dT%H:%M:%S'),
            LastUpdatedDate=datetime.strptime(item['LastUpdatedDate'], '%Y-%m-%dT%H:%M:%S'),
            ATTRIBUTES=str(item.get('ATTRIBUTES', '')),
            ENTITYMEDIA=str(item.get('ENTITYMEDIA', '')),
            ZONES=str(item.get('ZONES', ''))
        )
        db.session.add(new_permit_entrance)
        db.session.commit()

    return jsonify(message='Permit entrances data fetched and stored'), 200

@app.route('/fetch_campsites', methods=['GET'])
def fetch_campsites():
    api_url = 'https://ridb.recreation.gov/api/v1/campsites'
    params = {
        'apikey': '6f0e166b-0807-4a4a-a1bb-fe9c10e60bd8',
        'limit': 10 
    }

    response = requests.get(api_url, params=params)
    data = response.json()

    for item in data['RECDATA']:
        campsite = Campsite(
            CampsiteID=item['CampsiteID'],
            FacilityID=item['FacilityID'],
            CampsiteName=item['CampsiteName'],
            CampsiteType=item['CampsiteType'],
            TypeOfUse=item['TypeOfUse'],
            CampsiteAccessible=item.get('CampsiteAccessible', False),
            CampsiteLongitude=item.get('CampsiteLongitude'),
            CampsiteLatitude=item.get('CampsiteLatitude'),
            CreatedDate=datetime.strptime(item['CreatedDate'], '%Y-%m-%dT%H:%M:%S'),
            LastUpdatedDate=datetime.strptime(item['LastUpdatedDate'], '%Y-%m-%dT%H:%M:%S'),
            ATTRIBUTES=str(item.get('ATTRIBUTES', '')),
            PERMITTEDEQUIPMENT=str(item.get('PERMITTEDEQUIPMENT', '')),
            ENTITYMEDIA=str(item.get('ENTITYMEDIA', ''))
        )
        db.session.add(campsite)
        db.session.commit()

    return jsonify(message='Campsites data fetched and stored'), 200

@app.route('/user_data', methods=['GET'])
@jwt_required()
def user_data():
    email = request.args.get('email')
    user = User.query.filter_by(email=email).first()
    
    if not user:
        return jsonify(message='User not found'), 404
    
    user_id = user.id
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    reservation_query = Reservation.query.filter_by(user_id=user_id)
    if start_date:
        reservation_query = reservation_query.filter(Reservation.StartDate >= datetime.strptime(start_date, '%Y-%m-%d'))
    if end_date:
        reservation_query = reservation_query.filter(Reservation.EndDate <= datetime.strptime(end_date, '%Y-%m-%d'))
    reservations = reservation_query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify(
        reservations=[reservation.to_dict() for reservation in reservations.items]
    ), 200

@app.route('/update_user', methods=['PUT'])
@jwt_required()
def update_user():
    data = request.get_json()
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify(message='User not found'), 404

    if 'username' in data:
        user.username = data['username']
    if 'email' in data:
        user.email = data['email']
    if 'password' in data:
        user.password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    
    db.session.commit()
    return jsonify(message='User information updated successfully'), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
