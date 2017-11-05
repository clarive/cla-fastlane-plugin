# Fastlane Plugin

The Fastlane plugin will allow you to deploy and release applications automatically to the Google Play Store and/or Apple store from Clarive.

## What is Fastlane

Fastlane is a platform tool to release applications to the Play Store or Apple Store.

## Requirements

To be able to use the plugin correctly, you must have [Fastlane](https://github.com/fastlane/fastlane) installed on the server where you wish to execute the commands.

## Installing

To install the plugin, place the `cla-fastlane-plugin` folder inside `CLARIVE_BASE/plugins` directory in the Clarive
instance.

## How to Use

Once the plugin is placed in its folder, you can start using it by going to your Clarive instance.

After restarting your Clarive instance, you will have a new palette service called 'Fastlane task'.

### Fastlane task

The service will execute the Fastlane task specified.

The parameters available for this service are:

- **Server** - Choose the server where you wish to execute the command.
- **System** - Choose the system where you are deploying application.
    - **Android** - Deploy to Google Play.
    - **IOS** - Deploy to Apple Store.
    - **Custom** - Write custom Fastlane command.
- **Errors and output** - These two fields are related to manage control errors. Options are:
   - **Fail and output error** - Search for configurated error pattern in script output. If found, an error message is displayed in monitor showing the match.
   - **Warn and output warn** - Search for configurated warning pattern in script output. If found, an error message is displayed in monitor showing the match.,
   - **Custom** - In case combo box errors is set to custom a new form is showed to define the behavior with these fields:
   - **OK** - Range of return code values for the script to have succeeded. No message will be displayed in monitor.
   - **Warn** - Range of return code values to warn the user. A warn message will be displayed in monitor.
   - **Error** - Range of return code values for the script to have failed. An error message will be displayed in monitor.

Android parameters: 

- **JSON path** - Full path to JSON file for the Google authentification.
- **APK path** - Full path to the apk file which contains the application.
- **Package name** - Package name of the application in the Play Store.
- **Track** - Here you will have different commands to launch with the service or write a custom one.
    - **Alpha** - Deploy to Alpha.
    - **Beta** - Deploy to Beta.
    - **Production** - Deploy to Production.
    - **Custom** - Will get the commands written in the **Custom command or arguments** box and concatenate to the previous parameters.
- **Custom command or arguments** - Here you can write arguments for the selected command or write the commands you want to perform.

iOS parameters:

- **iOS Resource** - Resource where you have to configure your Apple Id and your Password for iTunesConnect.
- **Project path** - Full path to the iOS project.
- **Keychain Password** - Password to unlock the keychain that it used for the iOS project. 
- **Options** - Here you will have different options to launch with the service or write a custom one.
    - **Build App** - Compile the app and it generate the .ipa file inside of the project folder.
    - **Generate Screenshots** - Generate the screenshots that you selected in UITests folder.
    - **Upload to TestFlight** - Deploy to TestFlight.
        - **skip waiting for build processing** - Select it if you do not want to wait until build is finished.
    - **Upload app** - Deploy to App Store.
        - **Submit for review** - Select it if you want to submit the application for review.

Custom parameters: 

- **Custom command or arguments** - Here you can write arguments for the Fastlane command.

The plugin will return all the console output.

Configuration example for Android deploy:

      Server: fastlane_server
      System: Android
      Json path: /sytem/files/jsonfile.json
      APK path: /app/release/app.apk
      Package name: ${package_name}
      Track: Alpha
      Custom command or arguments:
      Errors: fail

Configuration example for iOS deploy:

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
      Errors: fail

