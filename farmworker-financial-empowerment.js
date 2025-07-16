/**
 * 💰 FARMWORKER FINANCIAL EMPOWERMENT PLATFORM
 * Comprehensive financial inclusion system for farm staff
 * 
 * Features:
 * - Credit profile building using payroll and production data
 * - Micro-savings accounts with interest
 * - Micro-loan platform with flexible terms
 * - Financial literacy education
 * - Digital payments and mobile money integration
 * - Cooperative savings groups (Chama integration)
 * - Insurance products for farmworkers
 * - Performance-based bonuses and incentives
 * - Emergency fund access
 * - Retirement planning assistance
 */

class FarmworkerFinancialEmpowermentPlatform {
    constructor() {
        this.workers = new Map();
        this.creditProfiles = new Map();
        this.savingsAccounts = new Map();
        this.loans = new Map();
        this.cooperatives = new Map();
        this.financialProducts = new Map();
        this.payrollData = new Map();
        this.productionData = new Map();
        this.transactions = [];
        this.educationProgress = new Map();
        
        this.initializePlatform();
    }

    // 🚀 PLATFORM INITIALIZATION
    initializePlatform() {
        console.log('💰 Initializing Farmworker Financial Empowerment Platform...');
        
        this.setupFinancialProducts();
        this.createDemoData();
        
        console.log('✅ Financial Empowerment Platform Ready!');
        this.demonstrateFinancialEmpowerment();
    }

    setupFinancialProducts() {
        // Micro-savings products
        this.financialProducts.set('basic_savings', {
            id: 'basic_savings',
            name: 'Basic Savings Account',
            type: 'savings',
            interestRate: 0.05, // 5% annual
            minimumBalance: 100, // KES 100
            features: ['Mobile access', 'Daily deposits', 'No withdrawal fees'],
            requirements: ['Active employment', 'Basic KYC']
        });

        this.financialProducts.set('goal_savings', {
            id: 'goal_savings',
            name: 'Goal-Based Savings',
            type: 'savings',
            interestRate: 0.07, // 7% annual
            minimumBalance: 500,
            features: ['Higher interest', 'Goal tracking', 'Automated deposits'],
            requirements: ['6+ months employment', 'Completed financial literacy']
        });

        // Micro-loan products
        this.financialProducts.set('emergency_loan', {
            id: 'emergency_loan',
            name: 'Emergency Micro-Loan',
            type: 'loan',
            interestRate: 0.12, // 12% annual
            maxAmount: 10000, // KES 10,000
            termMonths: 6,
            features: ['Same-day approval', 'Flexible repayment', 'No collateral'],
            requirements: ['3+ months employment', 'Good attendance record']
        });

        this.financialProducts.set('productive_loan', {
            id: 'productive_loan',
            name: 'Productive Asset Loan',
            type: 'loan',
            interestRate: 0.15, // 15% annual
            maxAmount: 50000, // KES 50,000
            termMonths: 24,
            features: ['Asset financing', 'Business mentorship', 'Grace period'],
            requirements: ['12+ months employment', 'Business plan', 'Strong credit profile']
        });

        // Insurance products
        this.financialProducts.set('health_insurance', {
            id: 'health_insurance',
            name: 'Farmworker Health Insurance',
            type: 'insurance',
            premium: 200, // KES 200/month
            coverage: 100000, // KES 100,000
            features: ['Outpatient care', 'Emergency treatment', 'Family coverage'],
            requirements: ['Active employment']
        });
    }

    // 👥 WORKER MANAGEMENT
    registerWorker(workerData) {
        const workerId = `FW_${Date.now().toString().slice(-6)}`;
        
        const worker = {
            id: workerId,
            employeeId: workerData.employeeId,
            name: workerData.name,
            phone: workerData.phone,
            nationalId: workerData.nationalId,
            position: workerData.position,
            department: workerData.department,
            startDate: workerData.startDate || new Date(),
            bankAccount: workerData.bankAccount,
            nextOfKin: workerData.nextOfKin,
            address: workerData.address,
            educationLevel: workerData.educationLevel,
            dependents: workerData.dependents || 0,
            status: 'active',
            kycStatus: 'pending',
            financialLiteracyLevel: 'beginner',
            createdAt: new Date()
        };

        this.workers.set(workerId, worker);
        this.initializeWorkerFinancialProfile(workerId);
        
        console.log(`✅ Worker registered: ${worker.name} (ID: ${workerId})`);
        return { success: true, workerId, worker };
    }

