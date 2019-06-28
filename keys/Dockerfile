FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf cert.pem key.pem /etc/nginx/conf.d/

