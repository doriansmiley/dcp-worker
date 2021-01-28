#! /usr/bin/env node
/**
 * @file        mnw             Minimal Node Worker
 * @author      Wes Garland, wes@kingsds.network
 * @date        Jan 2021
 */
const os = require('os');
const scheduler = 'https://scheduler.distributed.computer';
const autoUpdate = true; /* use dcp-client bundle on scheduler */

async function main() {
    const wallet = require('dcp/wallet');
    console.log('main called.');
    var options = {SandboxConstructor: null};
    var {Worker: StandaloneWorker} = require('dcp-worker/lib/standaloneWorker'); /* changing /lib/ to /libexec/ soon */
    var identityKeystore, paymentAddress;
    console.log(`process.env.WALLET_ID: ${process.env.WALLET_ID}`);
    try {
        identityKeystore = process.env.WALLET_ID || wallet.getId();
    } catch (error) {
        console.warn('Warning: could not locate identity keystore in ~/.dcp/id.keystore; using randomly-generated identity');
        identityKeystore = new wallet.IdKeystore(null, '');  /* new random */
        wallet.addId(identityKeystore);  /* use this identity for DCP */
    }
    console.log(`process.env.MNW_PAYMENT_ADDR: ${process.env.MNW_PAYMENT_ADDR}`);
    if (process.env.MNW_PAYMENT_ADDR) {
        paymentAddress = new wallet.Address(process.env.MNW_PAYMENT_ADDR);
    } else {
        try {
            paymentAddress = (await wallet.get()).address;
        } catch (error) {
            console.error('could not locate bank account keystore ~/.dcp/default.keystore');
            throw error;
        }
    }
    console.log('DCC will be deposited into account', paymentAddress);

    const Worker = typeof require('dcp/worker') === 'function'
        ? require('dcp/worker') /* current API - Jan 2021 */
        : require('dcp/worker').Worker /* future API */;

    let worker;
    try {
        worker = new Worker({
            evaluatorHostname: 'host.docker.internal',
            maxWorkingSandboxes: os.cpus().length * 2 || 3,
            paymentAddress: paymentAddress,
            sandboxOptions: {
                SandboxConstructor: function (code) {
                    return new StandaloneWorker(code, {/* evaluator options */})
                }
            }
        });
    } catch (e) {
        console.log(e.stack);
    }

    worker.on('sandbox', (sandbox) => {
        console.log("Sandbox created", sandbox.id);
        sandbox.on('sliceStart', () => console.log(`Sandbox ${sandbox.id} started slice`));
        sandbox.on('sliceError', () => console.warn(`Sandbox ${sandbox.id} slice failed`));
        sandbox.on('sliceFinish', () => console.log(`Sandbox ${sandbox.id} slice finished`));
        sandbox.on('progress', console.log);
    });

    worker.on('payment', (obj) => console.log("DCC credit:", obj.payment));
    worker.start();
}

process.on('unhandledRejection', error => {
    console.log('Fatal Error:', error.message);
    console.log(error.stack);
    process.exit(1);
});
console.log('calling init');
require('dcp-client').init(scheduler, autoUpdate).then(main);