    initializeWorkerFinancialProfile(workerId) {
        // Create credit profile
        const creditProfile = {
            workerId,
            creditScore: 300, // Starting score
            paymentHistory: [],
            employmentHistory: [{
                employer: 'Mountain Goat Farm',
                position: this.workers.get(workerId).position,
                startDate: this.workers.get(workerId).startDate,
                status: 'current'
            }],
            incomeVerification: {
                averageMonthlyIncome: 0,
                incomeStability: 0,
                lastUpdated: new Date()
            },
            creditUtilization: 0,
            totalDebt: 0,
            savings: 0,
            riskAssessment: 'high', // Will improve with data
            lastUpdated: new Date()
        };

        this.creditProfiles.set(workerId, creditProfile);

        // Create basic savings account
        this.createSavingsAccount(workerId, 'basic_savings');
        
        return creditProfile;
    }

    // 💳 CREDIT PROFILE MANAGEMENT
    updateCreditProfile(workerId, payrollData, productionData) {
        const profile = this.creditProfiles.get(workerId);
        if (!profile) return null;

        const worker = this.workers.get(workerId);
        
        // Calculate income metrics
        const monthlyPayrolls = payrollData.filter(p => 
            new Date(p.date).getMonth() === new Date().getMonth()
        );
        
        const averageMonthlyIncome = monthlyPayrolls.reduce((sum, p) => sum + p.grossPay, 0) / Math.max(monthlyPayrolls.length, 1);
        const incomeStability = this.calculateIncomeStability(payrollData);
        
        // Update income verification
        profile.incomeVerification = {
            averageMonthlyIncome,
            incomeStability,
            lastUpdated: new Date()
        };

        // Calculate production-based score improvements
        const productionScore = this.calculateProductionScore(workerId, productionData);
        const attendanceScore = this.calculateAttendanceScore(workerId, payrollData);
        const savingsScore = this.calculateSavingsScore(workerId);
        
        // Update credit score
        const baseScore = 300;
        const incomeBonus = Math.min(averageMonthlyIncome / 1000 * 10, 100); // Up to 100 points
        const stabilityBonus = incomeStability * 50; // Up to 50 points
        const productionBonus = productionScore * 100; // Up to 100 points
        const attendanceBonus = attendanceScore * 75; // Up to 75 points
        const savingsBonus = savingsScore * 75; // Up to 75 points
        
        profile.creditScore = Math.min(850, Math.round(
            baseScore + incomeBonus + stabilityBonus + productionBonus + attendanceBonus + savingsBonus
        ));

        // Update risk assessment
        if (profile.creditScore >= 700) profile.riskAssessment = 'low';
        else if (profile.creditScore >= 600) profile.riskAssessment = 'medium';
        else if (profile.creditScore >= 500) profile.riskAssessment = 'medium-high';
        else profile.riskAssessment = 'high';

        profile.lastUpdated = new Date();
        
        console.log(`📊 Credit profile updated for ${worker.name}: Score ${profile.creditScore} (${profile.riskAssessment} risk)`);
        return profile;
    }

    calculateIncomeStability(payrollData) {
        if (payrollData.length < 3) return 0.2; // Low stability for new workers
        
        const incomes = payrollData.map(p => p.grossPay);
        const average = incomes.reduce((sum, income) => sum + income, 0) / incomes.length;
        const variance = incomes.reduce((sum, income) => sum + Math.pow(income - average, 2), 0) / incomes.length;
        const standardDeviation = Math.sqrt(variance);
        const coefficientOfVariation = standardDeviation / average;
        
        // Lower coefficient of variation = higher stability
        return Math.max(0, Math.min(1, 1 - coefficientOfVariation));
    }

    calculateProductionScore(workerId, productionData) {
        const workerProduction = productionData.filter(p => p.workerId === workerId);
        if (workerProduction.length === 0) return 0.5; // Neutral score
        
        const avgProductivity = workerProduction.reduce((sum, p) => sum + p.productivityScore, 0) / workerProduction.length;
        const qualityScore = workerProduction.reduce((sum, p) => sum + (p.qualityScore || 0.8), 0) / workerProduction.length;
        
        return (avgProductivity + qualityScore) / 2;
    }

