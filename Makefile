compile:
	yarn compile

game:
	yarn compile
	yarn build

cleanup:
	rm .env

test-env:
	echo UNIT_TEST=true >> .env
