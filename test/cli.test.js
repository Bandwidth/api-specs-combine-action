/**
 * Programmatically set arguments and execute the CLI script
 *
 * @param {...string} args - positional and option arguments for the command to run
 */
 async function runCommand(...args) {
    process.argv = [
      "node",
      "index.js",
      ...args,
    ];
  
    return require("../index.js");
  }

  describe("cli", () => {
    let originalArgv;
  
    beforeEach(() => {
      jest.resetModules();
  
      originalArgv = process.argv;
    });
  
    afterEach(() => {
      jest.resetAllMocks();
  
      process.argv = originalArgv;
    });

    it("should run the cli with no errors", async () => {
        const consoleSpy = jest.spyOn(console, "log");

        await runCommand("--config", "./test/fixtures/oas-merge-config.yml", "--test");

        expect(consoleSpy).toBeCalledWith("Merge successful!");
    });
});
