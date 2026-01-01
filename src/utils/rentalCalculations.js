/**
 * Rental Calculator Utility Functions
 * All financial calculations for Norwegian property investment analysis
 */

/**
 * Calculate monthly mortgage payment (annuity)
 * @param {number} principal - Loan amount in NOK
 * @param {number} annualRate - Annual interest rate as percentage (e.g., 5.5)
 * @param {number} years - Loan term in years
 * @returns {number} Monthly payment
 */
export function calculateMonthlyPayment(principal, annualRate, years) {
    if (principal <= 0 || years <= 0) return 0;
    if (annualRate <= 0) return principal / (years * 12);

    const monthlyRate = annualRate / 100 / 12;
    const numPayments = years * 12;

    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);
}

/**
 * Calculate gross yield (brutto yield)
 * @param {number} annualRent - Annual rental income
 * @param {number} purchasePrice - Property purchase price
 * @returns {number} Yield as percentage
 */
export function calculateGrossYield(annualRent, purchasePrice) {
    if (purchasePrice <= 0) return 0;
    return (annualRent / purchasePrice) * 100;
}

/**
 * Calculate net yield (netto yield)
 * @param {number} annualRent - Annual rental income
 * @param {number} annualCosts - Annual operating costs
 * @param {number} purchasePrice - Property purchase price
 * @returns {number} Yield as percentage
 */
export function calculateNetYield(annualRent, annualCosts, purchasePrice) {
    if (purchasePrice <= 0) return 0;
    return ((annualRent - annualCosts) / purchasePrice) * 100;
}

/**
 * Calculate cash-on-cash return
 * @param {number} annualCashFlow - Annual cash flow after all expenses
 * @param {number} downPayment - Initial equity investment
 * @returns {number} Return as percentage
 */
export function calculateCashOnCash(annualCashFlow, downPayment) {
    if (downPayment <= 0) return 0;
    return (annualCashFlow / downPayment) * 100;
}

/**
 * Calculate Norwegian rental tax
 * @param {number} annualRent - Annual rental income
 * @param {number} annualDeductions - Deductible expenses (interest, maintenance, etc.)
 * @param {number} taxRate - Marginal tax rate (default 22% for capital income)
 * @returns {number} Annual tax amount
 */
export function calculateRentalTax(annualRent, annualDeductions, taxRate = 22) {
    const taxableIncome = Math.max(0, annualRent - annualDeductions);
    return taxableIncome * (taxRate / 100);
}

/**
 * Calculate total acquisition costs
 * @param {number} purchasePrice - Property price
 * @param {number} documentFeeRate - Document fee rate (default 2.5%)
 * @returns {object} Breakdown of costs
 */
export function calculateAcquisitionCosts(purchasePrice, documentFeeRate = 2.5) {
    const documentFee = purchasePrice * (documentFeeRate / 100);
    const registrationFee = 585; // Fixed fee in NOK (2024)

    return {
        purchasePrice,
        documentFee,
        registrationFee,
        total: purchasePrice + documentFee + registrationFee
    };
}

/**
 * Complete rental analysis
 * @param {object} params - All input parameters
 * @returns {object} Complete financial analysis
 */
export function calculateRentalAnalysis(params) {
    const {
        purchasePrice = 0,
        downPaymentPercent = 15,
        interestRate = 5.5,
        loanTermYears = 25,
        monthlyRent = 0,
        monthlyCommonCosts = 0,
        monthlyMaintenance = 0,
        annualInsurance = 0,
        vacancyRatePercent = 5,
        internetTV = 0,
        taxRate = 22
    } = params;

    // Loan calculations
    const downPayment = purchasePrice * (downPaymentPercent / 100);
    const loanAmount = purchasePrice - downPayment;
    const monthlyMortgage = calculateMonthlyPayment(loanAmount, interestRate, loanTermYears);
    const annualMortgage = monthlyMortgage * 12;

    // Interest (first year approximation)
    const annualInterest = loanAmount * (interestRate / 100);
    const annualPrincipal = annualMortgage - annualInterest;

    // Income calculations
    const grossAnnualRent = monthlyRent * 12;
    const vacancyLoss = grossAnnualRent * (vacancyRatePercent / 100);
    const effectiveAnnualRent = grossAnnualRent - vacancyLoss;

    // Operating costs
    const annualCommonCosts = monthlyCommonCosts * 12;
    const annualMaintenance = monthlyMaintenance * 12;
    const annualInternetTV = internetTV * 12;
    const totalOperatingCosts = annualCommonCosts + annualMaintenance + annualInsurance + annualInternetTV;

    // NOI - Net Operating Income
    const netOperatingIncome = effectiveAnnualRent - totalOperatingCosts;

    // Cash flow before tax
    const annualCashFlowBeforeTax = netOperatingIncome - annualMortgage;

    // Tax calculation
    const deductibleExpenses = annualInterest + totalOperatingCosts;
    const taxableIncome = Math.max(0, effectiveAnnualRent - deductibleExpenses);
    const annualTax = taxableIncome * (taxRate / 100);

    // Cash flow after tax
    const annualCashFlowAfterTax = annualCashFlowBeforeTax - annualTax;
    const monthlyCashFlowAfterTax = annualCashFlowAfterTax / 12;

    // Yields
    const grossYield = calculateGrossYield(grossAnnualRent, purchasePrice);
    const netYield = calculateNetYield(effectiveAnnualRent, totalOperatingCosts, purchasePrice);
    const cashOnCash = calculateCashOnCash(annualCashFlowAfterTax, downPayment);

    // Acquisition costs
    const acquisitionCosts = calculateAcquisitionCosts(purchasePrice);

    return {
        // Summary
        summary: {
            monthlyRent,
            monthlyCashFlow: monthlyCashFlowAfterTax,
            annualCashFlow: annualCashFlowAfterTax,
            grossYield,
            netYield,
            cashOnCash
        },

        // Loan details
        loan: {
            purchasePrice,
            downPayment,
            downPaymentPercent,
            loanAmount,
            interestRate,
            loanTermYears,
            monthlyMortgage,
            annualMortgage,
            annualInterest,
            annualPrincipal
        },

        // Income
        income: {
            monthlyRent,
            grossAnnualRent,
            vacancyRatePercent,
            vacancyLoss,
            effectiveAnnualRent
        },

        // Costs
        costs: {
            monthlyCommonCosts,
            annualCommonCosts,
            monthlyMaintenance,
            annualMaintenance,
            annualInsurance,
            annualInternetTV,
            totalOperatingCosts,
            monthlyMortgage,
            annualMortgage
        },

        // Tax
        tax: {
            taxableIncome,
            taxRate,
            annualTax,
            deductibleExpenses
        },

        // Results
        results: {
            netOperatingIncome,
            annualCashFlowBeforeTax,
            annualCashFlowAfterTax,
            monthlyCashFlowAfterTax
        },

        // Acquisition
        acquisition: acquisitionCosts
    };
}

/**
 * Format number as NOK currency
 */
export function formatNOK(value) {
    return new Intl.NumberFormat('nb-NO', {
        style: 'currency',
        currency: 'NOK',
        maximumFractionDigits: 0
    }).format(value);
}

/**
 * Format number with thousand separators
 */
export function formatNumber(value, decimals = 0) {
    return new Intl.NumberFormat('nb-NO', {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals
    }).format(value);
}
