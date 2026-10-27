const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '..', 'app');

// 1. Manager Dashboard
fs.writeFileSync(path.join(appDir, 'manager', 'webapp', 'index.html'), `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PSA Sprint - Manager Dashboard</title>
    <link rel="stylesheet" href="/common/style.css">
    <style>
        html, body, #content, #container {
            height: 100%;
            margin: 0;
            padding: 0;
        }
    </style>
    <script id="sap-ui-bootstrap"
        src="https://ui5.sap.com/resources/sap-ui-core.js"
        data-sap-ui-theme="sap_horizon"
        data-sap-ui-resourceroots='{"psasprint.manager": "./"}'
        data-sap-ui-compatVersion="edge"
        data-sap-ui-oninit="module:sap/ui/core/ComponentSupport"
        data-sap-ui-async="true"
        data-sap-ui-frameOptions="allow">
    </script>
</head>
<body class="sapUiBody" id="content">
    <div data-sap-ui-component
        data-name="psasprint.manager"
        data-id="container"
        data-height="100%"
        data-settings='{"id": "psasprint.manager"}'>
    </div>
</body>
</html>
`, 'utf8');

// 2. Employee Dashboard
fs.writeFileSync(path.join(appDir, 'employee', 'webapp', 'index.html'), `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PSA Sprint - Employee Dashboard</title>
    <link rel="stylesheet" href="/common/style.css">
    <style>
        html, body, #content, #container {
            height: 100%;
            margin: 0;
            padding: 0;
        }
    </style>
    <script id="sap-ui-bootstrap"
        src="https://ui5.sap.com/resources/sap-ui-core.js"
        data-sap-ui-theme="sap_horizon"
        data-sap-ui-resourceroots='{"psasprint.employee": "./"}'
        data-sap-ui-compatVersion="edge"
        data-sap-ui-oninit="module:sap/ui/core/ComponentSupport"
        data-sap-ui-async="true"
        data-sap-ui-frameOptions="allow">
    </script>
</head>
<body class="sapUiBody" id="content">
    <div data-sap-ui-component
        data-name="psasprint.employee"
        data-id="container"
        data-height="100%"
        data-settings='{"id": "psasprint.employee"}'>
    </div>
</body>
</html>
`, 'utf8');

// 3. All 9 Fiori Elements Applications
const feApps = [
  { folder: 'clients', id: 'clients', title: 'Clients' },
  { folder: 'employees', id: 'employees', title: 'Employees' },
  { folder: 'projects', id: 'projects', title: 'Projects' },
  { folder: 'budgets', id: 'budgets', title: 'Budgets' },
  { folder: 'timesheets', id: 'timesheets', title: 'Timesheets' },
  { folder: 'tasks', id: 'tasks', title: 'Tasks' },
  { folder: 'milestones', id: 'milestones', title: 'Milestones' },
  { folder: 'invoices', id: 'invoices', title: 'Invoices' },
  { folder: 'alerts', id: 'alerts', title: 'Alerts' }
];

for (const app of feApps) {
  const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${app.title} - PSA Sprint</title>
    <style>
        html, body, #content {
            height: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
        }
        #container, .sapUiComponentContainer {
            height: 100% !important;
            width: 100% !important;
        }
        #sap-ui-static {
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
        }
    </style>
    <script id="sap-ui-bootstrap"
        src="https://ui5.sap.com/resources/sap-ui-core.js"
        data-sap-ui-theme="sap_horizon"
        data-sap-ui-resourceroots='{"psasprint.${app.id}": "./"}'
        data-sap-ui-compatVersion="edge"
        data-sap-ui-oninit="module:sap/ui/core/ComponentSupport"
        data-sap-ui-async="true"
        data-sap-ui-frameOptions="allow">
    </script>
</head>
<body class="sapUiBody sapUiSizeCompact" id="content">
    <div data-sap-ui-component
        data-name="psasprint.${app.id}"
        data-id="container"
        data-settings='{"id": "${app.id}"}'
        data-height="100%"
        style="height: 100%; width: 100%;">
    </div>
</body>
</html>
`;
  fs.writeFileSync(path.join(appDir, app.folder, 'webapp', 'index.html'), html, 'utf8');

  // Also ensure initialLoad: "Auto" in manifest.json
  const manifestPath = path.join(appDir, app.folder, 'webapp', 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const targets = manifest['sap.ui5']?.routing?.targets;
    if (targets) {
      for (const tKey of Object.keys(targets)) {
        if (targets[tKey].options?.settings && !targets[tKey].options.settings.initialLoad) {
          targets[tKey].options.settings.initialLoad = 'Auto';
        }
      }
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
    }
  }
}

console.log('All 11 application index.html files updated successfully with ui5.sap.com CDN and 100% height!');
