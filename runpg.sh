ROOT_DIR=$(pwd)
PG_DATA="$ROOT_DIR/data/postgres"

mkdir -p "$PG_DATA"


docker start addallthethings || docker run -d --name addallthethings -p 5432:5432 -e POSTGRES_USER=addallthethings -e POSTGRES_PASSWORD=localhost -e POSTGRES_DB=addallthethings_db -e PGDATA=/var/lib/postgresql/data -v $PG_DATA:/var/lib/postgresql/data postgres:11