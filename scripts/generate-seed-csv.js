const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'db', 'data');
fs.mkdirSync(dataDir, { recursive: true });

function writeCsv(filename, headers, rows) {
  const content = [
    headers.join(','),
    ...rows.map(r => r.map(val => {
      if (val === null || val === undefined) return '';
      const s = String(val);
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    }).join(','))
  ].join('\n');
  fs.writeFileSync(path.join(dataDir, filename), content, 'utf8');
  console.log(`Created ${filename} (${rows.length} records)`);
}

// 1. Clients
writeCsv('psasprint.db.master-Clients.csv',
  ['ID', 'CLIENT_CODE', 'CLIENT_NAME', 'EMAIL', 'PHONE', 'CONTACT_PERSON', 'STATUS', 'STREET', 'CITY', 'STATE', 'COUNTRY', 'ZIP_CODE'],
  [
    ['22222222-2222-2222-2222-222222222201', 'C001', 'TechCorp India', 'contact@techcorp.in', '+91-80-23456789', 'Anand Verma', 'ACTIVE', '100 Outer Ring Road', 'Bengaluru', 'Karnataka', 'India', '560103'],
    ['22222222-2222-2222-2222-222222222202', 'C002', 'Global Solutions Ltd', 'info@globalsolutions.com', '+91-22-67890123', 'Sunita Rao', 'ACTIVE', '500 BKC Avenue', 'Mumbai', 'Maharashtra', 'India', '400051'],
    ['22222222-2222-2222-2222-222222222203', 'C003', 'NextGen Systems', 'support@nextgensys.com', '+91-44-34567890', 'Karthik N', 'INACTIVE', '25 OMR Tech Park', 'Chennai', 'Tamil Nadu', 'India', '600096'],
    ['22222222-2222-2222-2222-222222222204', 'C004', 'StartUp Ventures', 'founders@startupv.io', '+91-11-45678901', 'Deepak Goyal', 'PROSPECT', '12 Barakhamba Road', 'New Delhi', 'Delhi', 'India', '110001']
  ]
);

// 2. Employees
writeCsv('psasprint.db.master-Employees.csv',
  ['ID', 'EMPLOYEE_CODE', 'FIRST_NAME', 'LAST_NAME', 'FULL_NAME', 'EMAIL', 'PHONE', 'ROLE', 'DEPARTMENT', 'STATUS', 'AUTH_ID', 'manager_ID'],
  [
    ['11111111-1111-1111-1111-111111111101', 'E001', 'Rajesh', 'Kumar', 'Rajesh Kumar', 'admin@psa.com', '+91-9876543210', 'ADMIN', 'Executive', 'ACTIVE', 'admin@psa.com', null],
    ['11111111-1111-1111-1111-111111111102', 'E002', 'Priya', 'Sharma', 'Priya Sharma', 'manager@psa.com', '+91-9876543211', 'MANAGER', 'Delivery', 'ACTIVE', 'manager@psa.com', '11111111-1111-1111-1111-111111111101'],
    ['11111111-1111-1111-1111-111111111103', 'E003', 'Amit', 'Patel', 'Amit Patel', 'employee@psa.com', '+91-9876543212', 'EMPLOYEE', 'Delivery', 'ACTIVE', 'employee@psa.com', '11111111-1111-1111-1111-111111111102'],
    ['11111111-1111-1111-1111-111111111104', 'E004', 'Sneha', 'Reddy', 'Sneha Reddy', 'emp2@psa.com', '+91-9876543213', 'EMPLOYEE', 'Delivery', 'ACTIVE', 'emp2@psa.com', '11111111-1111-1111-1111-111111111102'],
    ['11111111-1111-1111-1111-111111111105', 'E005', 'Vikram', 'Singh', 'Vikram Singh', 'vikram@psa.com', '+91-9876543214', 'MANAGER', 'Consulting', 'ACTIVE', 'vikram@psa.com', '11111111-1111-1111-1111-111111111101'],
    ['11111111-1111-1111-1111-111111111106', 'E006', 'Meera', 'Joshi', 'Meera Joshi', 'meera@psa.com', '+91-9876543215', 'EMPLOYEE', 'Consulting', 'ACTIVE', 'meera@psa.com', '11111111-1111-1111-1111-111111111105']
  ]
);

