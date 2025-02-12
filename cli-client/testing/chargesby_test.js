const chai = require('chai');
const { exec } = require('child_process');
const { promisify } = require('util');
const sinon = require('sinon');

const execAsync = promisify(exec);
const expect = chai.expect;

describe('ChargesBy command', () => {
  let consoleLogStub;
  let consoleErrorStub;

  before(() => {
    // Stub console.log and console.error
    consoleLogStub = sinon.stub(console, 'log');
    consoleErrorStub = sinon.stub(console, 'error');
  });

  after(() => {
    // Restore all stubs
    consoleLogStub.restore();
    consoleErrorStub.restore();
  });

  describe('Successful request', () => {
    it('should return the expected output in JSON format', async () => {
      // Run the command with valid options
      await execAsync('se2411 chargesby -o op1 --from 2023-01-01 --to 2023-01-31 --format json');

      // Verify the output was printed
      expect(consoleLogStub.calledOnce).to.be.true;
      const output = JSON.parse(consoleLogStub.firstCall.args[0]);

      // Validate the JSON structure
      expect(output).to.have.property('tollOpID');
      expect(output).to.have.property('requestTimestamp');
      expect(output).to.have.property('periodFrom');
      expect(output).to.have.property('periodTo');
      expect(output).to.have.property('vOpList').that.is.an('array');

      // Validate the structure of the first item in vOpList
      if (output.vOpList.length > 0) {
        expect(output.vOpList[0]).to.have.property('visitingOpID');
        expect(output.vOpList[0]).to.have.property('nPasses');
        expect(output.vOpList[0]).to.have.property('passesCost');
      }
    });

    it('should return the expected output in CSV format', async () => {
      // Run the command with valid options
      await execAsync('se2411 chargesby -o op1 --from 2023-01-01 --to 2023-01-31 --format csv');

      // Verify the output was printed
      expect(consoleLogStub.calledOnce).to.be.true;
      const output = consoleLogStub.firstCall.args[0];

      // Validate the CSV headers
      expect(output).to.include('tollOpID,requestTimestamp,periodFrom,periodTo,visitingOpID,nPasses,passesCost');
    });
  });

  describe('Missing required arguments', () => {
    it('should print an error message if --opid is missing', async () => {
      try {
        await execAsync('se2411 chargesby --from 2023-01-01 --to 2023-01-31');
      } catch (error) {
        expect(error.message).to.match(/Please provide a station using --station/);
      }
    });

    it('should print an error message if --from is missing', async () => {
      try {
        await execAsync('se2411 chargesby -o op1 --to 2023-01-31');
      } catch (error) {
        expect(error.message).to.match(/Please provide a starting date using --from/);
      }
    });

    it('should print an error message if --to is missing', async () => {
      try {
        await execAsync('se2411 chargesby -o op1 --from 2023-01-01');
      } catch (error) {
        expect(error.message).to.match(/Please provide an ending date using --to/);
      }
    });
  });

  describe('Invalid format', () => {
    it('should print an error message for invalid format', async () => {
      try {
        await execAsync('se2411 chargesby -o op1 --from 2023-01-01 --to 2023-01-31 --format invalid');
      } catch (error) {
        expect(error.message).to.match(/Invalid format! Use "json" or "csv"/);
      }
    });
  });

  describe('API failure', () => {
    it('should print an error message if the API fails', async () => {
      try {
        await execAsync('se2411 chargesby -o op1 --from 2023-01-01 --to 2023-01-31');
      } catch (error) {
        expect(consoleErrorStub.calledOnce).to.be.true;
        expect(consoleErrorStub.firstCall.args[0]).to.include('ChargesBy failed');
      }
    });
  });
});