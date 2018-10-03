(function(params) {
    var data = params.data;

    var serverComboBox = Cla.ui.ciCombo({
        name: 'server',
        role: 'Server',
        fieldLabel: _('Server'),
        value: data.server || '',
        allowBlank: false,
        width: 400,
        with_vars: 1
    });

    var systemPillBox = Cla.ui.pill({
        name: 'system',
        fieldLabel: 'System',
        value: data.system || 'Android',
        anchor: '100%',
        readOnly: false,
        options: ['Android', 'IOS', 'Custom']
    })

    var iOSCi = Cla.ui.ciCombo({
        name: 'iOSCi',
        value: data.iOSCi || '',
        class: 'iOSCredentials',
        fieldLabel: _('iOS Resource'),
        allowBlank: false,
        with_vars: 1,
        width: 400
    });

    var environmentFile = Cla.ui.textField({
        name: 'environmentFile',
        fieldLabel: _('Environment File'),
        value: data.environmentFile || '',
        allowBlank: true
    });

    var projectPathTextField = Cla.ui.textField({
        name: 'projectPath',
        fieldLabel: _('Project path'),
        value: data.projectPath || '',
        allowBlank: false
    });

    var keychainPassword = Cla.ui.textField({
        name: 'keychainPassword',
        fieldLabel: _('Keychain Password'),
        inputType: 'password',
        value: data.keychainPassword || ''
    });

    var jsonPathTextField = Cla.ui.textField({
        name: 'jsonPath',
        fieldLabel: _('Json path'),
        value: data.jsonPath || '',
    });

    var apkPathTextField = Cla.ui.textField({
        name: 'apkPath',
        fieldLabel: _('ApK path'),
        value: data.apkPath || ''
    });

    var packageNameTextField = Cla.ui.textField({
        name: 'packageName',
        fieldLabel: _('Package name'),
        value: data.packageName || ''
    });


    var commandComboBox = Cla.ui.comboBox({
        name: 'track',
        fieldLabel: _('Track'),
        data: [
            [' -a alpha ', _('Alpha')],
            [' -a beta ', _('Beta')],
            [' -a production ', _('Production')],
            ['custom', _('Custom command')]
        ],
        value: data.track || 'alpha',
        allowBlank: false,
        singleMode: true,
        width: 400
    });

    var args = Cla.ui.comboBox({
        name: 'args',
        fieldLabel: _('Options'),
        value: data.args || [],
        data: [
            ['build', 'Build App'],
            ['deliver', 'Upload App'],
            ['pilot upload', 'Upload to TestFlight'],
            ['snapshot', 'Generate Screenshots'],
            ['custom', 'Custom Params']
        ],
        singleMode: true,
        allowBlank: false,
        width: 400
    });
    args.on('addItem', function() {
        var v = args.getValue();
        if (v == 'pilot upload') {
            skipWaiting.show();
            submitReview.hide();
        } else if (v == 'deliver') {
            submitReview.show();
            skipWaiting.hide();
        } else {
            skipWaiting.hide();
            submitReview.hide();
        }
    });

    var skipWaiting = Cla.ui.checkBox({
        fieldLabel: _('Skip waiting for build processing'),
        name: 'skipWaiting',
        checked: data.skipWaiting == 1 ? true : false
    });

    var submitReview = Cla.ui.checkBox({
        fieldLabel: _('Submit for review'),
        name: 'submitReview',
        checked: data.submitReview == 1 ? true : false
    });

    var customTextField = Cla.ui.arrayGrid({
        name: 'customParams',
        fieldLabel: _('Custom command or arguments'),
        value: data.customParams,
        description: _('Custom command or arguments'),
        default_value: '.'
    });

    var errorBox = Cla.ui.errorManagementBox({
        errorTypeName: 'errors',
        errorTypeValue: params.data.errors || 'fail',
        rcOkName: 'rcOk',
        rcOkValue: params.data.rcOk,
        rcWarnName: 'rcWarn',
        rcWarnValue: params.data.rcWarn,
        rcErrorName: 'rcError',
        rcErrorValue: params.data.rcError,
        errorTabsValue: params.data
    });

    systemPillBox.on('change', function() {
        var v = systemPillBox.getValue();
        var commandValue = args.getValue();
        if (v == 'Android') {
            args.hide();
            args.allowBlank = true;
            commandComboBox.show();
            commandComboBox.allowBlank = false;
            projectPathTextField.hide();
            projectPathTextField.allowBlank = true;
            iOSCi.hide();
            iOSCi.allowBlank = true;
            jsonPathTextField.show();
            jsonPathTextField.allowBlank = false;
            apkPathTextField.show();
            apkPathTextField.allowBlank = false;
            packageNameTextField.show();
            packageNameTextField.allowBlank = false;
            keychainPassword.hide();
            submitReview.hide();
            skipWaiting.hide();
        } else if (v == 'IOS') {
            args.show();
            args.allowBlank = false;
            commandComboBox.hide();
            commandComboBox.allowBlank = true;
            projectPathTextField.show();
            projectPathTextField.allowBlank = false;
            iOSCi.show();
            iOSCi.allowBlank = false;
            jsonPathTextField.hide();
            jsonPathTextField.allowBlank = true;
            apkPathTextField.hide();
            apkPathTextField.allowBlank = true;
            packageNameTextField.hide();
            packageNameTextField.allowBlank = true;
            keychainPassword.show();
            if (commandValue == 'deliver') {
                submitReview.show();
            } else if (commandValue == 'pilot upload') {
                skipWaiting.show();
            } else {
                submitReview.hide();
                skipWaiting.hide();
            }
        } else if (v == 'Custom') {
            args.hide();
            args.allowBlank = true;
            commandComboBox.hide();
            commandComboBox.allowBlank = true;
            projectPathTextField.hide();
            projectPathTextField.allowBlank = true;
            iOSCi.hide();
            iOSCi.allowBlank = true;
            jsonPathTextField.hide();
            jsonPathTextField.allowBlank = true;
            apkPathTextField.hide();
            apkPathTextField.allowBlank = true;
            packageNameTextField.hide();
            packageNameTextField.allowBlank = true;
            keychainPassword.hide();
            skipWaiting.hide();
            submitReview.hide();
        }
    });

    var panel = Cla.ui.panel({
        layout: 'form',
        items: [
            systemPillBox,
            serverComboBox,
            iOSCi,
            projectPathTextField,
            environmentFile,
            keychainPassword,
            args,
            submitReview,
            skipWaiting,
            jsonPathTextField,
            apkPathTextField,
            packageNameTextField,
            commandComboBox,
            customTextField,
            errorBox
        ]
    });

    return panel;
})