// 3. Projects
writeCsv('psasprint.db.transaction-Projects.csv',
  ['ID', 'PROJECT_CODE', 'PROJECT_NAME', 'DESCRIPTION', 'STATUS', 'BILLING_TYPE', 'PLANNED_HOURS', 'START_DATE', 'END_DATE', 'client_ID', 'manager_ID'],
  [
    ['33333333-3333-3333-3333-333333333301', 'P001', 'ERP Migration', 'Core ERP system migration to SAP S/4HANA Cloud', 'ACTIVE', 'T_AND_M', 2000.00, '2026-01-15', '2026-12-31', '22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111102'],
    ['33333333-3333-3333-3333-333333333302', 'P002', 'Mobile App Dev', 'B2B field services iOS & Android app using SAP Fiori', 'ACTIVE', 'FIXED_PRICE', 1500.00, '2026-03-01', '2026-09-30', '22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111102'],
    ['33333333-3333-3333-3333-333333333303', 'P003', 'Data Analytics Platform', 'Enterprise data lake and BI dashboard consolidation', 'PLANNING', 'T_AND_M', 2500.00, '2026-06-01', '2027-03-31', '22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111105'],
    ['33333333-3333-3333-3333-333333333304', 'P004', 'Legacy Modernization', 'Refactoring legacy mainframe services into microservices', 'ON_HOLD', 'T_AND_M', 1800.00, '2025-11-01', '2026-08-31', '22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111105'],
    ['33333333-3333-3333-3333-333333333305', 'P005', 'Cloud Infrastructure', 'Internal cloud infrastructure optimization & automation', 'ACTIVE', 'NON_BILLABLE', 800.00, '2026-02-01', '2026-11-30', '22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111102']
  ]
);

// 4. ProjectAssignments
writeCsv('psasprint.db.transaction-ProjectAssignments.csv',
  ['ID', 'project_ID', 'employee_ID', 'ROLE_ON_PROJECT', 'ASSIGNED_DATE'],
  [
    ['33333333-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111103', 'Lead Developer', '2026-01-15'],
    ['33333333-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111103', 'Senior Consultant', '2026-03-01'],
    ['33333333-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111104', 'QA Engineer', '2026-01-20'],
    ['33333333-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333305', '11111111-1111-1111-1111-111111111104', 'Cloud Architect', '2026-02-01'],
    ['33333333-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111106', 'Data Scientist', '2026-06-01'],
    ['33333333-0000-0000-0000-000000000006', '33333333-3333-3333-3333-333333333304', '11111111-1111-1111-1111-111111111106', 'Backend Specialist', '2025-11-01'],
    ['33333333-0000-0000-0000-000000000007', '33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111102', 'Project Manager', '2026-01-15'],
    ['33333333-0000-0000-0000-000000000008', '33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111105', 'Project Manager', '2026-06-01']
  ]
);

// 5. Budgets (Demonstrating Green <80%, Amber 80-99%, Red >=100%)
writeCsv('psasprint.db.transaction-Budgets.csv',
  ['ID', 'BUDGET_CODE', 'BUDGET_NAME', 'TOTAL_AMOUNT', 'CONSUMED_AMOUNT', 'CURRENCY', 'STATUS', 'PERIOD_START', 'PERIOD_END', 'project_ID', 'responsible_ID'],
  [
    ['44444444-4444-4444-4444-444444444401', 'B001', 'ERP Migration FY26 Budget', 5000000.00, 3500000.00, 'INR', 'APPROVED', '2026-01-01', '2026-12-31', '33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111102'], // 70% Green
    ['44444444-4444-4444-4444-444444444402', 'B002', 'Mobile App Dev Q1-Q3', 3000000.00, 2600000.00, 'INR', 'APPROVED', '2026-03-01', '2026-09-30', '33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111102'], // 86.6% Amber (At-risk)
    ['44444444-4444-4444-4444-444444444403', 'B003', 'Data Analytics Phase 1', 8000000.00, 0.00, 'INR', 'DRAFT', '2026-06-01', '2027-03-31', '33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111105'], // 0% Draft
    ['44444444-4444-4444-4444-444444444404', 'B004', 'Legacy Modernization Overrun', 2000000.00, 2100000.00, 'INR', 'EXCEEDED', '2025-11-01', '2026-08-31', '33333333-3333-3333-3333-333333333304', '11111111-1111-1111-1111-111111111105'], // 105% Red
    ['44444444-4444-4444-4444-444444444405', 'B005', 'Cloud Infra Operations', 1000000.00, 400000.00, 'INR', 'APPROVED', '2026-02-01', '2026-11-30', '33333333-3333-3333-3333-333333333305', '11111111-1111-1111-1111-111111111102']  // 40% Green
  ]
);

