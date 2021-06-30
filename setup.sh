cd backend
mkvirtualenv venv --python=/usr/bin/python3.6
workon venv
pip install -r requirements.txt
python manage.py makemigrations backend
python manage.py migrate

cd ..

cd frontend/
npm run build