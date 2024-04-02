# app.py
from flask import Flask, render_template, request, redirect, url_for, session, send_file
import boto3
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'users.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'wheiah373648362hew272636'

db = SQLAlchemy(app)
# db.init_app(app)
from models import User  # Import the User model

# Your existing routes and functions

# Configure AWS credentials and region
polly_client = boto3.client('polly', region_name='us-east-1', aws_access_key_id='AKIA6GBMHRD3EHBHCBMT', aws_secret_access_key='3gZMfTxZGXaW6Db8yBQRvAKyY3pNrk/cdTVtcAYN')

# from flask import Flask, render_template, request, redirect, url_for, session

# app.secret_key = 'your_secret_key'  # Replace with a secure secret key

# ... (your existing code)

# Sample user data (you'll need to replace this with a proper database or user management system)
# users = {
#     'admin': {
#         'password': 'password',
#         'email': 'admin@example.com'
#     }
# }

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = User.query.filter_by(username=username).first()
        if user and user.password == password:
            session['username'] = username
            return redirect(url_for('index'))
        else:
            return render_template('login.html', error='Invalid username or password.')

    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']

        # Check if the username is already taken
        if User.query.filter_by(username=username).first():
            return render_template('signup.html', error='Username already taken.')

        # Check if the email is already taken
        if User.query.filter_by(email=email).first():
            return render_template('signup.html', error='Email already registered.')

        # Check if the passwords match
        if password != confirm_password:
            return render_template('signup.html', error='Passwords do not match.')

        # Add the new user to the database
        new_user = User(username=username, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()

        # Redirect to the login page after successful signup
        return redirect(url_for('login'))

    return render_template('signup.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        text = request.form.get('text', '')
        voice_id = request.form.get('voice_id', 'Joanna')  # Default to Joanna
        language_code = request.form.get('language_code', 'en-US')  # Default to English (US)
        engine = request.form.get('engine', 'standard')  # Default to standard engine

        if text:
            try:
                response = polly_client.synthesize_speech(Text=text, OutputFormat='mp3', VoiceId=voice_id, LanguageCode=language_code, Engine=engine)
                filename = "speech.mp3"
                with open(filename, 'wb') as file:
                    file.write(response['AudioStream'].read())
                return send_file(filename, mimetype='audio/mpeg', as_attachment=True, download_name='grod.mp3')
            except polly_client.exceptions.InvalidVoiceIdException:
                return render_template('index.html', error='Invalid voice ID for the selected engine.')
            except polly_client.exceptions.UnsupportedLanguageException:
                return render_template('index.html', error='Unsupported language for the selected voice.')

    # Retrieve available voices and languages
    response = polly_client.describe_voices()
    voices = response['Voices']

    # Filter voices by engine
    standard_voices = [voice for voice in voices if 'Standard' in voice['SupportedEngines']]
    neural_voices = [voice for voice in voices if 'Neural' in voice['SupportedEngines']]

    # Get unique language codes
    language_codes = set([voice['LanguageCode'] for voice in voices])

    return render_template('index.html', standard_voices=standard_voices, neural_voices=neural_voices, language_codes=language_codes)

@app.errorhandler(404)
def not_found(e):
    return render_template("404.html"), 404

# if __name__ == '__main__':
#     app.run(debug=True)