# Changelog

### [1.1.1](https://www.github.com/unsoon/rate-limit/compare/v1.1.0...v1.1.1) (2024-03-03)


### Bug Fixes

* make RateLimit decorator accept an optional config parameter ([6ac3653](https://www.github.com/unsoon/rate-limit/commit/6ac36536523babfb1cdad0353f05931031b3758e))

## [1.1.0](https://www.github.com/unsoon/rate-limit/compare/v1.0.0...v1.1.0) (2023-06-22)


### Features

* add field to include rate limit headers in response ([abe90d3](https://www.github.com/unsoon/rate-limit/commit/abe90d30cf8389f876414853636e3fae925df3ba))
* **guard:** add ws support and option to control rt headers ([2c15116](https://www.github.com/unsoon/rate-limit/commit/2c15116dbf0f057607f14ce5318e71f60ae420d4))


### Bug Fixes

* add write-all permission ([2e709f7](https://www.github.com/unsoon/rate-limit/commit/2e709f752f2fddc301e4dfe5384601fe5845f678))

## 1.0.0 (2023-06-21)


### Features

* add ability to set custom rate limit store ([adfffa0](https://www.github.com/unsoon/rate-limit/commit/adfffa04f3bb64848a185b2871b2167db10c0089))
* add abstract class for rate limit stores ([748d840](https://www.github.com/unsoon/rate-limit/commit/748d840505f24d264d7864c7221bee781886b049))
* add constants for rate limiting configuration ([61f0026](https://www.github.com/unsoon/rate-limit/commit/61f002651c0a3085f152a648533e9042eca0e3ed))
* add decorator to allow skipping rate limiting ([11ad94e](https://www.github.com/unsoon/rate-limit/commit/11ad94e6589e34ecb53ae2722d1363d67868c1b9))
* add exports for rate-limit related modules and stores ([29e4a08](https://www.github.com/unsoon/rate-limit/commit/29e4a08542b641e71b5a3f4ffc079cce935f3e7b))
* add exports for rate-limit types ([b7d7adc](https://www.github.com/unsoon/rate-limit/commit/b7d7adc0729d80da5f7839d2abca0869a931848a))
* add guard to handle rate limiting requests ([f35038b](https://www.github.com/unsoon/rate-limit/commit/f35038bbbe3dad8a2c5158f480a8f2f687ef1cae))
* add memory store export from index file ([52d4a41](https://www.github.com/unsoon/rate-limit/commit/52d4a41169992c0bb301aaa6ab59453889f28444))
* add redis store implementation ([0cec104](https://www.github.com/unsoon/rate-limit/commit/0cec10423869df7073c8d2365b9de244cd0f1593))
* add support for async config of rate limit module ([20057bb](https://www.github.com/unsoon/rate-limit/commit/20057bb430edd48b8969959906d5981b3e646a95))
* add support for passing configs as a parameter to decorator ([f219619](https://www.github.com/unsoon/rate-limit/commit/f219619829e5f7ef29946b29fc2314fbb774022c))
* create exception class to throw error with custom message ([38f7958](https://www.github.com/unsoon/rate-limit/commit/38f795838775bee58d0f48ab0861f694d703b905))
* create in-memory store ([80a2ef8](https://www.github.com/unsoon/rate-limit/commit/80a2ef8d4595490ce11cc75548daef18a6693fe9))
* create rate limit dynamic module ([dad7c67](https://www.github.com/unsoon/rate-limit/commit/dad7c67b3b2b4c175bb6081d0d515de001f3762c))
* define async config of rate limiting options ([b3dbc58](https://www.github.com/unsoon/rate-limit/commit/b3dbc58f5dd0d02cb07ac37d0ad913a4175ae550))
* define rate limit options and configuration ([8f3da9a](https://www.github.com/unsoon/rate-limit/commit/8f3da9a8b95b7a18ab84143fbc05d6ca529d357a))
* define rate limit store values interface ([8f83bbc](https://www.github.com/unsoon/rate-limit/commit/8f83bbcefbdcf1496b0a635c3926d0ea46a75824))
* generate nestjs project ([4ab77f7](https://www.github.com/unsoon/rate-limit/commit/4ab77f75c7a5a1dd8d379b441568cdd584847687))
* implement rate limiting service ([1148045](https://www.github.com/unsoon/rate-limit/commit/11480451ca7209eeb80853bfcf39040bdb27c92c))


### Miscellaneous

* add "main" and "types" fields to specify the entry point ([ebdf88b](https://www.github.com/unsoon/rate-limit/commit/ebdf88b9e1d651266e5caecc10626bc61e04d1be))
* add changelog-types field for config release notes ([0e5563a](https://www.github.com/unsoon/rate-limit/commit/0e5563a8b40ba88f8fcbb7c0fddd4d600156162c))
* add commitlint config ([4305db8](https://www.github.com/unsoon/rate-limit/commit/4305db8352ceaa02684336e0bbe893213ae997b2))
* add husky commit-msg hook ([adbd060](https://www.github.com/unsoon/rate-limit/commit/adbd06037635f0c4d157e15273bbadc6e23132db))
* add husky pre-commit hook ([ee5f53c](https://www.github.com/unsoon/rate-limit/commit/ee5f53c1e02f0d20170325878e0837351c635d50))
* add mit license to the project ([becbe3f](https://www.github.com/unsoon/rate-limit/commit/becbe3f116225496710bf96984ca2ca6fec905dc))
* add package description and author information ([30cfaa7](https://www.github.com/unsoon/rate-limit/commit/30cfaa7d614eb14dee764f9da3c79501c906a80f))
* add repository, bugs and homepage fields ([b3dd2ff](https://www.github.com/unsoon/rate-limit/commit/b3dd2ff5803e4965305e391d36fc39f6d87b6207))
* add target-branch field to dependabot configuration ([047d536](https://www.github.com/unsoon/rate-limit/commit/047d536112b8f477bbba4299db395a133b6fbc52))
* change prettierrc file format ([0bb1b02](https://www.github.com/unsoon/rate-limit/commit/0bb1b0214e70dc1a55e63bd9c10d899a998beb55))
* disable '@typescript-eslint/no-non-null-assertion' rule ([d6e71d7](https://www.github.com/unsoon/rate-limit/commit/d6e71d7083aef2c55a1d0ee7fdd35d91d19019c4))
* enable strict null checks option ([34b772b](https://www.github.com/unsoon/rate-limit/commit/34b772bcc9b708a0eb9b5b1b53fd0330cb3af016))
* include only dist folder in the package distribution ([01e1149](https://www.github.com/unsoon/rate-limit/commit/01e1149a4e357b4e897d4068b09e528a7ce42daf))
* initial commit ([4c094f4](https://www.github.com/unsoon/rate-limit/commit/4c094f428f8c886df447a6c6e00e120c3eb37e61))
* move jest configuration to separate file ([a726bdc](https://www.github.com/unsoon/rate-limit/commit/a726bdcc3a015f241d363a53d61aa9c2a1b08cd0))
* **package:** change license field, add keywords ([e83ca9b](https://www.github.com/unsoon/rate-limit/commit/e83ca9bb7bf99ab09831277409a299e533610790))
* set project as public ([a768f1a](https://www.github.com/unsoon/rate-limit/commit/a768f1ac738a21aa8d4836f2ec8b2d2315f0c7f5))
* **tsconfig.json:** enable strict mode ([e762629](https://www.github.com/unsoon/rate-limit/commit/e76262983b90795c8859e26457adc792e503c4f8))
* update package name to include organization scope ([601a432](https://www.github.com/unsoon/rate-limit/commit/601a432fd15267dcb6e8bea286487b413494d3bd))
