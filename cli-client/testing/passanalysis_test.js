const chai = require('chai');
const { exec } = require('child_process');
const { promisify } = require('util');
const sinon = require('sinon');

const execAsync = promisify(exec);
const expect = chai.expect;

describe('PassAnalysis command', () => {
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
      // Run the command with valid options, including tagop
      await execAsync('se2411 passanalysis -s op1 --tagop op2 --from 2023-01-01 --to 2023-01-31 --format json');

      // Verify the output was printed
      expect(consoleLogStub.calledOnce).to.be.true;
      const output = consoleLogStub.firstCall.args[0];
      expect(output).to.include('status');
      expect(output).to.include('passes');
    });

    it('should return the expected output in CSV format', async () => {
      // Run the command with valid options, including tagop
      await execAsync('se2411 passanalysis -s op1 --tagop op2 --from 2023-01-01 --to 2023-01-31 --format csv');

      // Verify the output was printed
      expect(consoleLogStub.calledOnce).to.be.true;
      const output = consoleLogStub.firstCall.args[0];
      expect(output).to.include('stationop,tagop,from,to');
    });
  });

  describe('Missing required arguments', () => {
    it('should print an error message if --stationop is missing', async () => {
      try {
        await execAsync('se2411 passanalysis --tagop op2 --from 2023-01-01 --to 2023-01-31');
      } catch (error) {
        expect(error.message).to.match(/Please provide a station using --station/);
      }
    });

    it('should print an error message if --tagop is missing', async () => {
      try {
        await execAsync('se2411 passanalysis -s op1 --from 2023-01-01 --to 2023-01-31');
      } catch (error) {
        expect(error.message).to.match(/Please provide a tag using --tagop/);
      }
    });

    it('should print an error message if --from is missing', async () => {
      try {
        await execAsync('se2411 passanalysis -s op1 --tagop op2 --to 2023-01-31');
      } catch (error) {
        expect(error.message).to.match(/Please provide a starting date using --from/);
      }
    });

    it('should print an error message if --to is missing', async () => {
      try {
        await execAsync('se2411 passanalysis -s op1 --tagop op2 --from 2023-01-01');
      } catch (error) {
        expect(error.message).to.match(/Please provide an ending date using --to/);
      }
    });
  });

  describe('Invalid format', () => {
    it('should print an error message for invalid format', async () => {
      try {
        await execAsync('se2411 passanalysis -s op1 --tagop op2 --from 2023-01-01 --to 2023-01-31 --format invalid');
      } catch (error) {
        expect(error.message).to.match(/Invalid format! Use "json" or "csv"/);
      }
    });
  });

  describe('API failure', () => {
    it('should print an error message if the API fails', async () => {
      try {
        await execAsync('se2411 passanalysis -s op1 --tagop op2 --from 2023-01-01 --to 2023-01-31');
      } catch (error) {
        expect(consoleErrorStub.calledOnce).to.be.true;
        expect(consoleErrorStub.firstCall.args[0]).to.include('PassAnalysis failed');
      }
    });
  });
});