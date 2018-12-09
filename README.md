# Fastlane Plugin

<img src="https://cdn.jsdelivr.net/gh/clarive/cla-fastlane-plugin@master/public/icon/fastlane.svg?sanitize=true" alt="Fastlane Plugin" title="Fastlane Plugin" width="120" height="120">

The Fastlane plugin will allow you to deploy and release applications automatically to the Google Play Store and/or Apple store from Clarive.

## What is Fastlane

Fastlane is a platform tool to release applications to the Google Play Store or Apple Store.

## Requirements

To be able to use the plugin correctly, you must have [Fastlane](https://github.com/fastlane/fastlane) installed on the server where you wish to execute the commands.

To be able to publish in any of the application stores, you need to have your account ready to do so.

## Installing

To install the plugin, place the `cla-fastlane-plugin` folder inside `$CLARIVE_BASE/plugins` directory in the Clarive
instance.

## iOS Credential Resource

To configurate the iOS Credentials Resource open:

In **Clarive SE**: Resources -> ClariveSE.

In **Clarive EE**: Resources -> iOS.

You will be able to save your iOS credential. The main fields are:

- **Apple ID** - ID for your Apple account.
- **Password** - Password for the Apple ID.

### Fastlane task

The various parameters are:

- **Server (variable name: server)** - Choose the server where Fastlane is installed.
- **System (system)** - Choose the operating system where you are deploying your application.
    - **Android ("Android")** - Deploys to Google Play Store.
    - **iOS ("IOS")** - Deploys to Apple Store.
    - **Custom ("Custom")** - Writes custom Fastlane command.

Parameters for **Android** deployment: 

- **JSON path (json_path)** - Full path to JSON file for the Google Play Store authentification.
- **APK path (apk_path)** - Full path to the apk file which contains the application.
- **Package name (package_name)** - Package name of the application in the Google Play Store.
- **Track (track)** - Here you will have different commands to launch with the service or write a custom one.
    - **Alpha ("-a alpha")** - Deploy to Alpha.
    - **Beta ("-a beta")** - Deploy to Beta.
    - **Production ("-a production")** - Deploy to Production.
    - **Custom ("custom")** - Will get the commands written in the **Custom command or arguments** field and concatenate to the previous parameters.
- **Custom command or arguments (custom_params)** - Here you can write arguments for the selected command or write the commands you want to perform.

Parameters for **iOS** deployment:

- **iOS Resource (ios_resource)** - Resource where you have to configure your Apple Id and your Password for iTunesConnect.
- **Project path (project_path)** - Full path to the iOS project.
- **Keychain Password (keychain_password)** - Password to unlock the keychain that it used for the iOS project. 
- **Options (args)** - Here you will have different options to launch with the service or write a custom one.
    - **Build App ("build")** - Compile the app and it generate the .ipa file inside of the project folder.
    - **Generate Screenshots ("snapshot")** - Generate the screenshots that you selected in UITests folder.
    - **Upload to TestFlight ("pilot upload")** - Deploy to TestFlight.
        - **skip waiting for build processing (skip_waiting)** - Select it if you do not want to wait until build is finished. Boolean type.
    - **Upload app ("deliver")** - Deploy to App Store.
        - **Submit for review (submit_review)** - Select it if you want to submit the application for review. Boolean type.
    - **Custom Params ("custom")** - Will get the commands written in the **Custom command or arguments** field and concatenate to the previous parameters.
- **Custom command or arguments (custom_params)** - Here you can write arguments for the selected command or write the commands you want to perform.

Parameters for **Custom** deployment: 

- **Custom command or arguments (custom_params)** - Here you can write arguments for the Fastlane command.

**Only Clarive EE**

- **Errors and output** - These two fields concern to management of control errors. The options are:
   - **Fail and output error** - Search for configured error pattern in script output. If found, an error message is
     displayed in the monitor showing the match.
   - **Warn and output warn** - Search for configured warning pattern in script output. If found, an error message is
     displayed in the monitor showing the match.
   - **Custom** - If combo box errors is set to custom, a new form is displayed for defining the behavior with these
     fields:
      - **OK** - Range of return code values for the script to have succeeded. No message will be displayed in the
        monitor.
      - **Warn** - Range of return code values to warn the user. A warning message will be displayed in the monitor.
      - **Error** - Range of return code values for the script to have failed. An error message will be displayed in the
        monitor.
   - **Silent** - Silence all errors found.

## How to use

### In Clarive EE

Once the plugin is placed in its folder, you can find this service in the palette in the section of generic service and can be used like any other palette op.

Op Name: **Fastlane Task**

Configuration example for Android deploy:

```yaml
      Server: fastlane_server
      System: Android
      Json path: /sytem/files/jsonfile.json
      APK path: /app/release/app.apk
      Package name: ${package_name}
      Track: Alpha
``` 

Configuration example for iOS deploy:
```yaml
      Server: fastlane_server
      System: iOS
      iOS Resource: CredentialsForiOS
      Project path: ${project_path}
      Keychain Password: ******
      Options: Upload app
      Submit for review: true
      Custom command or arguments:
          --force
          --skip_binary_upload
``` 

Configuration example for Custom command:

```yaml
      Server: fastlane_server
      System: Custom
      Custom command or arguments: supply example
``` 

### In Clarive SE

#### Rulebook

If you want to use the plugin through the Rulebook, in any `do` block, use this ops as examples to configure the different parameters:

Example:

```yaml
rule: Deplot to Android demo
do:
   - fastlane_task:
        server: 'fastlane_server'     # Required. Use the mid set to the resource you created
        system: 'Android'             # Required.
        json_path: '/path/to/json.json'
        apk_path: '/path/to/app.apk'
        package_name: 'package.name'
        track: 'custom'
        custom_params: ['-a alpha']
``` 

```yaml
rule: Deploy to iOS demo
do:
   - fastlane_task:
        server: 'fastlane_server'     # Required. Use the mid set to the resource you created
        system: 'IOS'                 # Required.
        ios_resource: 'ios_resource'
        project_path: '/path/to/project/'
        keychain_password: '1232567'
        args: 'deliver'
        submit_review: '1'
        custom_params: ['--force', '--skip_binary_upload']
```

```yaml
rule: Custom Fastlane demo
do:
   - fastlane_task:
        server: 'fastlane_server'     # Required. Use the mid set to the resource you created
        system: 'Custom'              # Required.
        custom_params: ['supply example']
```

##### Outputs

###### Success

The service will return the console output for the command.

###### Possible configuration failures

**Task failed**

You will get the error from the console output.

**Variable required**

```yaml
Error in rulebook (compile): Required argument(s) missing for op "fastlane_task": "system"
```

Make sure you have all required variables defined.

**Not allowed variable**

```yaml
Error in rulebook (compile): Argument `Syst` not available for op "fastlane_task"
```

Make sure you are using the correct paramaters (make sure you are writing the variable names correctly).

## More questions?

Feel free to join **[Clarive Community](https://community.clarive.com/)** to resolve any of your doubts.
