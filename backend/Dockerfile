FROM python:3.8

# installing nodeJS
RUN apt-get update
RUN apt-get -y install nodejs npm
RUN npm i npm@latest -g

# application directory
WORKDIR /app

# installing python modules
COPY ./requirements.txt ./
ENV VIRTUAL_ENV=/app/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH "$VIRTUAL_ENV/bin:$PATH"
ENV PYTHONPATH "$VIRTUAL_ENV/bin:$PYTHONPATH"
RUN $VIRTUAL_ENV/bin/python -m pip install -r requirements.txt 

# installing node modules
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install

COPY ./ ./

EXPOSE 5000

CMD ["npm", "start"]