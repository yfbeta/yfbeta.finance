$(document).ready(function() {
    if(ethEnabled()) {
        initializeWeb3();
        initializeApplication();
    } else {
        alert("Please install MetaMask");
    }
});

let currentPool = false;
let currentToken = false;
let tokenContracts = [];
let vaultContracts = [];
let vaultAddresses = [];
let poolContracts = [];
let poolAddresses = [];
let decimals = [];
let balances = [];
let balancesRewards = [];
let balancesPools = [];
let balancesVault = [];
let balancesVaultTotal = [];
let balancesVaultProfits = [];
let source = [
    {
        'pool': 'USDT',
        'poolAddress': '',
        'poolTokenSymbol': 'yfUSDT',
        'poolTokenDecimals': 6,
        'poolTokenAddress': '',
        'rewardTokenSymbol': 'yfBETA',
        'rewardTokenDecimals': 18,
        'rewardTokenAddress': '0x89ee58af4871b474c30001982c3d7439c933c838'
    }
];

const initializeApplication = () => {

    for(var i = 0; i < source.length; i++) {
        var config = source[i];
        tokenContracts[config['poolTokenSymbol']] = new window.web3.eth.Contract(abiERC20, config['poolTokenAddress']);
        tokenContracts[config['rewardTokenSymbol']] = new window.web3.eth.Contract(abiERC20, config['rewardTokenAddress']);
        poolContracts[config['pool']] = new window.web3.eth.Contract(abiPool, config['poolAddress']);
        decimals[config['poolTokenSymbol']] = config['poolTokenDecimals'];
        decimals[config['rewardTokenSymbol']] = config['rewardTokenDecimals'];
        poolAddresses[config['pool']] = config['poolAddress'];
    }

    $('#btn-wallet-connect').on('click', function() {
        connectWallet(function() {
            log('wallet connected: ' + account);
            $('#btn-wallet-connect').attr('disabled', true);
            $('#wallet-connect-display').html(account);
            $('input[name="currentPool"]').removeAttr('disabled');
            fetchAllBalances();
        })
    });

    $('#btn-deposit').on('click', deposit);
    $('#btn-withdraw').on('click', withdraw);
    $('#btn-profits').on('click', profits);

    $('.btn-max').on('click', function(e) {
        $('#btn-deposit').attr('disabled', true);

        if($(e.target).data('type') == 'deposit') {
            $('#input--amount').val(balances[currentToken]);
            $('#btn-deposit').removeAttr('disabled');
        }
    });
}



const fetchAllBalances = () => {
    for(var i = 0; i < source.length; i++) {
        var config = source[i];
        fetchBalance(config['poolTokenSymbol']);
        fetchPoolBalance(config['pool'], config['poolTokenSymbol']);
        fetchPoolRewards(config['pool'], config['rewardTokenSymbol']);
    }
}
const fetchPoolRewards = (pool, token) => {
    console.log('-------- fetchPoolRewards');
    console.log(token);
    poolContracts[pool].methods.earned(account).call({from:account}, function (error, result) {
        if(!error) {
            var _res = result.toString() / (10 ** decimals[token]);
            balancesRewards[pool] = _res > 0 ? _res : 0;
            updatePoolDispaly(pool);
            console.log(pool+': '+balancesRewards[pool]);
        } else {
            console.log(error);
        }
    });
}
const fetchPoolBalance = (pool, token) => {
    console.log('-------- fetchPoolBalance');
    console.log(token);
    poolContracts[pool].methods.balanceOf(account).call({from:account}, function (error, result) {
        if(!error) {
            balancesPools[pool] = result.toString() / (10 ** decimals[token]);
            console.log(token+': '+balancesPools[pool]);
            updatePoolDispaly(pool);
        } else {
            console.log(error);
        }
    });
}
const fetchBalance = (token) => {
    console.log('-------- fetchBalance');
    console.log(token);
    tokenContracts[token].methods.balanceOf(account).call({from:account}, function (error, result) {
        if(!error) {
            balances[token] = result.toString() / (10 ** decimals[token]);
            console.log(token+': '+balances[token]);
            updateVaultDispaly(token);
        } else {
            console.log(error);
        }
    });
}

