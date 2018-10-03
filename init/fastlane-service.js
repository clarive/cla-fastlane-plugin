var reg = require("cla/reg");

reg.register('service.fastlane.task', {
    name: _('Fastlane Task'),
    icon: '/plugin/cla-fastlane-plugin/icon/fastlane.svg',
    form: '/plugin/cla-fastlane-plugin/form/fastlane-form.js',
    rulebook: {
        moniker: 'fastlane_task',
        description: _('Launches Fastlane task'),
        required: [ 'system', 'server'],
        allow: ['system', 'server', 'ios_resource', 'project_path', 'keychain_password',
        'json_path', 'apk_path', 'package_name', 'track', 'args', 'skip_waiting', 'submit_review',
        'custom_params', 'errors'],
        mapper: {
            'ios_resource':'iOSCi',
            'project_path':'projectPath',
            'keychain_password':'keychainPassword',
            'json_path':'jsonPath',
            'apk_path':'apkPath',
            'package_name':'packageName',
            'skip_waiting':'skipWaiting',
            'custom_params':'customParams',
            'submit_review':'submitReview'
        },
        examples: [{
            fastlane_task: {
                server: 'fastlane_server',
                system: 'Android',
                json_path: '/path/to/json.json',
                apk_path: '/path/to/app.apk',
                package_name: 'package.name',
                track: 'custom',
                custom_params: ['-a alpha']
            }
        },{
            fastlane_task: {
                server: 'fastlane_server',
                system: 'IOS',
                ios_resource: 'ios_resource',
                project_path: '/path/to/project/',
                keychain_password: '******',
                args: 'deliver',
                submit_review: '1',
                custom_params: ['--force', '--skip_binary_upload']
            }
        }]
    },
    handler: function(ctx, params) {

        var ci = require("cla/ci");
        var log = require("cla/log");
        var reg = require('cla/reg');
        var server = params.server || '';
        var projectPath = params.projectPath || '';
        var args = params.args || '';
        var customParams = params.customParams || '';
        var jsonPath = params.jsonPath;
        var apkPath = params.apkPath;
        var packageName = params.packageName;
        var errors = params.errors || 'fail';
        var track = params.track;
        var system = params.system;
        var fullCommand = "";
        var skipWaiting = params.skipWaiting || false;
        var submitReview = params.submitReview || false;
        var keychainPassword = params.keychainPassword || '';
        var response;
        if (server == "") {
            log.fatal(_("No server selected"));
        }
        function remoteCommand(params, command, server, errors) {
            var output = reg.launch('service.scripting.remote', {
                name: _('Fastlane upload task'),
                config: {
                    errors: errors,
                    server: server,
                    path: fullCommand,
                    output_error: params.output_error,
                    output_warn: params.output_warn,
                    output_capture: params.output_capture,
                    output_ok: params.output_ok,
                    meta: params.meta,
                    rc_ok: params.rcOk,
                    rc_error: params.rcError,
                    rc_warn: params.rcWarn
                }
            });
            return output;
        }

        if (system == "IOS") {
            var iOSCi = ci.findOne({
                mid: params.iOSCi + ''
            });
            var appleId = iOSCi.appleId || '';
            var password = iOSCi.password || '';
            var command = 'export LANG=en_US.UTF-8 && export LC_ALL=en_US.UTF-8 && export LANGUAGE=en_US.UTF-8' +
                ' && export PATH="/usr/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:$PATH"' +
                '  && cd ' + projectPath;
            if (keychainPassword) {
                command = command + " && security unlock-keychain -p '" + keychainPassword + "' && ";
            }
            if (args != 'custom') {
                fullCommand = command + " fastlane " + args;
                if (args == 'pilot upload' && skipWaiting == true) {
                    fullCommand = fullCommand + " --skip_waiting_for_build_processing";
                } else if (args == 'deliver' && submitReview == true) {
                    fullCommand = fullCommand + " --submit_for_review";
                }
                if (customParams) {
                    fullCommand = fullCommand + ' ' + customParams.join(" ");
                }
            } else {
                fullCommand = command + " fastlane " + customParams.join(" ");
            }
            response = remoteCommand(params, fullCommand, server, errors);
            log.info(_("Fastlane task finished"));
            return response.output;

        } else if (system == "Android") {

            if (track == "custom") {
                fullCommand = "fastlane supply --apk " + apkPath + " -p " + packageName + ' --json_key "' + jsonPath + '" ' + customParams.join(" ");
            } else if (track == "") {
                log.fatal(_("No option selected"));
            } else {
                fullCommand = "fastlane supply --apk " + apkPath + " -p " + packageName + ' --json_key "' + jsonPath + '" ' + track + " " + customParams.join(" ");
            }
            log.info(_("Starting fastlane task"));
            var response = remoteCommand(params, fullCommand, server, errors);
            log.info(_("Fastlane task finished"));
            return response.output;

        } else if (system == "Custom") {

            fullCommand = "fastlane " + customParams.join(" ");
            log.info(_("Starting fastlane task"));
            response = remoteCommand(params, fullCommand, server, errors);
            log.info(_("Fastlane task finished"));
            return response.output;

        } else {
            log.fatal(_("No system selected"));
        }
    }
});
