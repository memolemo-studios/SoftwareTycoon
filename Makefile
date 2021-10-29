## Cleans up the entire temp dirs and run `make game` ##
recompile:
	make cleanup
	make game

## Compiles the entire project ##
compile:
	yarn compile

## Builds .rbxlx file (ignores if it is compiled or not) ##
file:
	yarn build

## Compiles and build .rbxlx file ##
game:
	make compile
	make file

## Cleans up unnecessary files ##
cleanup:
	- rm -rd out
	- rm .env
	- rm current_branch

## Makes a unit test environment ##
test-env:
	echo UNIT_TEST=true >> .envs
