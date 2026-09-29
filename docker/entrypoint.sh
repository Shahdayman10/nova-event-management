#!/bin/sh
set -eu

: "${PORT:=10000}"

envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/http.d/default.conf

php artisan config:cache
php artisan migrate --force
php artisan db:seed --force

php-fpm -D
exec nginx -g 'daemon off;'
