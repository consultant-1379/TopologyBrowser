define({
    defaultApp: 'topologybrowser',
    name: 'Ericsson Network Manager',
    webpush: {
        urls: {
            'id': '/rest/sse/id',
            'stream': '/rest/sse/stream',
            'subscriptions': '/rest/sse/subscriptions',
        },
        heartbeat: {
            enable: true,
            url: '/rest/sse/heartbeatInterval'
        }
    },
    components: [
        {
            path: 'logoutbutton'
        },
        {
            path: 'flyout'
        },
        {
            path: 'helpbutton'
        },
        {
            path: 'navigation'
        },
        {
            path: 'contextmenu'
        }
    ],
    properties: {
        logoutbutton: {
            url: '/logout',
            i18n: {
                locales: ['en-us']
            }
        },
        help: {
            helpCenter: true,
            i18n: {
                locales: ['en-us']
            }
        },
        helpbutton: {
            helpCenter: true,
            i18n: {
                locales: ['en-us']
            }
        }
    }
});
