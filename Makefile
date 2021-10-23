compile:
	yarn compile

game:
	yarn compile
	yarn build

cleanup:
	rm .env

test:
	echo UNIT_TEST=true >> .env
