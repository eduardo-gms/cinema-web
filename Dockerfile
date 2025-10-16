# Use a lightweight web server
FROM nginx:alpine

# Copia APENAS o conteúdo da pasta 'app' para o diretório público do Nginx
COPY ./app/ /usr/share/nginx/html

# Expose port 80 to allow external access to the application
EXPOSE 80

# The command to start the web server when the container starts
CMD ["nginx", "-g", "daemon off;"]