[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/QuestioWo/test-django-full-stack.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/QuestioWo/test-django-full-stack/context:javascript) 
[![Language grade: Python](https://img.shields.io/lgtm/grade/python/g/QuestioWo/test-django-full-stack.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/QuestioWo/test-django-full-stack/context:python)

# Nouvique
A web application built for the WAD2 course that is meant to fill the gap in the store front market of supporting small unique businesses and helping them grow through interactions with their customers and peers

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
