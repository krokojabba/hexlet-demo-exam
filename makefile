start-db:
	docker run --name postgres -e POSTGRES_PASSWORD=1234 -v ./db/storage:/var/lib/postgresql/data -v ./db/scripts:/tmp/scripts -p 5432:5432 -d postgres

stop-db:
	docker stop postgres
	docker rm postgres

connect-db:
	docker exec -it postgres psql -U postgres

create-db:
	docker exec -it postgres psql -U postgres -a -f '/tmp/scripts/demo.ddl'
