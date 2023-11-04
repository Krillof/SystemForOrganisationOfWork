Т.к. мы используем Neo4j, то при изменении модели в коде нужно вводить
python manage.py install_labels

########### Neo4j
Запустите БД Neo4j



########### Django server
#### Installed:
neomodel
django-neomodel
django-cors-headers
djangorestframework
jsonpickle


#### To run:
Чтобы запустить сервер: (Находясь в папке проекта)
cd server
.\env\Scripts\activate
python manage.py runserver


########### React client
#### To run:
Чтобы запустить клиент на React: (Находясь в папке проекта)
cd client
npm run start