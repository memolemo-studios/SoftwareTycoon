# Changelog (master)

## 0.0.1-alpha.5 (11/25/2021)

**NOTE**: This is a partial refactor updated version as of now.
The entire game will be entirely refactored after 0.0.1-alpha.6

**Global**:
- **Entire codebase has been refactored again**
- Errors are no longer classified as classes
- Switched from `@rbxts/roact-hooks` to `@rbxts/roact-hooked`
- Added `GameFlags` feature (inspired by ROBLOX's FFlag feature)
- Revamped the entire Roact component modules
- Added `LocalStorage` system for replicating player's own replicated container
- Cmdr is in the game!
- All remotes in this game are now using `@rbxts/net`
- Updated to Flamework 1.0.0-beta.2

**Code Environment**:
- Fixed issues in `.editorconfig` file
- Fixed linting issues in Prettier caused by styling from configured EditorConfig
- `.env` will not be deleted in `make cleanup` command
- Changed `services` to `luau` (to avoid confusion and make things simpler)
- Fixed `yarn start` command typo
- Updated to `rbxts-transformer-fs` v1.1.2

## 0.0.1-alpha.4 (11/03/2021)

**Client**:
- Added `CameraController` for camera mainpulation purposes
	- Added scriptable camera classes
- Placement system is not completed yet added
- Added `OnCharacterDied` hook interface
	- Only triggers when the character dies
- Refinements and bug fixes on UI components

**Global**:
- Added default configurations for scriptable cameras
- Added `BuilderService` (not completed)

## 0.0.1-alpha.3 (10/30/2021)

**Global**:
- **Entire codebase has been refactored**
- Added `SoundManager` and `AssetManager`
	- Responsible for handling asset and sounf stuff to the game
- Added `assets/audio` directory (*where I can keep all of my audio files*)
- Added `config` directory (*for game configurations*)
- Result and Option serialization modules are separated to `@memolemo-studios/result-option-ser` package
- Added latency system for lag detection (*kind of useless service but it can be useful in the future*)
- Revised some error classes?

**Client**:
- Added `CharacterController`
	- Handling character from the client
- Added `AppController` (*responsible for connected app components*)

## 0.0.1-alpha.2 (10/27/2021)

### Patched version
- Fixed `map.spec.ts` failed to pass during the unit tests
- `**/*.lua` files are excluded to Prettier and ESLint
- [Overlap issue](https://github.com/memolemo-studios/SoftwareTycoon/commit/78a90d0cb9f5009ce1f8a5391442a5b3e08d515d)

### Initial version
- Added user interface (using Roact)
    - Loading UI
    - MainMenu and Main (not completed yet)
- Added Flamework controllers
    - CoreGuiController (used for handling CoreGui)
- Added useful `linesofcode` script in package.json to view total lines of code in any TypeScript files only.
- Added [wiki](https://github.com/memolemo-studios/SoftwareTycoon/wiki) for building a game (Linux is only written there as of now)

## 0.0.1-alpha.1 (10/26/2021)
- Initial alpha staging release
