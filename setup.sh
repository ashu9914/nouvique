cd backend
mkvirtualenv venv --python=$(which python3.7)
workon venv
pip install -r requirements.txt
python manage.py makemigrations backend
python manage.py migrate

cd ..

cd frontend/
npm install
npm run build