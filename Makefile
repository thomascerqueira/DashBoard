all:
	MODE=${MODE} docker-compose up

runServ:
	MODE=${MODE} docker-compose up server

buildServ:
	MODE=${MODE} docker-compose up --build server

runDash:
	docker-compose up dash

buildDash:
	docker-compose up --build dash