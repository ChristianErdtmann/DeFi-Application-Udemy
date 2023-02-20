const Usdc = artifacts.require('Usdc')
const RWD = artifacts.require('RWD')
const DigitalBank = artifacts.require('DigitalBank')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('DigitalBank', ([owner, investor]) => {
    let usdc, rwd

    function tokens(number) {
        return web3.utils.toWei(number, 'ether')
    }


    before(async () => {
        //Load Contracts
        usdc = await Usdc.new()
        rwd = await RWD.new()
        digitalBank = await DigitalBank.new(rwd.address, usdc.address)

        //Transfer tokens
        await rwd.transfer(digitalBank.address, tokens('1000000'))

        await usdc.transfer(investor, tokens('100'), { from: owner })
    })

    //Here we write our code for testing
    describe('Usdc Deployment', async () => {
        it('matches Usdc name successfully', async () => {
            const name = await usdc.name()
            assert.equal(name, 'Usdc')
        })
    })

    describe('Reward Token Deployment', async () => {
        it('matches rwd token name successfully', async () => {
            const name = await rwd.name()
            assert.equal(name, 'Reward Token')
        })
    })

    describe('Digital Bank Deployment', async () => {
        it('match digital bank name successfully', async () => {
            const name = await digitalBank.name()
            assert.equal(name, 'Digital Bank')
        })

        it('contracts has correct amount of tokens', async () => {
            const balance = await rwd.balanceOf(digitalBank.address)
            assert.equal(balance, tokens('1000000'))
        })
    })

    describe('Staking', async () => {
        it('Check Investor Balance', async () => {
            const result = await usdc.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'))
        })

        it('Check Staking for Investor', async () => {
            await usdc.approve(digitalBank.address, tokens('100'), { from: investor })
            await digitalBank.depositTokens(tokens('100'), { from: investor })
        })

        it('Check Updated Balance of Investor', async () => {
            const result = await usdc.balanceOf(investor)
            assert.equal(result.toString(), tokens('0'))
        })

        it('Check Updated Balance of DigitalBank', async () => {
            const result = await usdc.balanceOf(digitalBank.address)
            assert.equal(result.toString(), tokens('100'))
        })

        it('Check Updated Staking Balance (USDC) of Investor at DigitalBank', async () => {
            const result = await digitalBank.stakingBalance(investor)
            assert.equal(result.toString(), tokens('100'))
        })

        it('Check updated boolean value', async () => {
            const result = await digitalBank.isStaking(investor)
            assert.equal(result.toString(), 'true')
        })

        it('Ensure only the owner can issue tokens', async () => {
            await digitalBank.issueRewardTokens({ from: investor }).should.be.rejected
        })

        it('issue tokens by owner', async () => {
            await digitalBank.issueRewardTokens({ from: owner })
        })

        it('Test Unstake Tokens', async () => {
            await digitalBank.unstakeTokens({ from: investor })
        })

        it('Check UnstakingBalance of Investor', async () => {
            const result = await usdc.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'))
        })

        it('Check Updated Staking Balance (USDC) of Investor at DigitalBank', async () => {
            const result = await digitalBank.stakingBalance(investor)
            assert.equal(result.toString(), tokens('0'))
        })

        it('Check updated boolean value', async () => {
            const result = await digitalBank.isStaking(investor)
            assert.equal(result.toString(), 'false', 'customer is no longer staking after unstaking his tokens')
        })
    })

})