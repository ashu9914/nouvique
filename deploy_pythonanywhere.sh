# save old database
cp release/backend/db.sqlite3 .

# remove old version
rm release.zip
rm -r release

# download newest
wget https://github.com/QuestioWo/nouvique/releases/download/latest/release.zip

# setup release
unzip release.zip

# move in old database
cp db.sqlite3 release/backend/

# setup backend + dependencies
cd release
cp backend/backend/wsgi.py /var/www/
mv /var/www/wsgi.py /var/www/nouvique_pythonanywhere_com_wsgi.py
. run_backend.sh n
