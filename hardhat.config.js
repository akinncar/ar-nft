/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
require("dotenv/config");

const { HARDHAT_PORT } = process.env;

module.exports = {
  solidity: "0.7.3",
  networks: {
    localhost: { url: `http://127.0.0.1:${HARDHAT_PORT}` },
    hardhat: {
      accounts: [{"privateKey":"0x5382265d63287d2ec10cff244d72c1726a5be6bc98715cb7efbcc2dc64db5227","balance":"1000000000000000000000"},{"privateKey":"0xf5d80aa8404e83bb31578b2f668ea41385cb071e0431bf1cd7c1f75655653081","balance":"1000000000000000000000"},{"privateKey":"0xd9b8be0fe4ca0a298c54b7258eb56bad728661ee6dda740814740e79ef816a0a","balance":"1000000000000000000000"},{"privateKey":"0x9503235d1f0b3063f3ec84ce90adbbe865a64d887f02478744198fb9db963be9","balance":"1000000000000000000000"},{"privateKey":"0xf3ffee1fcea93bd20142310ae75826df02d243dc9757f68b028af7e263be6315","balance":"1000000000000000000000"},{"privateKey":"0x7571dc4ebdadd64e7a8792427a1dc7eb2a6614dedf1ae60ccbd224332776268c","balance":"1000000000000000000000"},{"privateKey":"0x0244d1eae3c364618c2537f5fac82bf1cfbae8d6af8afc966fcf57cbc481e3ba","balance":"1000000000000000000000"},{"privateKey":"0x0c577e0eec8f516034735e08892a6f412ba1866f317e3f8501b631056db92b17","balance":"1000000000000000000000"},{"privateKey":"0x95c7b1de2f2c7f2e51bf043707752f33c1a6b068eb3b90ba9f0cfc5bb36b60b7","balance":"1000000000000000000000"},{"privateKey":"0xb752f968455a2c3f6ef420770f2744a000812561f381a7fe558be2aa93a5b6a3","balance":"1000000000000000000000"}]
    },
  },
  paths: {
    sources: './contracts',
    tests: './__tests__/contracts',
    cache: './cache',
    artifacts: './artifacts',
  },
};