// 6. Milestones
writeCsv('psasprint.db.transaction-Milestones.csv',
  ['ID', 'MILESTONE_NAME', 'DESCRIPTION', 'DUE_DATE', 'STATUS', 'COMPLETED_DATE', 'COMPLETION_PCT', 'project_ID', 'responsible_ID'],
  [
    ['44444444-0000-0000-0000-000000000001', 'Blueprint Signoff', 'Detailed technical blueprint approved by client steering committee', '2026-03-15', 'COMPLETED', '2026-03-12', 100.00, '33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111102'],
    ['44444444-0000-0000-0000-000000000002', 'Data Migration Wave 1', 'Master data migration from legacy SAP ECC to S/4HANA', '2026-07-31', 'COMPLETED', '2026-07-28', 100.00, '33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111103'],
    ['44444444-0000-0000-0000-000000000003', 'Go-Live Cutover', 'Final cutover and production system availability', '2026-12-15', 'PENDING', null, 25.00, '33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111102'],
    ['44444444-0000-0000-0000-000000000004', 'Beta Release Delivery', 'Field services mobile app distributed to test user group', '2026-06-30', 'COMPLETED', '2026-06-25', 100.00, '33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111103'],
    ['44444444-0000-0000-0000-000000000005', 'Store Submission', 'Production submission to Apple App Store and Google Play', '2026-09-15', 'OVERDUE', null, 80.00, '33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111102'],
    ['44444444-0000-0000-0000-000000000006', 'Infrastructure Validation', 'Security hardening and load test pass report', '2026-10-31', 'PENDING', null, 60.00, '33333333-3333-3333-3333-333333333305', '11111111-1111-1111-1111-111111111104']
  ]
);

// 7. Tasks
writeCsv('psasprint.db.transaction-Tasks.csv',
  ['ID', 'TASK_TITLE', 'DESCRIPTION', 'DUE_DATE', 'STATUS', 'PRIORITY', 'ESTIMATED_HOURS', 'ACTUAL_HOURS', 'project_ID', 'assignedTo_ID'],
  [
    ['55555555-0000-0000-0000-000000000001', 'Database Schema Mapping', 'Map ECC table structures to S/4HANA CDS views', '2026-05-31', 'COMPLETED', 'HIGH', 120.00, 115.00, '33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111103'],
    ['55555555-0000-0000-0000-000000000002', 'Interface Testing - Bank Feeds', 'End-to-end integration test with standard host-to-host bank API', '2026-11-15', 'IN_PROGRESS', 'CRITICAL', 80.00, 45.00, '33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111103'],
    ['55555555-0000-0000-0000-000000000003', 'User Acceptance Script Preparation', 'Create test script catalog for finance business users', '2026-11-20', 'OPEN', 'MEDIUM', 40.00, 0.00, '33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111104'],
    ['55555555-0000-0000-0000-000000000004', 'Push Notification Integration', 'Implement Firebase Cloud Messaging in Cordova wrapper', '2026-08-15', 'COMPLETED', 'HIGH', 60.00, 58.00, '33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111103'],
    ['55555555-0000-0000-0000-000000000005', 'Offline Sync Bug Fixes', 'Resolve conflict resolution edge case on slow 3G network', '2026-09-10', 'BLOCKED', 'CRITICAL', 30.00, 20.00, '33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111103'],
    ['55555555-0000-0000-0000-000000000006', 'Terraform Script Modularization', 'Refactor BTP resource provisioning templates', '2026-10-30', 'IN_PROGRESS', 'MEDIUM', 50.00, 32.00, '33333333-3333-3333-3333-333333333305', '11111111-1111-1111-1111-111111111104'],
    ['55555555-0000-0000-0000-000000000007', 'Analytics Schema Design', 'Design dimension and fact star schema in HANA Cloud', '2026-12-01', 'OPEN', 'HIGH', 100.00, 0.00, '33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111106'],
    ['55555555-0000-0000-0000-000000000008', 'COBOL Routine Reverse Engineering', 'Extract calculation formulas from batch tax calculation', '2026-07-15', 'CANCELLED', 'LOW', 40.00, 10.00, '33333333-3333-3333-3333-333333333304', '11111111-1111-1111-1111-111111111106']
  ]
);

