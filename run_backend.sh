cd backend

mkvirtualenv --python=$(which python3.8) django-venv
workon django-venv

pip3 install -r requirements.txt

python3 manage.py makemigrations backend
python3 manage.py migrate
python3 manage.py runserver localhost:8000