Т.к. мы используем Neo4j, то при изменении модели в коде нужно вводить
python manage.py install_labels

Запустите БД Neo4j

Чтобы запустить сервер: (Находясь в папке проекта)
cd server
.\env\Scripts\activate
python manage.py runserver

Чтобы запустить клиент на React: (Находясь в папке проекта)
cd client
npm run start