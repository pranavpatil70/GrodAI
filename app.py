    # app.py
from flask import Flask, render_template, request, redirect, url_for, session, send_file
import os
import boto3
    # from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user


app = Flask(__name__)
app.secret_key = os.urandom(24)

polly_client = boto3.client('polly', region_name='us-east-1', aws_access_key_id='AKIA6GBMHRD3EHBHCBMT', aws_secret_access_key='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')

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/index', methods=['GET', 'POST'])
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

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        # Handle signup logic here
        return render_template('signup.html')
    return render_template('signup.html')

@app.route('/redirect-after-signin', methods=['POST'])
def redirect_after_signin():
    # Perform any necessary server-side processing or validation
    # ...

    # Check if the user is authenticated
    if 'user_id' in session:
        # Redirect to the index route
        return redirect(url_for('index'))
    else:
        # Redirect to the login page or handle the case when the user is not authenticated
        return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Handle login logic here
        # If the authentication is successful, set the user_id in the session
        user_id = 'user123'  # Replace with the actual user ID
        session['user_id'] = user_id
        return redirect(url_for('index'))
    return render_template('login.html')

@app.route('/logout')
def logout():
    # Remove the user's authentication information from the session
    session.pop('user_id', None)
    return redirect(url_for('index'))

    # @app.errorhandler(404)
    # def not_found(e):
    #     return render_template("404.html")

# if __name__ == '__main__':
#         app.run(debug=True)