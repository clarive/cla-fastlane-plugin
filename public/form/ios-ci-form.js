(function(params) {

    var data = params.data || {};

    var appleId = Cla.ui.textField({
        name: 'appleId',
        fieldLabel: _('Apple ID'),
        value: data.appleId || '',
        allowBlank: false
    });

    var password = Cla.ui.textField({
        name: 'password',
        fieldLabel: _('Password'),
        inputType: 'password',
        value: data.password || '',
        allowBlank: false
    });

    return [
        appleId,
        password,
    ]
})