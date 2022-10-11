FROM nikolaik/python-nodejs:python3.7-nodejs14

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN pip install pandas
RUN pip install kaleido
RUN pip install plotly
RUN pip install requests

RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libzip-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    libaio1 wget && apt-get clean autoclean && apt-get autoremove --yes &&  rm -rf /var/lib/{apt,dpkg,cache,log}/ \
CMD [ "node", "./index.js"]