// 8. Timesheets (Demonstrating DRAFT, SUBMITTED, APPROVED, REJECTED)
writeCsv('psasprint.db.transaction-Timesheets.csv',
  ['ID', 'WEEK_START', 'SUBMISSION_DATE', 'STATUS', 'TOTAL_HOURS', 'REJECTION_REASON', 'APPROVED_AT', 'REJECTED_AT', 'employee_ID', 'approver_ID'],
  [
    ['55555555-5555-5555-5555-555555555501', '2026-10-19', '2026-10-23T17:30:00Z', 'SUBMITTED', 40.00, null, null, null, '11111111-1111-1111-1111-111111111103', null],
    ['55555555-5555-5555-5555-555555555502', '2026-10-12', '2026-10-16T18:00:00Z', 'APPROVED', 38.00, null, '2026-10-17T09:15:00Z', null, '11111111-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111102'],
    ['55555555-5555-5555-5555-555555555503', '2026-10-19', null, 'DRAFT', 16.00, null, null, null, '11111111-1111-1111-1111-111111111104', null],
    ['55555555-5555-5555-5555-555555555504', '2026-10-12', '2026-10-16T17:45:00Z', 'REJECTED', 42.00, 'Hours for task BG-005 seem high without corresponding git commit logs. Please verify and revise.', null, '2026-10-17T11:00:00Z', '11111111-1111-1111-1111-111111111104', '11111111-1111-1111-1111-111111111102'],
    ['55555555-5555-5555-5555-555555555505', '2026-10-19', '2026-10-23T18:10:00Z', 'SUBMITTED', 35.00, null, null, null, '11111111-1111-1111-1111-111111111106', null]
  ]
);

