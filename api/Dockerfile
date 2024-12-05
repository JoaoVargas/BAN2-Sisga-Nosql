ARG API_IMAGE

FROM ${API_IMAGE}
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV FLASK_APP=app.py
VOLUME /api
WORKDIR /api
COPY . .
RUN apt-get update \
    && apt-get -y install libpq-dev gcc
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
# CMD ["flask", "--app", "app.py", "--debug", "run"]
CMD ["python", "app.py"]
