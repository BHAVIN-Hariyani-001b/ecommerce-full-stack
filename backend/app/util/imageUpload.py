import os
import uuid
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif','webp','mp4'}

def allowed_file(filename):
    """Check if the uploaded file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_image(file, UPLOAD_FOLDER):
    """Save an uploaded image file to the specified upload folder."""
    if not file or file.filename == '':
        return None
    
    if not allowed_file(file.filename):
        return None
    
    img_folder = os.path.join(os.path.dirname(__file__), UPLOAD_FOLDER)
    image_folder = os.path.abspath(img_folder)
    print(image_folder)

    try:
        os.makedirs(image_folder, exist_ok=True)
    except Exception as e:
        print(f"Error creating directory: {e}")
        return None
    
    filename = secure_filename(file.filename)
    random_filename = f"{uuid.uuid4()}.{filename.split('.')[1]}"
    file_path = os.path.join(image_folder, random_filename)

    try:
        file.save(file_path)
    except Exception as e:
        print(f"Error saving file: {e}")
        return None
   
    return random_filename