// 9. TimesheetEntries
writeCsv('psasprint.db.transaction-TimesheetEntries.csv',
  ['ID', 'WORK_DATE', 'HOURS', 'DESCRIPTION', 'timesheet_ID', 'project_ID', 'task_ID'],
  [
    // Entries for TS001 (Amit, 40h)
    ['66666666-6666-6666-6666-666666666601', '2026-10-19', 8.00, 'ERP CDS view modeling and performance tuning', '55555555-5555-5555-5555-555555555501', '33333333-3333-3333-3333-333333333301', '55555555-0000-0000-0000-000000000001'],
    ['66666666-6666-6666-6666-666666666602', '2026-10-20', 8.00, 'Host-to-host bank API integration testing', '55555555-5555-5555-5555-555555555501', '33333333-3333-3333-3333-333333333301', '55555555-0000-0000-0000-000000000002'],
    ['66666666-6666-6666-6666-666666666603', '2026-10-21', 8.00, 'Bank payment batch testing with mock gateway', '55555555-5555-5555-5555-555555555501', '33333333-3333-3333-3333-333333333301', '55555555-0000-0000-0000-000000000002'],
    ['66666666-6666-6666-6666-666666666604', '2026-10-22', 8.00, 'Mobile app offline sync defect analysis', '55555555-5555-5555-5555-555555555501', '33333333-3333-3333-3333-333333333302', '55555555-0000-0000-0000-000000000005'],
    ['66666666-6666-6666-6666-666666666605', '2026-10-23', 8.00, 'Weekly client demonstration and sprint review', '55555555-5555-5555-5555-555555555501', '33333333-3333-3333-3333-333333333301', null],

    // Entries for TS002 (Amit, Approved 38h)
    ['66666666-6666-6666-6666-666666666606', '2026-10-12', 8.00, 'Requirements mapping for financial ledger', '55555555-5555-5555-5555-555555555502', '33333333-3333-3333-3333-333333333301', '55555555-0000-0000-0000-000000000001'],
    ['66666666-6666-6666-6666-666666666607', '2026-10-13', 8.00, 'Security role configuration in SAP BTP', '55555555-5555-5555-5555-555555555502', '33333333-3333-3333-3333-333333333301', null],
    ['66666666-6666-6666-6666-666666666608', '2026-10-14', 8.00, 'Mobile app push notification unit testing', '55555555-5555-5555-5555-555555555502', '33333333-3333-3333-3333-333333333302', '55555555-0000-0000-0000-000000000004'],
    ['66666666-6666-6666-6666-666666666609', '2026-10-15', 8.00, 'Fiori Elements List Report customization', '55555555-5555-5555-5555-555555555502', '33333333-3333-3333-3333-333333333302', null],
    ['66666666-6666-6666-6666-666666666610', '2026-10-16', 6.00, 'Sprint retrospective and documentation update', '55555555-5555-5555-5555-555555555502', '33333333-3333-3333-3333-333333333301', null],

    // Entries for TS003 (Sneha, Draft 16h)
    ['66666666-6666-6666-6666-666666666611', '2026-10-19', 8.00, 'Test script catalog creation for Finance users', '55555555-5555-5555-5555-555555555503', '33333333-3333-3333-3333-333333333301', '55555555-0000-0000-0000-000000000003'],
    ['66666666-6666-6666-6666-666666666612', '2026-10-20', 8.00, 'BTP Terraform script modularization and test', '55555555-5555-5555-5555-555555555503', '33333333-3333-3333-3333-333333333305', '55555555-0000-0000-0000-000000000006'],

    // Entries for TS004 (Sneha, Rejected 42h)
    ['66666666-6666-6666-6666-666666666613', '2026-10-12', 10.00, 'QA regression test suite run on mobile app', '55555555-5555-5555-5555-555555555504', '33333333-3333-3333-3333-333333333301', null],
    ['66666666-6666-6666-6666-666666666614', '2026-10-13', 10.00, 'Cloud infrastructure security vulnerability review', '55555555-5555-5555-5555-555555555504', '33333333-3333-3333-3333-333333333305', null],

    // Entries for TS005 (Meera, Submitted 35h)
    ['66666666-6666-6666-6666-666666666615', '2026-10-19', 7.00, 'Data lake schema mapping and star schema draft', '55555555-5555-5555-5555-555555555505', '33333333-3333-3333-3333-333333333303', '55555555-0000-0000-0000-000000000007']
  ]
);

// 10. Invoices (Demonstrating ISSUED, DRAFT, PAID, OVERDUE)
writeCsv('psasprint.db.transaction-Invoices.csv',
  ['ID', 'INVOICE_NUMBER', 'INVOICE_DATE', 'DUE_DATE', 'STATUS', 'BILLING_PERIOD_START', 'BILLING_PERIOD_END', 'PAID_AMOUNT', 'NET_AMOUNT', 'TAX_AMOUNT', 'GROSS_AMOUNT', 'CURRENCY', 'client_ID', 'project_ID'],
  [
    ['77777777-7777-7777-7777-777777777701', 'INV-2026-001', '2026-08-31', '2026-09-30', 'OVERDUE', '2026-08-01', '2026-08-31', 0.00, 800000.00, 144000.00, 944000.00, 'INR', '22222222-2222-2222-2222-222222222201', '33333333-3333-3333-3333-333333333301'],
    ['77777777-7777-7777-7777-777777777702', 'INV-2026-002', '2026-10-15', '2026-11-15', 'DRAFT', '2026-09-01', '2026-09-30', 0.00, 500000.00, 90000.00, 590000.00, 'INR', '22222222-2222-2222-2222-222222222202', '33333333-3333-3333-3333-333333333302'],
    ['77777777-7777-7777-7777-777777777703', 'INV-2026-003', '2026-07-31', '2026-08-31', 'PAID', '2026-07-01', '2026-07-31', 708000.00, 600000.00, 108000.00, 708000.00, 'INR', '22222222-2222-2222-2222-222222222201', '33333333-3333-3333-3333-333333333301'],
    ['77777777-7777-7777-7777-777777777704', 'INV-2026-004', '2026-10-20', '2026-11-30', 'ISSUED', '2026-09-01', '2026-09-30', 0.00, 200000.00, 36000.00, 236000.00, 'INR', '22222222-2222-2222-2222-222222222202', '33333333-3333-3333-3333-333333333305']
  ]
);

