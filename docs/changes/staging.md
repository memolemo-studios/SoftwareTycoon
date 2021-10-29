# Changelog (master)

## 0.0.1-alpha.3

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

## 0.0.1-alpha.2

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

## 0.0.1-alpha.1
- Initial alpha staging release