const updatePoolDispaly = (pool) => {
    $('.display--profits[data-pool="' + pool + '"]').html(round(balancesRewards[pool], 4));
    $('.display--staked[data-pool="' + pool + '"]').html(round(balancesPools[pool], 4));
    onPoolChanged();
}
const updateVaultDispaly = (token) => {
    $('#btn-deposit').attr('disabled', true);
    $('#input--amount[data-token="' + token + '"]').val(balances[token]);
    $('.display--unstaked[data-token="' + token + '"]').html(round(balances[token], 4));
    onPoolChanged();
}

const profits = () => {
    log('please confirm profits');
    var done = false;
    poolContracts[currentPool].methods.getReward().send({from:account})
        .on('transactionHash', function(hash){
            log(false, hash)
        })
        .on('confirmation', function(confirmationNumber, receipt){
            if(!done) {
                done = true;
                log('transaction done');
                $('#btn-profits').attr('disabled', true);
                fetchPoolRewards(currentPool, currentToken);
            }
        })
        .on('error', function(error){
            log(error);
        });
}
const withdraw = () => {
    log('please confirm withdraw');
    var done = false;
    poolContracts[currentPool].methods.exit().send({from:account})
        .on('transactionHash', function(hash){
            log(false, hash)
        })
        .on('confirmation', function(confirmationNumber, receipt){
            if(!done) {
                done = true;
                log('transaction done');
                balancesPools[currentPool] = 0;
                fetchPoolRewards(currentPool, currentToken);
                fetchPoolBalance(currentPool, currentToken);
                fetchBalance(currentToken);
            }
        })
        .on('error', function(error){
            log(error);
        });
}
const deposit = () => {
    let _amount = $('#input--amount').val() * (10**decimals[currentToken]);
    log('please confirm approval');
    var allowed = false;
    tokenContracts[currentToken].methods.approve(poolAddresses[currentPool], _amount).send({from:account})
        .on('transactionHash', function(hash){
            log(false, hash)
        })
        .on('confirmation', function(confirmationNumber, receipt){
            if(!allowed) {
                allowed = true;
                var staked = false;
                log('please confirm deposit');
                poolContracts[currentPool].methods.stake(_amount).send({from:account})
                    .on('transactionHash', function(hash){
                        log(false, hash)
                    })
                    .on('confirmation', function(confirmationNumber, receipt){
                        if(!staked) {
                            staked = true;
                            log('trasnaction done');
                            fetchBalance(currentToken);
                            fetchPoolBalance(currentPool, currentToken);
                        }
                    })
            }
        })
        .on('error', function(error){
            log(error);
        });
}

const lockDisplay = () => {
    $('#btn-deposit').attr('disabled', true);
    $('#btn-withdraw').attr('disabled', true);
    $('#btn-profits').attr('disabled', true);
    //$('.btn-max').attr('disabled', true);
    $('#input--amount').attr('disabled', true);
    $('input[name="currentToken"]').attr('disabled', true);
}
lockDisplay();

const onPoolChanged = () => {

    if((currentPool && $('input[name="currentPool"]').val()) && (currentPool != $('input[name="currentPool"]').val())) {
        log('selected pool is now: ' + currentPool);
    }

    $('#input--amount').val(0);
    $('#input--amount').attr('disabled', true);
    currentPool = $('input[name="currentPool"]').val();
    currentToken = $('input[name="currentPool"]').data('token');
    currentRewardToken = $('input[name="currentPool"]').data('reward-token');


    $('#input--amount').attr('disabled', true);
    $('#btn-deposit').attr('disabled', true);
    if(balances[currentToken] > 0) {
        $('#btn-deposit').removeAttr('disabled');
        $('#input--amount').removeAttr('disabled');
        $('#input--amount').val(balances[currentToken]);
    }

    $('#btn-withdraw').attr('disabled', true);
    if(balancesPools[currentPool] > 0) {
        $('#btn-withdraw').removeAttr('disabled');
    }

    $('#btn-profits').attr('disabled', true);
    if(balancesRewards[currentPool]) {
        $('#btn-profits').removeAttr('disabled');
    }
}

$('input[name="currentPool"]').on('change', onPoolChanged);