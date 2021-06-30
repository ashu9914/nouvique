cd backend

virtualenv --python=$(which python3.8) venv
. ./venv/bin/activate

pip3 install -r requirements.txt

python3 manage.py makemigrations backend
python3 manage.py migrate
python3 manage.py runserver localhost:8000