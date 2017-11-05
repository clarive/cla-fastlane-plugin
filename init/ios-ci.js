var ci = require("cla/ci");

ci.createRole("iOS");

ci.createClass("iOSCredentials", {
    form: '/plugin/cla-fastlane-plugin/form/ios-ci-form.js',
    icon: '/plugin/cla-fastlane-plugin/icon/ios.svg',
    roles: ["iOS", "ClariveSE"],
    has: {
        appleId: {
            is: "rw",
            isa: "Str",
            required: true
        },
        password: {
            is: "rw",
            isa: "Str",
            required: true
        }
    }
});
