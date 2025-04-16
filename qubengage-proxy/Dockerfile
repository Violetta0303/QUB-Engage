FROM php:7.2-apache
COPY src/ /var/www/html/

RUN apt-get update && apt-get install -y cron

COPY src/serviceChecker.php /path/to/serviceChecker.php
RUN (crontab -l ; echo "* * * * * /usr/local/bin/php /path/to/serviceChecker.php >> /var/log/serviceChecker.log 2>&1") | crontab

COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]