// 11. Alerts
writeCsv('psasprint.db.transaction-Alerts.csv',
  ['ID', 'ALERT_TYPE', 'TITLE', 'MESSAGE', 'SEVERITY', 'CREATED_ON', 'IS_READ', 'IS_RESOLVED', 'RESOLVED_AT', 'recipient_ID', 'project_ID', 'timesheet_ID', 'budget_ID', 'invoice_ID'],
  [
    ['88888888-8888-8888-8888-888888888801', 'BUDGET_RISK', 'Budget Burn Threshold Alert (87%)', 'Project P002 (Mobile App Dev) budget consumption has reached 86.6%, entering the Amber warning zone.', 'HIGH', '2026-10-20T08:00:00Z', false, false, null, '11111111-1111-1111-1111-111111111102', '33333333-3333-3333-3333-333333333302', null, '44444444-4444-4444-4444-444444444402', null],
    ['88888888-8888-8888-8888-888888888802', 'OVERDUE_INVOICE', 'Invoice Overdue Notice: INV-2026-001', 'Invoice INV-2026-001 for TechCorp India (₹944,000) was due on 2026-09-30 and remains unpaid.', 'CRITICAL', '2026-10-01T09:00:00Z', false, false, null, '11111111-1111-1111-1111-111111111102', '33333333-3333-3333-3333-333333333301', null, null, '77777777-7777-7777-7777-777777777701'],
    ['88888888-8888-8888-8888-888888888803', 'PENDING_APPROVAL', 'Timesheet Submitted: Amit Patel', 'Amit Patel has submitted a weekly timesheet for 40.0 hours for the week starting 2026-10-19.', 'MEDIUM', '2026-10-23T17:35:00Z', false, false, null, '11111111-1111-1111-1111-111111111102', null, '55555555-5555-5555-5555-555555555501', null, null],
    ['88888888-8888-8888-8888-888888888804', 'REJECTED_TIMESHEET', 'Timesheet Returned: Action Required', 'Your timesheet for week 2026-10-12 was rejected: "Hours for task BG-005 seem high without corresponding git commit logs. Please verify and revise."', 'HIGH', '2026-10-17T11:05:00Z', false, false, null, '11111111-1111-1111-1111-111111111104', null, '55555555-5555-5555-5555-555555555504', null, null],
    ['88888888-8888-8888-8888-888888888805', 'OVERDUE_TASK', 'Task Blocked: Offline Sync Bug Fixes', 'Task "Offline Sync Bug Fixes" on project Mobile App Dev is currently marked as BLOCKED.', 'HIGH', '2026-10-15T10:00:00Z', false, false, null, '11111111-1111-1111-1111-111111111103', '33333333-3333-3333-3333-333333333302', null, null, null],
    ['88888888-8888-8888-8888-888888888806', 'MILESTONE_DUE', 'Milestone Overdue: Store Submission', 'Milestone "Store Submission" for project Mobile App Dev was due on 2026-09-15 and is not completed.', 'CRITICAL', '2026-09-16T08:30:00Z', false, false, null, '11111111-1111-1111-1111-111111111105', '33333333-3333-3333-3333-333333333302', null, null, null]
  ]
);

console.log('Successfully created all 11 CSV seed files!');