    calculateAttendanceScore(workerId, payrollData) {
        const recentPayrolls = payrollData.filter(p => 
            new Date() - new Date(p.date) <= 90 * 24 * 60 * 60 * 1000 // Last 90 days
        );
        
        if (recentPayrolls.length === 0) return 0.5;
        
        const totalDays = recentPayrolls.reduce((sum, p) => sum + p.daysWorked, 0);
        const expectedDays = recentPayrolls.length * 22; // Assuming 22 working days per month
        
        return Math.min(1, totalDays / expectedDays);
    }

    calculateSavingsScore(workerId) {
        const savings = this.getSavingsAccountBalance(workerId);
        const worker = this.workers.get(workerId);
        const profile = this.creditProfiles.get(workerId);
        
        if (!profile || profile.incomeVerification.averageMonthlyIncome === 0) return 0;
        
        const savingsRatio = savings / profile.incomeVerification.averageMonthlyIncome;
        return Math.min(1, savingsRatio / 3); // Full score if savings = 3 months income
    }

    // 💰 SAVINGS ACCOUNTS
    createSavingsAccount(workerId, productType) {
        const product = this.financialProducts.get(productType);
        if (!product || product.type !== 'savings') {
            return { success: false, error: 'Invalid savings product' };
        }

        const accountId = `SAV_${Date.now()}`;
        const account = {
            id: accountId,
            workerId,
            productType,
            balance: 0,
            interestRate: product.interestRate,
            minimumBalance: product.minimumBalance,
            transactions: [],
            goals: [],
            autoDeposit: {
                enabled: false,
                amount: 0,
                frequency: 'monthly'
            },
            createdAt: new Date(),
            lastInterestCalculation: new Date()
        };

        this.savingsAccounts.set(accountId, account);
        
        const worker = this.workers.get(workerId);
        console.log(`💰 Savings account created for ${worker.name}: ${product.name}`);
        
        return { success: true, accountId, account };
    }

    depositToSavings(workerId, amount, source = 'manual') {
        const accounts = Array.from(this.savingsAccounts.values()).filter(acc => acc.workerId === workerId);
        if (accounts.length === 0) {
            return { success: false, error: 'No savings account found' };
        }

        const account = accounts[0]; // Use primary account
        account.balance += amount;
        
        const transaction = {
            id: `TXN_${Date.now()}`,
            type: 'deposit',
            amount,
            source,
            balance: account.balance,
            timestamp: new Date()
        };
        
        account.transactions.push(transaction);
        this.transactions.push(transaction);
        
        const worker = this.workers.get(workerId);
        console.log(`💵 ${worker.name} deposited KES ${amount} to savings (Balance: KES ${account.balance})`);
        
        return { success: true, transaction, newBalance: account.balance };
    }

    withdrawFromSavings(workerId, amount, reason = 'withdrawal') {
        const accounts = Array.from(this.savingsAccounts.values()).filter(acc => acc.workerId === workerId);
        if (accounts.length === 0) {
            return { success: false, error: 'No savings account found' };
        }

        const account = accounts[0];
        if (account.balance < amount) {
            return { success: false, error: 'Insufficient funds' };
        }

        if (account.balance - amount < account.minimumBalance) {
            return { success: false, error: 'Cannot go below minimum balance' };
        }

        account.balance -= amount;
        
        const transaction = {
            id: `TXN_${Date.now()}`,
            type: 'withdrawal',
            amount,
            reason,
            balance: account.balance,
            timestamp: new Date()
        };
        
        account.transactions.push(transaction);
        this.transactions.push(transaction);
        
        const worker = this.workers.get(workerId);
        console.log(`💸 ${worker.name} withdrew KES ${amount} from savings (Balance: KES ${account.balance})`);
        
        return { success: true, transaction, newBalance: account.balance };
    }

    getSavingsAccountBalance(workerId) {
        const accounts = Array.from(this.savingsAccounts.values()).filter(acc => acc.workerId === workerId);
        return accounts.reduce((total, acc) => total + acc.balance, 0);
    }

