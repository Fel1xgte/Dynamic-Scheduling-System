from flask import Flask
from flask_cors import CORS
import os
from .database import init_db

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Configure upload folder
    app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
    app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024  # 2MB max file size
    
    # Create uploads directory if it doesn't exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Initialize database
    with app.app_context():
        init_db()
    
    # Register blueprints
    from .routes import main
    app.register_blueprint(main)
    
    return app 