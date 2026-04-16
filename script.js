// CLOSURE: Create a function that returns private data
const CurrencyApp = (function() {
    let rates = {}; // Private variable
    
    return {
        // FETCH API: Get data from internet
        fetchRates: function(currency) {
            document.getElementById('loading').classList.add('show');
            document.getElementById('error').classList.remove('show');

            // PROMISE: fetch() returns a promise
            return fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`)
                // .then() runs when data arrives
                .then(response => response.json())
                .then(data => {
                    rates = data.rates;
                    document.getElementById('loading').classList.remove('show');
                    return rates;
                })
                // .catch() runs if there's an error
                .catch(error => {
                    document.getElementById('loading').classList.remove('show');
                    document.getElementById('error').classList.add('show');
                    document.getElementById('error').textContent = 'Error: ' + error.message;
                });
        },

        // Convert amount using cached rates
        convert: function(amount, toCurrency) {
            return (amount * rates[toCurrency]).toFixed(2);
        },

        // Get exchange rate
        getRate: function(toCurrency) {
            return rates[toCurrency].toFixed(4);
        }
    };
})();

// Get HTML elements
const amountInput = document.getElementById('amount');
const fromSelect = document.getElementById('fromCurrency');
const toSelect = document.getElementById('toCurrency');
const convertBtn = document.getElementById('convertBtn');
const result = document.getElementById('result');
const resultValue = document.getElementById('resultValue');
const resultRate = document.getElementById('resultRate');

// Convert button click
convertBtn.addEventListener('click', function() {
    const amount = amountInput.value;
    const fromCurrency = fromSelect.value;
    const toCurrency = toSelect.value;

    convertBtn.disabled = true;

    // PROMISE CHAIN: Fetch rates then convert
    CurrencyApp.fetchRates(fromCurrency)
        .then(() => {
            const converted = CurrencyApp.convert(amount, toCurrency);
            const rate = CurrencyApp.getRate(toCurrency);

            resultValue.textContent = converted;
            resultRate.textContent = `1 ${fromCurrency} = ${rate} ${toCurrency}`;
            result.classList.add('show');
        })
        .finally(() => {
            convertBtn.disabled = false;
        });
});

// Load initial rates
window.addEventListener('load', function() {
    CurrencyApp.fetchRates('USD');
});


