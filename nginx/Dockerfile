
# ---------------------------------------
# Building stage
# ---------------------------------------
    FROM node:20-alpine AS builder

    RUN apk add tzdata && rm -rf /var/cache/apk/*
    
    ENV TZ=Africa/Addis_Ababa
    
    ENV NODE_ENV build
    
    RUN mkdir -p /home/apps/{admin,customer}
    
    WORKDIR /home/apps
    
    COPY   apps/package*.json ./
    
    RUN npm i --legacy-peer-deps && npm cache clean --force
    
    COPY  apps/ .
    
    RUN npm run build && \
        npm prune npm prune --omit=dev --legacy-peer-deps
    
    # ---------------------------------------
    # Production stage
    # ---------------------------------------
    
    FROM nginx:1.23.2-alpine AS production
    
    RUN apk add --no-cache nodejs tzdata certbot && rm -rf /var/cache/apk/*
    # Tini is now available at /sbin/tini
    
    ENV NODE_ENV production
    ENV TZ Africa/Addis_Ababa
    
    # Copy renew
    COPY ./nginx/renew /renew
    RUN chmod +x /renew
    
    # Copy entrypoint
    COPY ./nginx/entrypoint.sh /entrypoint.sh
    RUN chmod +x /entrypoint.sh
    
    # nginx config
    COPY ./nginx/nginx.conf.template  /etc/nginx/nginx.conf.template
    
    ENV PORT 80
    
    COPY --from=builder /home/apps/dist /usr/share/nginx/html
    
    ENTRYPOINT [ "../entrypoint.sh" ]

