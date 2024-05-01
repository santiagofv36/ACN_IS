## Pasos para ejecutar el docker

### Asegurate de tener docker Desktop instalado y corriendo en tu maquina

```bash
  docker compose up
```

Esto genera las imagenes y los contenedores de Docker con la aplicacion compilada
Genera dos contenedores
1.- Para la BD llamado react-ventas-bd
2.- Para la aplicación react-ventas-web

```bash
  docker exec -it react-ventas-db bin/bash
```
Esto abre una terminal de bash del contenedor de la bd

```bash
  opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P Passowrd@12345# -d master -q "$(cat docker-entrypoint-initdb.d/init.sql)"
```

Este comando tiene que ser ejecutado en la terminal de Bash del contenedor de la bd `react-ventas-bd` y lo que hace es agarrar el .sql y ejecuta el script para crear la base de datos
