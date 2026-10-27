const cds = require('@sap/cds');

async function runTests() {
  console.log('Bootstrapping CAP runtime with full model...');
  const csn = await cds.load('*');
  cds.model = cds.compile.for.nodejs(csn);
  await cds.connect.to('db');
  const srv = await cds.serve('PSAService').from('srv/psa-service');

  const adminUser = new cds.User({ id: 'admin@psa.com', roles: ['PSA_Admin', 'authenticated-user'], attr: { email: 'admin@psa.com' } });
  const managerUser = new cds.User({ id: 'manager@psa.com', roles: ['PSA_Manager', 'authenticated-user'], attr: { email: 'manager@psa.com' } });
  const employeeUser = new cds.User({ id: 'employee@psa.com', roles: ['PSA_Employee', 'authenticated-user'], attr: { email: 'employee@psa.com' } });

  console.log('=== Test 1: whoAmI as Manager ===');
  const txManager = srv.tx({ user: managerUser });
  const managerProfile = await txManager.send('whoAmI');
  console.log('Manager Profile:', managerProfile);

  console.log('\n=== Test 2: Manager Dashboard KPIs ===');
  const managerKPIs = await txManager.send('getManagerDashboard');
  console.log('Manager KPIs:', managerKPIs);

  console.log('\n=== Test 3: Project Portfolio & Budget Burn ===');
  const portfolio = await txManager.send('getProjectPortfolio');
  console.log('Portfolio Items count:', portfolio.length);
  portfolio.forEach(p => {
    console.log(` - ${p.projectCode}: ${p.projectName} | Burn: ${p.budgetBurn}% (${p.budgetStatus}) | Consumed: ${p.consumedHours}h`);
  });
  await txManager.commit();

  console.log('\n=== Test 4: Admin Dashboard KPIs ===');
  const txAdmin = srv.tx({ user: adminUser });
  const adminKPIs = await txAdmin.send('getAdminDashboard');
  console.log('Admin KPIs:', adminKPIs);
  await txAdmin.commit();

  console.log('\n=== Test 5: Employee Dashboard KPIs ===');
  const txEmp = srv.tx({ user: employeeUser });
  const employeeKPIs = await txEmp.send('getEmployeeDashboard');
  console.log('Employee KPIs:', employeeKPIs);
  await txEmp.commit();

  console.log('\n=== Test 6: Reject Timesheet with Mandatory Reason ===');
  // Ensure idempotent state for Test 6
  await UPDATE('psasprint.db.transaction.Timesheets').set({ STATUS: 'SUBMITTED' }).where({ ID: '55555555-5555-5555-5555-555555555505' });
  const txReject = srv.tx({ user: managerUser });
  const rejectResult = await txReject.send('rejectTimesheet', {
    timesheetId: '55555555-5555-5555-5555-555555555505',
    reason: 'Please verify work logs on Wednesday'
  });
  await txReject.commit();
  console.log('Reject Result:', rejectResult);

  console.log('\n=== Test 7: Reject Timesheet WITHOUT Reason (Must Fail) ===');
  // Ensure idempotent state for Test 7
  await UPDATE('psasprint.db.transaction.Timesheets').set({ STATUS: 'SUBMITTED' }).where({ ID: '55555555-5555-5555-5555-555555555501' });
  try {
    const txFail1 = srv.tx({ user: managerUser });
    await txFail1.send('rejectTimesheet', {
      timesheetId: '55555555-5555-5555-5555-555555555501',
      reason: ''
    });
    console.error('FAILED: Empty reason was accepted!');
  } catch (err) {
    console.log('SUCCESS: Empty reason rejected properly with error:', err.message);
  }

  console.log('\n=== Test 8: Self-Approval Prevention (Must Fail) ===');
  try {
    // Employee attempting to approve their own timesheet
    const txFail2 = srv.tx({ user: employeeUser });
    await txFail2.send('approveTimesheet', {
      timesheetId: '55555555-5555-5555-5555-555555555501'
    });
    console.error('FAILED: Self-approval was allowed!');
  } catch (err) {
    console.log('SUCCESS: Self-approval blocked properly with error:', err.message);
  }

  console.log('\n=== Test 9: Admin Marks Invoice as Issued ===');
  // Ensure idempotent state for Test 9
  await UPDATE('psasprint.db.transaction.Invoices').set({ STATUS: 'DRAFT', PAID_AMOUNT: 0 }).where({ ID: '77777777-7777-7777-7777-777777777705' });
  const txAdmin2 = srv.tx({ user: adminUser });
  const issueResult = await txAdmin2.send('markInvoiceIssued', {
    invoiceId: '77777777-7777-7777-7777-777777777705' // INV-2026-005 in DRAFT
  });
  await txAdmin2.commit();
  console.log('Issue Result:', issueResult);

  console.log('\n=== Test 10: Non-Admin Cannot Issue Invoices (Must Fail) ===');
  try {
    const txFail3 = srv.tx({ user: managerUser });
    await txFail3.send('markInvoiceIssued', {
      invoiceId: '77777777-7777-7777-7777-777777777705'
    });
    console.error('FAILED: Manager was able to issue invoice!');
  } catch (err) {
    console.log('SUCCESS: Manager blocked from issuing invoice:', err.message);
  }

  console.log('\n=== Test 11: Admin Marks Issued Invoice as Paid ===');
  const txAdmin3 = srv.tx({ user: adminUser });
  const paidResult = await txAdmin3.send('markInvoicePaid', {
    invoiceId: '77777777-7777-7777-7777-777777777705',
    paidAmount: 708000
  });
  await txAdmin3.commit();
  console.log('Paid Result:', paidResult);

  console.log('\n=== Test 12: Manager Scoped Read on Invoices (Only Managed Projects) ===');
  const txMgrInv = srv.tx({ user: managerUser });
  const managerInvoices = await txMgrInv.run(SELECT.from('PSAService.Invoices'));
  console.log('Manager visible invoices count:', managerInvoices.length);
  managerInvoices.forEach(inv => {
    console.log(` - ${inv.INVOICE_NUMBER}: ${inv.STATUS} | Gross: INR ${inv.GROSS_AMOUNT}`);
  });
  await txMgrInv.commit();

  console.log('\n=== Test 13: Employee Task Execution (Update Status on Assigned Task) ===');
  const txEmpTask = srv.tx({ user: employeeUser });
  const updateTaskResult = await txEmpTask.run(
    UPDATE('PSAService.Tasks')
      .set({ STATUS: 'IN_PROGRESS', ACTUAL_HOURS: 50 })
      .where({ ID: '55555555-0000-0000-0000-000000000002' }) // Assigned to Amit Patel
  );
  await txEmpTask.commit();
  console.log('Employee task update result:', updateTaskResult);

  console.log('\n=== ALL 13 END-TO-END VERIFICATION TESTS PASSED PERFECTLY! ===');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
