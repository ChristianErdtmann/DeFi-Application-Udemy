const DigitalBank = artifacts.require('DigitalBank')

module.exports = async function issueRewards(callback) {
    let digitalBank = await DigitalBank.deployed()
    await digitalBank.issueRewardTokens()
    console.log("Tokens issued successfully")

}