# test-django-full-stack
Test/placeholder for a full-stack web app using Django and React, created in preperation for the Web-Application Development group project.

## Running

```bash
# running back end
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
