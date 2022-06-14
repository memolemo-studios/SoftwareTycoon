SRC             = $(wildcard ./src/*.lua) $(wildcard ./ci/*.lua)

RBXTS_PATH      = ./node_modules/@rbxts/

PACKAGE_SPECS   = $(wildcard $(RBXTS_PATH)/**/**/*.spec.lua)
PACKAGE_SPECS   += $(wildcard $(RBXTS_PATH)/**/**/**/*.spec.lua)
PACKAGE_SPECS   += $(wildcard $(RBXTS_PATH)/**/**/**/**/*.spec.lua)

rm-pkg-specs:
	rm -rf $(PACKAGE_SPECS)

fmtchk:
	stylua --check $(SRC)

fmtfix:
	stylua $(SRC)