    calculateSavingsInterest() {
        for (const [accountId, account] of this.savingsAccounts) {
            const daysSinceLastCalculation = (new Date() - account.lastInterestCalculation) / (1000 * 60 * 60 * 24);
            
            if (daysSinceLastCalculation >= 30) { // Monthly interest calculation
                const monthlyInterest = account.balance * (account.interestRate / 12);
                
                if (monthlyInterest > 0) {
                    account.balance += monthlyInterest;
                    
                    const transaction = {
                        id: `TXN_${Date.now()}`,
                        type: 'interest',
                        amount: monthlyInterest,
                        balance: account.balance,
                        timestamp: new Date()
                    };
                    
                    account.transactions.push(transaction);
                    account.lastInterestCalculation = new Date();
                    
                    const worker = this.workers.get(account.workerId);
                    console.log(`🎯 Interest earned by ${worker.name}: KES ${monthlyInterest.toFixed(2)}`);
                }
            }
        }
    }

    // 🏦 MICRO-LOANS
    applyForLoan(workerId, loanType, requestedAmount, purpose) {
        const product = this.financialProducts.get(loanType);
        if (!product || product.type !== 'loan') {
            return { success: false, error: 'Invalid loan product' };
        }

        const creditProfile = this.creditProfiles.get(workerId);
        const worker = this.workers.get(workerId);
        
        if (!creditProfile || !worker) {
            return { success: false, error: 'Worker or credit profile not found' };
        }

        // Check eligibility
        const eligibility = this.assessLoanEligibility(workerId, loanType, requestedAmount);
        
        if (!eligibility.eligible) {
            return { success: false, error: eligibility.reason };
        }

        const loanId = `LOAN_${Date.now()}`;
        const loan = {
            id: loanId,
            workerId,
            productType: loanType,
            principalAmount: requestedAmount,
            interestRate: product.interestRate,
            termMonths: product.termMonths,
            purpose,
            status: 'approved',
            disbursedAmount: requestedAmount,
            outstandingBalance: requestedAmount,
            monthlyPayment: this.calculateMonthlyPayment(requestedAmount, product.interestRate, product.termMonths),
            repaymentSchedule: this.generateRepaymentSchedule(requestedAmount, product.interestRate, product.termMonths),
            disbursementDate: new Date(),
            nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            payments: [],
            createdAt: new Date()
        };

        this.loans.set(loanId, loan);
        
        // Update credit profile
        creditProfile.totalDebt += requestedAmount;
        
        // Disburse to savings account (simplified)
        this.depositToSavings(workerId, requestedAmount, 'loan_disbursement');
        
        console.log(`🏦 Loan approved for ${worker.name}: KES ${requestedAmount} (${loanType})`);
        
        return { success: true, loanId, loan };
    }

    assessLoanEligibility(workerId, loanType, requestedAmount) {
        const worker = this.workers.get(workerId);
        const creditProfile = this.creditProfiles.get(workerId);
        const product = this.financialProducts.get(loanType);
        
        // Check basic requirements
        const employmentMonths = (new Date() - worker.startDate) / (1000 * 60 * 60 * 24 * 30);
        
        if (loanType === 'emergency_loan' && employmentMonths < 3) {
            return { eligible: false, reason: 'Minimum 3 months employment required' };
        }
        
        if (loanType === 'productive_loan' && employmentMonths < 12) {
            return { eligible: false, reason: 'Minimum 12 months employment required' };
        }

        // Check amount limits
        if (requestedAmount > product.maxAmount) {
            return { eligible: false, reason: `Maximum amount is KES ${product.maxAmount}` };
        }

        // Check credit score
        const minCreditScore = loanType === 'emergency_loan' ? 400 : 500;
        if (creditProfile.creditScore < minCreditScore) {
            return { eligible: false, reason: `Credit score too low (${creditProfile.creditScore})` };
        }

        // Check debt-to-income ratio
        const monthlyIncome = creditProfile.incomeVerification.averageMonthlyIncome;
        const monthlyPayment = this.calculateMonthlyPayment(requestedAmount, product.interestRate, product.termMonths);
        const debtToIncomeRatio = (creditProfile.totalDebt + monthlyPayment) / monthlyIncome;
        
        if (debtToIncomeRatio > 0.4) { // 40% DTI limit
            return { eligible: false, reason: 'Debt-to-income ratio too high' };
        }

        return { eligible: true };
    }

    calculateMonthlyPayment(principal, annualRate, months) {
        const monthlyRate = annualRate / 12;
        return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
               (Math.pow(1 + monthlyRate, months) - 1);
    }

