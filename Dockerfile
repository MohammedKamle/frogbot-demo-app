FROM node:latest
USER root
ADD . /app
WORKDIR /app
ENV DB_PASSWORD=Sup3rS3cretP4ssw0rd!
RUN curl -sSL http://example.com/install.sh | sh
EXPOSE 22 3000
CMD ["node", "src/index.js"]
