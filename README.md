[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/QuestioWo/test-django-full-stack.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/QuestioWo/test-django-full-stack/context:javascript) 
[![Language grade: Python](https://img.shields.io/lgtm/grade/python/g/QuestioWo/test-django-full-stack.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/QuestioWo/test-django-full-stack/context:python)

# Nouvique
A web application built for the WAD2 course that is meant to fill the gap in the store front market of supporting small unique businesses and helping them grow through interactions with their customers and peers

## Running Locally

```bash
# running backend
. run_backend.sh y

# running frontend
cd frontend
npm install # only required for first time
npm start
```

## Deployment

GitHub Actions will automatically create a zipped release file for every commit that is merged into the `main` branch. After this release file is generated, inside of the `clone`d repo in a PythonAnywhere bash console run:

```bash
. deploy_pythonanywhere.sh
```

## APIs used

Stripe API version `2020-08-27`

## Backend/Django Libraries and Packages Used

Output of `pip freeze`, also viewable in `backend/requirements.txt`:
```
asgiref==3.3.4
bcrypt==3.2.0
certifi==2021.5.30
cffi==1.14.6
charset-normalizer==2.0.4
Django==3.2.4
django-cors-headers==3.7.0
djangorestframework==3.12.4
djangorestframework-simplejwt==4.7.2
idna==3.2
pycountry==20.7.3
pycparser==2.20
PyJWT==2.1.0
pytz==2021.1
requests==2.26.0
six==1.16.0
sqlparse==0.4.1
stripe==2.60.0
urllib3==1.26.6
```

## Frontend/React/npm Libraries and Packages Used

Output of `npm list`:
```
nouvique@0.1.0 nouvique/frontend
├── @stripe/react-stripe-js@1.4.1
├── @stripe/stripe-js@1.16.0
├── @testing-library/jest-dom@5.14.1
├── @testing-library/react@11.2.7
├── @testing-library/user-event@12.8.3
├── @types/enzyme@3.10.9
├── @types/jest@26.0.23
├── @types/node@12.20.15
├── @types/react-bootstrap@0.32.26
├── @types/react-dom@17.0.7
├── @types/react-router-bootstrap@0.24.5
├── @types/react-router-dom@5.1.7
├── @types/react-test-renderer@17.0.1
├── @types/react@17.0.11
├── @wojtekmaj/enzyme-adapter-react-17@0.6.3
├── axios@0.21.1
├── bootstrap@5.0.2
├── enzyme@3.11.0
├── neverthrow@4.2.1
├── react-bootstrap@2.0.0-beta.2
├── react-dom@17.0.2
├── react-icons@4.2.0
├── react-router-bootstrap@0.25.0
├── react-router-dom@5.2.0
├── react-scripts@4.0.3
├── react-test-renderer@17.0.2
├── react@17.0.2
├── typescript@4.3.2
└── web-vitals@1.1.2
```
