ARG FRONTEND_IMAGE

FROM ${FRONTEND_IMAGE}
VOLUME /frontend
WORKDIR /frontend
COPY . .
RUN apt update -y && apt upgrade -y
RUN npm install vite
RUN npm install
CMD npm install ; npm run dev