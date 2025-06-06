FROM nginx:alpine

# Copy the HTML file
COPY index.html /usr/share/nginx/html/index.html

# Copy the CSS file
COPY cleannshine.css /usr/share/nginx/html/savaleting.css

# Copy the JavaScript file
COPY script.js /usr/share/nginx/html/savaleting.js

# Copy the images
COPY cleannshine.jpg /usr/share/nginx/html/officalLogoSa.jpeg
# Expose port 80
EXPOSE 80