    generateRepaymentSchedule(principal, annualRate, months) {
        const monthlyRate = annualRate / 12;
        const monthlyPayment = this.calculateMonthlyPayment(principal, annualRate, months);
        const schedule = [];
        
        let balance = principal;
        let paymentDate = new Date();
        
        for (let i = 1; i <= months; i++) {
            paymentDate = new Date(paymentDate.getTime() + 30 * 24 * 60 * 60 * 1000);
            const interestPayment = balance * monthlyRate;
            const principalPayment = monthlyPayment - interestPayment;
            balance -= principalPayment;
            
            schedule.push({
                paymentNumber: i,
                dueDate: new Date(paymentDate),
                principalPayment: principalPayment,
                interestPayment: interestPayment,
                totalPayment: monthlyPayment,
                remainingBalance: Math.max(0, balance),
                status: 'pending'
            });
        }
        
        return schedule;
    }

    makeLoanPayment(loanId, amount) {
        const loan = this.loans.get(loanId);
        if (!loan) {
            return { success: false, error: 'Loan not found' };
        }

        const worker = this.workers.get(loan.workerId);
        
        // Check if payment can be made from savings
        const savingsBalance = this.getSavingsAccountBalance(loan.workerId);
        if (savingsBalance < amount) {
            return { success: false, error: 'Insufficient savings balance' };
        }

        // Withdraw from savings for payment
        const withdrawal = this.withdrawFromSavings(loan.workerId, amount, 'loan_payment');
        if (!withdrawal.success) {
            return withdrawal;
        }

        // Apply payment to loan
        loan.outstandingBalance -= amount;
        
        const payment = {
            id: `PAY_${Date.now()}`,
            amount,
            date: new Date(),
            outstandingBalance: loan.outstandingBalance
        };
        
        loan.payments.push(payment);
        
        // Update next payment date
        loan.nextPaymentDate = new Date(loan.nextPaymentDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        
        // Update credit profile
        const creditProfile = this.creditProfiles.get(loan.workerId);
        creditProfile.paymentHistory.push({
            loanId,
            amount,
            date: new Date(),
            status: 'on_time'
        });
        
        console.log(`💳 Loan payment made by ${worker.name}: KES ${amount} (Remaining: KES ${loan.outstandingBalance.toFixed(2)})`);
        
        return { success: true, payment, remainingBalance: loan.outstandingBalance };
    }

    // 🤝 COOPERATIVE SAVINGS GROUPS (CHAMA)
    createCooperative(name, description, targetMembers) {
        const cooperativeId = `COOP_${Date.now()}`;
        const cooperative = {
            id: cooperativeId,
            name,
            description,
            targetMembers,
            members: [],
            contributionAmount: 0,
            contributionFrequency: 'monthly',
            totalFunds: 0,
            loanFund: 0,
            emergencyFund: 0,
            rules: {
                minimumContribution: 500,
                loanInterestRate: 0.10, // 10% annual
                maxLoanAmount: 0, // Will be calculated based on contributions
                repaymentPeriod: 12 // months
            },
            meetings: [],
            loans: [],
            createdAt: new Date(),
            status: 'active'
        };

        this.cooperatives.set(cooperativeId, cooperative);
        
        console.log(`🤝 Cooperative created: ${name} (ID: ${cooperativeId})`);
        return { success: true, cooperativeId, cooperative };
    }

    joinCooperative(workerId, cooperativeId) {
        const worker = this.workers.get(workerId);
        const cooperative = this.cooperatives.get(cooperativeId);
        
        if (!worker || !cooperative) {
            return { success: false, error: 'Worker or cooperative not found' };
        }

        if (cooperative.members.find(m => m.workerId === workerId)) {
            return { success: false, error: 'Already a member' };
        }

        const member = {
            workerId,
            name: worker.name,
            joinDate: new Date(),
            contributions: [],
            totalContributed: 0,
            loansReceived: [],
            status: 'active'
        };

        cooperative.members.push(member);
        
        console.log(`🤝 ${worker.name} joined cooperative: ${cooperative.name}`);
        return { success: true, member };
    }

    // 📚 FINANCIAL LITERACY EDUCATION
    createFinancialLiteracyModule(title, content, level) {
        const moduleId = `EDU_${Date.now()}`;
        const module = {
            id: moduleId,
            title,
            content,
            level, // beginner, intermediate, advanced
            topics: [],
            quizzes: [],
            completionReward: 50, // KES reward for completion
            duration: 30, // minutes
            createdAt: new Date()
        };

        console.log(`📚 Financial literacy module created: ${title}`);
        return { success: true, moduleId, module };
    }

    enrollWorkerInEducation(workerId, moduleId) {
        const worker = this.workers.get(workerId);
        if (!worker) {
            return { success: false, error: 'Worker not found' };
        }

        if (!this.educationProgress.has(workerId)) {
            this.educationProgress.set(workerId, []);
        }

        const progress = {
            moduleId,
            enrollmentDate: new Date(),
            progress: 0,
            completed: false,
            quizScore: 0
        };

        this.educationProgress.get(workerId).push(progress);
        
        console.log(`📚 ${worker.name} enrolled in financial literacy education`);
        return { success: true, progress };
    }

    // 📊 PAYROLL INTEGRATION
    recordPayroll(workerId, payrollData) {
        const payrollId = `PAY_${Date.now()}`;
        const payroll = {
            id: payrollId,
            workerId,
            period: payrollData.period,
            daysWorked: payrollData.daysWorked,
            hoursWorked: payrollData.hoursWorked,
            hourlyRate: payrollData.hourlyRate,
            grossPay: payrollData.grossPay,
            deductions: payrollData.deductions || {},
            netPay: payrollData.netPay,
            bonuses: payrollData.bonuses || {},
            date: new Date(),
            autoSavingsDeduction: 0
        };

        // Auto-savings deduction if enabled
        const worker = this.workers.get(workerId);
        const accounts = Array.from(this.savingsAccounts.values()).filter(acc => acc.workerId === workerId);
        
        if (accounts.length > 0 && accounts[0].autoDeposit.enabled) {
            const autoAmount = accounts[0].autoDeposit.amount;
            if (payroll.netPay >= autoAmount) {
                payroll.autoSavingsDeduction = autoAmount;
                payroll.netPay -= autoAmount;
                
                // Make automatic deposit
                this.depositToSavings(workerId, autoAmount, 'auto_deduction');
            }
        }

        if (!this.payrollData.has(workerId)) {
            this.payrollData.set(workerId, []);
        }
        this.payrollData.get(workerId).push(payroll);

        // Update credit profile with new payroll data
        this.updateCreditProfile(workerId, this.payrollData.get(workerId), this.productionData.get(workerId) || []);
        
        console.log(`💰 Payroll recorded for ${worker.name}: KES ${payroll.netPay} (Period: ${payroll.period})`);
        return { success: true, payrollId, payroll };
    }

    // 📈 PRODUCTION DATA INTEGRATION
    recordProductionData(workerId, productionData) {
        const productionId = `PROD_${Date.now()}`;
        const production = {
            id: productionId,
            workerId,
            task: productionData.task,
            quantity: productionData.quantity,
            quality: productionData.quality,
            date: productionData.date || new Date(),
            supervisor: productionData.supervisor,
            notes: productionData.notes,
            productivityScore: productionData.productivityScore || 0.8,
            qualityScore: productionData.qualityScore || 0.8
        };

        if (!this.productionData.has(workerId)) {
            this.productionData.set(workerId, []);
        }
        this.productionData.get(workerId).push(production);

        // Update credit profile with production data
        this.updateCreditProfile(workerId, this.payrollData.get(workerId) || [], this.productionData.get(workerId));
        
        const worker = this.workers.get(workerId);
        console.log(`📈 Production data recorded for ${worker.name}: ${production.task} (Score: ${production.productivityScore})`);
        
        return { success: true, productionId, production };
    }

    // 📊 ANALYTICS AND REPORTING
    generateWorkerFinancialReport(workerId) {
        const worker = this.workers.get(workerId);
        const creditProfile = this.creditProfiles.get(workerId);
        const savingsBalance = this.getSavingsAccountBalance(workerId);
        const loans = Array.from(this.loans.values()).filter(loan => loan.workerId === workerId);
        const payrolls = this.payrollData.get(workerId) || [];
        
        const totalDebt = loans.reduce((sum, loan) => sum + loan.outstandingBalance, 0);
        const monthlyIncome = payrolls.length > 0 ? 
            payrolls.slice(-3).reduce((sum, p) => sum + p.netPay, 0) / Math.min(3, payrolls.length) : 0;

        return {
            worker: {
                name: worker.name,
                position: worker.position,
                employmentDuration: Math.floor((new Date() - worker.startDate) / (1000 * 60 * 60 * 24 * 30)) // months
            },
            creditProfile: {
                score: creditProfile.creditScore,
                riskLevel: creditProfile.riskAssessment,
                monthlyIncome: creditProfile.incomeVerification.averageMonthlyIncome,
                incomeStability: creditProfile.incomeVerification.incomeStability
            },
            financialPosition: {
                savings: savingsBalance,
                totalDebt,
                netWorth: savingsBalance - totalDebt,
                debtToIncomeRatio: monthlyIncome > 0 ? totalDebt / monthlyIncome : 0
            },
            loans: {
                active: loans.filter(l => l.outstandingBalance > 0).length,
                totalBorrowed: loans.reduce((sum, l) => sum + l.principalAmount, 0),
                totalOutstanding: totalDebt
            },
            recommendations: this.generateFinancialRecommendations(workerId)
        };
    }

    generateFinancialRecommendations(workerId) {
        const worker = this.workers.get(workerId);
        const creditProfile = this.creditProfiles.get(workerId);
        const savingsBalance = this.getSavingsAccountBalance(workerId);
        const loans = Array.from(this.loans.values()).filter(loan => loan.workerId === workerId);
        const payrolls = this.payrollData.get(workerId) || [];
        
        const totalDebt = loans.reduce((sum, loan) => sum + loan.outstandingBalance, 0);
        const monthlyIncome = payrolls.length > 0 ? 
            payrolls.slice(-3).reduce((sum, p) => sum + p.netPay, 0) / Math.min(3, payrolls.length) : 0;

        const recommendations = [];

        if (savingsBalance < creditProfile.incomeVerification.averageMonthlyIncome) {
            recommendations.push({
                type: 'savings',
                priority: 'high',
                message: 'Build emergency fund to 1 month of income',
                action: 'Increase monthly savings contributions'
            });
        }

        if (creditProfile.creditScore < 600) {
            recommendations.push({
                type: 'credit',
                priority: 'medium',
                message: 'Improve credit score through consistent payments',
                action: 'Complete financial literacy training'
            });
        }

        const debtToIncomeRatio = monthlyIncome > 0 ? totalDebt / monthlyIncome : 0;
        if (debtToIncomeRatio > 0.3) {
            recommendations.push({
                type: 'debt',
                priority: 'high',
                message: 'Reduce debt burden',
                action: 'Focus on loan repayment before new borrowing'
            });
        }

        return recommendations;
    }

    // 🎬 DEMONSTRATION
    demonstrateFinancialEmpowerment() {
        console.log('\n🎬 FARMWORKER FINANCIAL EMPOWERMENT DEMONSTRATION\n');

        // Register sample workers
        const workers = [
            {
                employeeId: 'EMP001',
                name: 'Sarah Wanjiku',
                phone: '+254712345678',
                nationalId: '12345678',
                position: 'Farm Supervisor',
                department: 'Livestock',
                bankAccount: 'ACC001'
            },
            {
                employeeId: 'EMP002',
                name: 'John Kipchoge',
                phone: '+254723456789',
                nationalId: '23456789',
                position: 'Animal Caretaker',
                department: 'Livestock',
                bankAccount: 'ACC002'
            }
        ];

        const registeredWorkers = [];
        for (const workerData of workers) {
            const result = this.registerWorker(workerData);
            registeredWorkers.push(result.workerId);
        }

        console.log('\n📊 SIMULATING PAYROLL AND PRODUCTION DATA...');
        
        // Simulate payroll data for 6 months
        for (let month = 0; month < 6; month++) {
            for (const workerId of registeredWorkers) {
                const worker = this.workers.get(workerId);
                const baseSalary = worker.position === 'Farm Supervisor' ? 25000 : 18000;
                
                this.recordPayroll(workerId, {
                    period: `2024-${String(month + 1).padStart(2, '0')}`,
                    daysWorked: 22,
                    hoursWorked: 176,
                    hourlyRate: baseSalary / 176,
                    grossPay: baseSalary,
                    deductions: { tax: baseSalary * 0.1, insurance: 500 },
                    netPay: baseSalary * 0.9 - 500
                });

                // Record production data
                this.recordProductionData(workerId, {
                    task: 'Animal Care',
                    quantity: Math.floor(Math.random() * 50) + 20,
                    quality: 'Good',
                    productivityScore: 0.7 + Math.random() * 0.3,
                    qualityScore: 0.8 + Math.random() * 0.2
                });
            }
        }

        console.log('\n💰 DEMONSTRATING SAVINGS AND LOANS...');
        
        // Enable auto-savings and make deposits
        for (const workerId of registeredWorkers) {
            const accounts = Array.from(this.savingsAccounts.values()).filter(acc => acc.workerId === workerId);
            if (accounts.length > 0) {
                accounts[0].autoDeposit = {
                    enabled: true,
                    amount: 2000,
                    frequency: 'monthly'
                };
            }
            
            // Manual deposits
            this.depositToSavings(workerId, 5000, 'initial_deposit');
            this.depositToSavings(workerId, 3000, 'bonus_savings');
        }

        // Apply for loans
        const loanApplication1 = this.applyForLoan(registeredWorkers[0], 'emergency_loan', 8000, 'Medical emergency');
        const loanApplication2 = this.applyForLoan(registeredWorkers[1], 'productive_loan', 25000, 'Small business startup');

        console.log('\n📚 FINANCIAL LITERACY ENROLLMENT...');
        
        // Create and enroll in financial education
        const eduModule = this.createFinancialLiteracyModule(
            'Basic Financial Management',
            'Introduction to budgeting, saving, and credit',
            'beginner'
        );
        
        for (const workerId of registeredWorkers) {
            this.enrollWorkerInEducation(workerId, eduModule.moduleId);
        }

        console.log('\n🤝 COOPERATIVE SAVINGS GROUP...');
        
        // Create cooperative
        const cooperative = this.createCooperative(
            'Mountain Goat Farm Workers Chama',
            'Cooperative savings group for farm workers',
            10
        );
        
        // Join cooperative
        for (const workerId of registeredWorkers) {
            this.joinCooperative(workerId, cooperative.cooperativeId);
        }

        console.log('\n📊 FINANCIAL REPORTS...');
        
        // Generate reports
        for (const workerId of registeredWorkers) {
            const report = this.generateWorkerFinancialReport(workerId);
            console.log(`\n💼 Financial Report for ${report.worker.name}:`);
            console.log(`   Credit Score: ${report.creditProfile.score} (${report.creditProfile.riskLevel} risk)`);
            console.log(`   Savings: KES ${report.financialPosition.savings.toFixed(2)}`);
            console.log(`   Monthly Income: KES ${report.creditProfile.monthlyIncome.toFixed(2)}`);
            console.log(`   Active Loans: ${report.loans.active}`);
            console.log(`   Net Worth: KES ${report.financialPosition.netWorth.toFixed(2)}`);
            
            if (report.recommendations.length > 0) {
                console.log(`   Recommendations:`);
                report.recommendations.forEach(rec => {
                    console.log(`   - ${rec.message} (${rec.priority} priority)`);
                });
            }
        }

        console.log('\n🎯 Farmworker Financial Empowerment Platform Demonstration Complete!');
    }

    // 🚀 DEMO DATA CREATION
    createDemoData() {
        // Initialize platform with demo data
        console.log('🎬 Initializing demo data...');
        
        // Create financial literacy modules
        this.createFinancialLiteracyModule(
            'Budgeting Basics',
            'Learn how to create and manage a personal budget',
            'beginner'
        );
        
        this.createFinancialLiteracyModule(
            'Understanding Credit',
            'How credit works and how to build a good credit history',
            'intermediate'
        );
        
        this.createFinancialLiteracyModule(
            'Investment Fundamentals',
            'Introduction to saving and investing for the future',
            'advanced'
        );
        
        console.log('✅ Demo data initialization complete!');
    }
}

// 🚀 Initialize the Financial Empowerment Platform
console.log('💰 Initializing Farmworker Financial Empowerment Platform...\n');
const financialPlatform = new FarmworkerFinancialEmpowermentPlatform();

// Export for integration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FarmworkerFinancialEmpowermentPlatform };
}
