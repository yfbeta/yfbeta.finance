$(document).ready(function() {
    if(ethEnabled()) {
        initializeWeb3();
        initializeApplication();
    } else {
        alert("Please install MetaMask");
    }
});

let tokenContracts = [];
let vaultContracts = [];
let vaultAddresses = [];
let decimals = [];
let balances = [];
let balancesVault = [];
let balancesVaultTotal = [];
let balancesVaultProfits = [];
let source = [
    {
        'tokenSymbol': 'USDT',
        'tokenDecimals': 6,
        'tokenAddress': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        'vaultAddress': ''
    }
];

const initializeApplication = () => {

    for(var i = 0; i < source.length; i++) {
        var config = source[i];
        tokenContracts[config['tokenSymbol']] = new window.web3.eth.Contract(abiERC20, config['tokenAddress']);
        vaultContracts[config['tokenSymbol']] = new window.web3.eth.Contract(abiVault, config['vaultAddress']);
        vaultAddresses[config['tokenSymbol']] = config['vaultAddress'];
        decimals[config['tokenSymbol']] = config['tokenDecimals'];
        var tableRow = '<tr>';
        tableRow+= '<td><input type="radio" name="currentToken" value="'+config['tokenSymbol']+'" /></td>';
        tableRow+= '<td>'+config['tokenSymbol']+'</td>';
        tableRow+= '<td class="display--balance" data-token="'+config['tokenSymbol']+'">-</td>';
        tableRow+= '<td class="display--balance-vault" data-token="'+config['tokenSymbol']+'">-</td>';
        tableRow+= '<td class="display--balance-vault-total" data-token="'+config['tokenSymbol']+'">-</td>';
        tableRow+= '<td class="display--balance-vault-profits" data-token="'+config['tokenSymbol']+'">-</td>';
        tableRow+= '</tr>';
        //$('#table-rows').append(tableRow);
    }

    $('#btn-wallet-connect').on('click', function() {
        connectWallet(function() {
            log('wallet connected: ' + account);
            $('#btn-wallet-connect').attr('disabled', true);
            $('#wallet-connect-display').html(account);
            $('input[name="currentToken"]').removeAttr('disabled');
            fetchAllBalances();
        })
    });

    $('#btn-deposit').on('click', deposit);
    $('#btn-withdraw').on('click', withdraw);

    $('.btn-max').on('click', function(e) {
        $('#btn-deposit').attr('disabled', true);
        $('#btn-withdraw').attr('disabled', true);

        if($(e.target).data('type') == 'deposit') {
            $('#input--amount').val(balances[currentToken]);
            $('#btn-deposit').removeAttr('disabled');
        } else if($(e.target).data('type') == 'withdraw') {
            $('#input--amount').val(balancesVault[currentToken]);
            $('#btn-withdraw').removeAttr('disabled');
        } else {
            $('#input--amount').val(balances[currentToken]);
            $('#btn-deposit').removeAttr('disabled');
        }
    });
}

const fetchAllBalances = () => {
    for(var i = 0; i < source.length; i++) {
        var config = source[i];
        fetchBalance(config['tokenSymbol']);
    }
}

const fetchBalance = (token) => {
    console.log('-------- fetchBalance');
    console.log(token);
    tokenContracts[token].methods.balanceOf(account).call({from:account}, function (error, result) {
        if(!error) {
            balances[token] = result.toString() / (10 ** decimals[token]);
            updateVaultDispaly(token);
        } else {
            console.log(error);
        }
    });
    vaultContracts[token].methods.balanceOf(account).call({from:account}, function (error, result) {
        if(!error) {
            balancesVault[token] = result.toString() / (10 ** decimals[token]);
            updateVaultDispaly(token);
        } else {
            console.log(error);
        }
    });
    vaultContracts[token].methods.balanceVault().call({from:account}, function (error, result) {
        if(!error) {
            balancesVaultTotal[token] = result.toString() / (10 ** decimals[token]);
            updateVaultDispaly(token);
        } else {
            console.log(error);
        }
    });
    vaultContracts[token].methods.balanceToken().call({from:account}, function (error, result) {
        if(!error) {
            balancesVaultProfits[token] = result.toString() / (10 ** decimals[token]);
            updateVaultDispaly(token);
        } else {
            console.log(error);
        }
    });
}

const updateVaultDispaly = (token) => {
    $('.input--balance[data-token="' + token + '"]').val(balances[token]);
    $('.display--balance[data-token="' + token + '"]').html(round(balances[token], 4));
    $('.display--balance-vault[data-token="' + token + '"]').html(round(balancesVault[token], 4));
    $('.display--balance-vault-total[data-token="' + token + '"]').html(round(balancesVaultTotal[token], 4));
    $('.display--balance-vault-profits[data-token="' + token + '"]').html(round(balancesVaultProfits[token], 4));
    if(balances[token] > 0 || balancesVault[token] > 0) {
        $('.input--balance[data-token="' + token + '"]').removeAttr('disabled');
        if(balances[token] > 0) {
            $('.btn-max[data-token="' + token + '"]').removeAttr('disabled');
        }
        if(balancesVault[token] > 0) {
            $('.btn-max[data-token="' + token + '"]').removeAttr('disabled');
        }
    }
}

const withdraw = () => {
    let _amount = $('#input--amount').val() * (10**decimals[currentToken]);
    log('please confirm withdraw');
    var done = false;
    vaultContracts[currentToken].methods.withdraw(_amount).send({from:account})
        .on('transactionHash', function(hash){
            log(false, hash)
        })
        .on('confirmation', function(confirmationNumber, receipt){
            if(!done) {
                done = true;
                log('transaction done');
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
    tokenContracts[currentToken].methods.approve(vaultAddresses[currentToken], _amount).send({from:account})
        .on('transactionHash', function(hash){
            log(false, hash)
        })
        .on('confirmation', function(confirmationNumber, receipt){
            if(!allowed) {
                allowed = true;
                var staked = false;
                log('please confirm deposit');
                vaultContracts[currentToken].methods.deposit(_amount).send({from:account})
                    .on('transactionHash', function(hash){
                        log(false, hash)
                    })
                    .on('confirmation', function(confirmationNumber, receipt){
                        if(!staked) {
                            staked = true;
                            log('trasnaction done');
                            fetchBalance(currentToken);
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
    //$('.btn-max').attr('disabled', true);
    $('.input--balance').attr('disabled', true);
    $('input[name="currentToken"]').attr('disabled', true);
}
lockDisplay();


$('input[name="currentToken"]').on('change', function() {
    $('.input--balance').val(0);
    $('.input--balance').attr('disabled', true);
    currentToken = $(this).val();
    log('selected asset is now: ' + currentToken);
    if(balances[currentToken] || balancesVault[currentToken]) {

        $('.input--balance').removeAttr('disabled');

        if(balances[currentToken]) {
            $('.input--balance').val(balances[currentToken]);
        } else {
            $('.input--balance').val(balancesVault[currentToken]);
        }

        if(balances[currentToken]) {
            $('#btn-deposit').removeAttr('disabled');
        }
        if(balancesVault[currentToken]) {
            $('#btn-withdraw').removeAttr('disabled');
        }
    }
});