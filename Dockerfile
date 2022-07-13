FROM nginx

ARG project_dir=/
ENV env_project_dir=${project_dir}

RUN mkdir -p /app

WORKDIR /app

COPY dist/ /app/dist/

RUN mkdir -p /usr/share/nginx/html/${env_project_dir}

RUN cp -rf /app/dist/* /usr/share/nginx/html/${env_project_dir}/


# 运行 Nginx 服务器
CMD ["nginx", "-g", "daemon off;"]
