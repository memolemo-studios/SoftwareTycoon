recompile:
	make cleanup
	make game

compile:
	yarn compile

file:
	yarn build

game:
	make compile
	make file

cleanup:
	- rm -rd out
	- rm .env
	- rm current_branch

test-env:
	echo UNIT_TEST=true >> .envs
