error("Please use mantle!")

local STAGING_PLACE_ID = 6884566256 -- respect us pls
local PRODUCTION_PLACE_ID = 0

-- Load the repository's built game file
local game = remodel.readPlaceFile("./build.rbxlx")

-- Load all of the ci arguments
local args = { ... }
local env = args[1] or (remodel.readFile("./current_branch") == "release" and "production" or "staging")
assert(env == "production" or env == "staging", "Invalid environment argument!")

local place_id = args[1] == "production" and PRODUCTION_PLACE_ID or STAGING_PLACE_ID

-- Time to publish this place!
local startTime = os.clock()

print(("Starting to publish to place '%d'"):format(place_id))
remodel.writeExistingPlaceAsset(game, place_id)

local duration = os.clock() - startTime
print(("Finished publishing place '%d' in %s seconds"):format(place_id, tostring(duration)))
