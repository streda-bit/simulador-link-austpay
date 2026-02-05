// Taxas Moduladas: Base Imagem + 1.5% | Pix 3% | Boleto 1.99%
const rates = {
    visa_master: {
        debit: 2.99, 
        pix: 3.00,
        boleto: 1.99,
        credit: [5.39, 7.08, 7.94, 8.70, 9.45, 10.20, 11.25, 12.00, 12.77, 13.53, 14.28, 14.74, 15.80, 16.55, 17.31, 18.07, 18.83, 19.58, 21.03, 21.78, 22.50]
    },
    elo: {
        debit: 3.75, 
        pix: 3.00,
        boleto: 1.99,
        credit: [5.75, 7.96, 8.82, 9.57, 10.31, 11.05, 12.01, 12.74, 13.51, 14.26, 15.01, 15.46, 16.52, 17.26, 18.01, 18.77, 19.52, 20.27, 21.42, 21.78, 22.60]
    },
    hiper: {
        debit: null, 
        pix: 3.00,
        boleto: 1.99,
        credit: [5.75, 7.66, 8.52, 9.57, 10.01, 10.66, 11.71, 12.44, 13.21, 14.26, 14.71, 15.16, 16.22, 16.96, 17.71, 18.47, 19.22, 19.97, 21.12, 21.87, 22.69]
    },
    amex: {
        debit: null, 
        pix: 3.00,
        boleto: 1.99,
        credit: [6.78, 8.16, 9.01, 9.77, 10.50, 11.24, 12.20, 12.93, 13.69, 14.45, 15.19, 15.64, 16.69, 17.44, 17.19, 18.94, 19.70, 20.44, 21.58, 22.33, 23.15]
    },
    cabal: {
        debit: null, 
        pix: null,
        boleto: null,
        credit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]
    }
};

// Elementos da tela
const els = {
    amount: document.getElementById('amount'),
    brand: document.getElementById('brand'),
    method: document.getElementById('method'),
    installments: document.getElementById('installments'),
    passFees: document.getElementById('passFees'),
    receiveAmount: document.getElementById('receiveAmount'),
    chargeAmount: document.getElementById('chargeAmount')
};

function init() {
    els.installments.innerHTML = '';
    for (let i = 1; i <= 21; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.text = i + 'x';
        els.installments.appendChild(opt);
    }

    [els.amount, els.brand, els.method, els.installments, els.passFees].forEach(el => 
        el.addEventListener('input', calculate)
    );
    
    els.method.addEventListener('change', () => {
        // Mostra parcelas apenas se for crédito
        els.installments.style.display = els.method.value === 'credit' ? 'block' : 'none';
        calculate();
    });

    calculate();
}

function calculate() {
    let amount = parseFloat(els.amount.value) || 0;
    let rate = 0;
    
    const selectedBrand = rates[els.brand.value];
    const method = els.method.value;

    // Busca a taxa correta
    if (method === 'pix') rate = selectedBrand.pix;
    else if (method === 'boleto') rate = selectedBrand.boleto;
    else if (method === 'debit') rate = selectedBrand.debit;
    else {
        let idx = parseInt(els.installments.value) - 1;
        let list = selectedBrand.credit;
        if (list && list[idx] != null) rate = list[idx];
    }
    
    if (rate === null) rate = 0;

    let charge = amount;
    let receive = amount;

    if (els.passFees.checked) {
        // TAXA REVERSA: Você recebe o valor integral, cliente paga o juro calculado "por dentro"
        // Fórmula: Valor / (1 - (Taxa/100))
        charge = amount / (1 - (rate / 100));
        receive = amount;
    } else {
        // PADRÃO: Desconta do seu recebimento
        receive = amount - (amount * (rate / 100));
        charge = amount;
    }

    els.receiveAmount.innerText = receive.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    els.chargeAmount.innerText = charge.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
}

init();