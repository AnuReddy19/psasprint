const fs = require('fs');
const path = require('path');

const apps = [
  { folder: 'budgets', id: 'budgets', title: 'Budgets', entitySet: 'Budgets' },
  { folder: 'timesheets', id: 'timesheets', title: 'Timesheets', entitySet: 'Timesheets' },
  { folder: 'tasks', id: 'tasks', title: 'Tasks', entitySet: 'Tasks' },
  { folder: 'milestones', id: 'milestones', title: 'Milestones', entitySet: 'Milestones' },
  { folder: 'invoices', id: 'invoices', title: 'Invoices', entitySet: 'Invoices' },
  { folder: 'alerts', id: 'alerts', title: 'Alerts', entitySet: 'Alerts' }
];

for (const app of apps) {
  const dir = path.join(__dirname, 'app', app.folder, 'webapp');
  fs.mkdirSync(dir, { recursive: true });

  const manifest = {
    _version: '1.59.0',
    'sap.app': {
      id: 'psasprint.' + app.id,
      type: 'application',
      title: app.title,
      description: app.title + ' Management',
      dataSources: {
        mainService: {
          uri: '/psa/',
          type: 'OData',
          settings: {
            odataVersion: '4.0'
          }
        }
      }
    },
    'sap.ui5': {
      dependencies: {
        minUI5Version: '1.120.0',
        libs: {
          'sap.m': {},
          'sap.ui.core': {},
          'sap.ushell': {},
          'sap.fe.templates': {}
        }
      },
      models: {
        '': {
          dataSource: 'mainService',
          preload: true,
          settings: {
            synchronizationMode: 'None',
            operationMode: 'Server',
            autoExpandSelect: true,
            earlyRequests: true
          }
        }
      },
      routing: {
        routes: [
          {
            pattern: ':?query:',
            name: app.entitySet + 'List',
            target: app.entitySet + 'List'
          },
          {
            pattern: app.entitySet + '({key}):?query:',
            name: app.entitySet + 'Detail',
            target: app.entitySet + 'Detail'
          }
        ],
        targets: {
          [app.entitySet + 'List']: {
            type: 'Component',
            id: app.entitySet + 'List',
            name: 'sap.fe.templates.ListReport',
            options: {
              settings: {
                entitySet: app.entitySet,
                variantManagement: 'Page',
                navigation: {
                  [app.entitySet]: {
                    detail: {
                      route: app.entitySet + 'Detail'
                    }
                  }
                }
              }
            }
          },
          [app.entitySet + 'Detail']: {
            type: 'Component',
            id: app.entitySet + 'Detail',
            name: 'sap.fe.templates.ObjectPage',
            options: {
              settings: {
                entitySet: app.entitySet,
                editableHeaderContent: false
              }
            }
          }
        }
      }
    }
  };

  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

  const component = `sap.ui.define(["sap/fe/core/AppComponent"], function(AppComponent) {
    "use strict";
    return AppComponent.extend("psasprint.${app.id}.Component", {
        metadata: { manifest: "json" }
    });
});
`;
  fs.writeFileSync(path.join(dir, 'Component.js'), component, 'utf8');

  const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${app.title} - PSA Sprint</title>
    <script id="sap-ui-bootstrap"
        src="https://sapui5.hana.ondemand.com/1.120.0/resources/sap-ui-core.js"
        data-sap-ui-theme="sap_horizon"
        data-sap-ui-resourceroots='{"psasprint.${app.id}": "./"}'
        data-sap-ui-compatVersion="edge"
        data-sap-ui-oninit="module:sap/ui/core/ComponentSupport"
        data-sap-ui-async="true"
        data-sap-ui-frameOptions="allow">
    </script>
</head>
<body class="sapUiBody" id="content">
    <div data-sap-ui-component
        data-name="psasprint.${app.id}"
        data-id="container"
        data-settings='{"id": "psasprint.${app.id}"}'>
    </div>
</body>
</html>
`;
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
}
console.log('Successfully created all 6 Fiori Elements applications!');
