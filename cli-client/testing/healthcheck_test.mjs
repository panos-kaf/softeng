import { expect } from "chai";
import { exec } from "child_process";
import { promisify } from "util";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { connection_string } = require("../utils/routes");

const execAsync = promisify(exec);

describe('Healthcheck request', function () {
  this.timeout(10000); // Set timeout to 5 seconds (5000ms)
  describe('Successful request with default CSV format', function() {
    it('Should return CSV output with expected content', async function() {
      const response = await execAsync('se2411 healthcheck');
      const output = response.stdout;

      // Check CSV headers
      expect(output).to.include('status,dbconnection');

      // Check CSV values
      expect(output).to.include('OK');
      expect(output).to.include(connection_string);
    });
  });

  describe('Successful request with JSON format', function() {
    it('Should return JSON output with expected content', async function() {
      const response = await execAsync('se2411 healthcheck --format json');
      const output = JSON.parse(response.stdout);

      // Validate JSON structure
      expect(output).to.deep.equal({
        status: 'OK',
        dbconnection: connection_string,
      });
    });
  });

  describe('Missing format argument', () => {
    it('Should provide a message that the argument is missing', async () => {
      try {
        await execAsync('se2411 healthcheck --format');
      } catch (error) {
        console.log("Actual Error Message:", error.message); // Debugging step
        expect(error.message).to.match(/argument missing/i);
      }
    });
  });

  describe('Invalid format argument', () => {
    it('Should provide a message that the argument is invalid', async () => {
      try {
        await execAsync('se2411 healthcheck --format invalid');
      } catch (error) {
        console.log("Actual Error Message:", error.message); // Debugging step
        expect(error.message).to.match(/invalid format/i);
      }
    });
  });
});