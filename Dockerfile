FROM nginx:1.27-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config for the container
COPY nginx.site.conf /etc/nginx/conf.d/default.conf

# Copy static website files
COPY . /usr/share/nginx/html/

# Remove deployment/config files from the served directory
RUN rm -f /usr/share/nginx/html/Dockerfile \
          /usr/share/nginx/html/docker-compose.yml \
          /usr/share/nginx/html/nginx.site.conf \
          /usr/share/nginx/html/.dockerignore \
          /usr/share/nginx/html/DEPLOYMENT.md \
          /usr/share/nginx/html/API_HTML_INTEGRATION_GUIDE.js \
          /usr/share/nginx/html/API_IMPLEMENTATION_PLAN.md \
          /usr/share/nginx/html/WEBSITE_API_IMPLEMENTATION_GUIDE.md \
          /usr/share/nginx/html/content.json

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/index.html || exit 1
