# The reason why I commit this too much because I wanted to check
# if I could successfully authenticate something in Linux

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
