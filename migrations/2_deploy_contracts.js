const Usdc = artifacts.require('Usdc')
const RWD = artifacts.require('RWD')
const DigitalBank = artifacts.require('DigitalBank')

module.exports = async function (deployer, network, accounts) {
    //Deploy Usdc Contract
    await deployer.deploy(Usdc)
    const usdc = await Usdc.deployed()

    //Deploy RWD Contract
    await deployer.deploy(RWD)
    const rwd = await RWD.deployed()

    //Deploy DigitalBank Contract
    await deployer.deploy(DigitalBank, rwd.address, usdc.address)
    const digitalBank = await DigitalBank.deployed()

    //Transfer all RWD tokens to DigitalBank
    await rwd.transfer(digitalBank.address, '1000000000000000000000000')

    //Distribute 100 Usdc tokens to inverstor
    await usdc.transfer(accounts[1], '100000000000000000000')
};