![Nevis Logo](https://www.nevis.net/hubfs/Nevis/images/logotype.svg)

# Nevis Mobile Authentication React Native Example Application

[![Main Branch Commit](https://github.com/nevissecurity/nevis-mobile-authentication-sdk-example-app-react/actions/workflows/main.yml/badge.svg)](https://github.com/nevissecurity/nevis-mobile-authentication-sdk-example-app-react/actions/workflows/main.yml)
[![Pull Request](https://github.com/nevissecurity/nevis-mobile-authentication-sdk-example-app-react/actions/workflows/pr.yml/badge.svg)](https://github.com/nevissecurity/nevis-mobile-authentication-sdk-example-app-react/actions/workflows/pr.yml)

This repository contains the example app demonstrating how to use the _Nevis Mobile Authentication Client SDK for React Native_ in a React Native app.
The Nevis Mobile Authentication SDK allows you to integrate passwordless authentication to your existing mobile app, backed by [FIDO UAF 1.1](https://fidoalliance.org/specs/fido-uaf-complete-specifications.zip).

Some features demonstrated in this example app are:

* Registering with ~~QR code &~~ app link URIs
* Simulating in-band authentication after registration
* Deregistering a registered account
* Changing the PIN of the PIN authenticator
* Changing the device information
* Using the SDK with the Authentication Cloud

Please note that the example app only demonstrates a subset of the SDK features. The main purpose is to demonstrate how the SDK can be used and not to cover all supported scenarios and use cases.

---
**NOTE**

QR code reading is not available at the moment.

---


## Getting Started

Before you can actually start compiling and using the example applications please ensure you have the following ready:

* An [Authentication Cloud](https://docs.nevis.net/authcloud/) instance provided by Nevis.
* An [access key](https://docs.nevis.net/authcloud/access-app/access-key) to use with the Authentication Cloud.

Your development setup has to meet the following prerequisites:

* iOS 12.4 or later
* Xcode 14.x, including Swift 5.7
* Android 6 or later, with API level 23
* Android 10 or later, with API level 29, for the biometric authenticator to work
* Android 11 or later, with API level 30, for the device passcode authenticator to work
* Gradle 7.4 or later
* Android Gradle Plugin `com.android.tools.build:gradle` 7.4.2 or later
* Kotlin Gradle Plugin `org.jetbrains.kotlin:kotlin-gradle-plugin` 1.8.21 or later
* React Native 0.72.x

### Initialization

First open a terminal and run the `yarn` command in the root directory to get the React Native dependencies.

<details>
<summary>Android</summary>

1. The Nevis Mobile Authentication Client SDK for Android is published as a GitHub package. In order to be able to download it a valid GitHub account and a Personal Access Token is needed. Please define these in one of the following ways:
    * as environment variables.
    * in `gradle.properties` in `GRADLE_USER_HOME` directory or in Gradle installation directory.
    ```properties
    GITHUB_USERNAME=<YOUR USERNAME>
    GITHUB_PERSONAL_ACCESS_TOKEN=<YOUR PERSONAL ACCESS TOKEN>
    ```

2. To choose between the Old and the [New Architecture](https://reactnative.dev/docs/the-new-architecture/landing-page), you have to set the `newArchEnabled` property to `false` or `true` respectively by either (Note that if you use the yarn scripts described in the Build & run section, this will be done automatically for the selected architecture via setting the environment variable):
    * Changing the corresponding line in `android/gradle.properties`
    * Setting the environment variable `ORG_GRADLE_PROJECT_newArchEnabled=true`

3. To set whether the [Hermes](https://reactnative.dev/docs/hermes) JavaScript engine should be used or [JavaScript Core](https://trac.webkit.org/wiki/JavaScriptCore), you have to set the `hermesEnabled` property to `true` or `false` respectively in `android/gradle.properties`.

4. Synchronize your [android](/android) project with Gradle if opened in Android Studio.

> **Warning**
> The package repository only exposes the `debug` flavor. To use the `release` flavor contact us on [sales@nevis.net](mailto:sales@nevis.net).

</details>

<details>
<summary>iOS</summary>

Native iOS dependencies of this project (including the Nevis Mobile Authentication Client SDK for iOS) are provided via [Cocoapods](https://cocoapods.org/). Please install all dependencies by running

* When using the [New Architecture](https://reactnative.dev/docs/the-new-architecture/landing-page):

```
RCT_NEW_ARCH_ENABLED=1 USE_FRAMEWORKS=static NO_FLIPPER=1 pod install
```

* When using the Old Architecture:

```
RCT_NEW_ARCH_ENABLED=0 pod install
```

Note that if you use the yarn scripts described in the Build & run section, this will be done automatically for the selected architecture.

**Bitcode Support**

As the native iOS SDK does not provide Bitcode support, the following post install step needs to be
added to the Podfile:

```ruby
post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['ENABLE_BITCODE'] = 'NO' # NMA SDK does not support Bitcode
    end
  end
end
```

</details>

### Configuration

Before being able to use the example app with your Authentication Cloud instance, you'll need to update the configuration file with the right host information.

Edit the `assets/config_authentication_cloud.json` file and replace

* the host name information with your Authentication Cloud instance

```json
{
  "login": {
    "loginRequestURL": "https://<YOUR INSTANCE>.mauth.nevis.cloud/_app/auth/pwd"
  },
  "sdk": {
    "hostname": "<YOUR INSTANCE>.mauth.nevis.cloud",
     ...
  }
}
```

#### Configuration Change

The example apps are supporting two kinds of configuration: `authenticationCloud` and `identitySuite`.

To change the configuration open the [ConfigurationLoader.ts](src/configuration/ConfigurationLoader.ts) file which describes the App Environment that should be used.
The `_appEnvironment` assignment should be changed in the constructor to one of the values already mentioned.

Due to the [Fast Refresh](https://reactnative.dev/docs/fast-refresh) feature of React Native, you can even change this while running the app, and after it is reloaded, you can start using the different environment without rebuilding the app (Note: this is only true when changing the TypeScript files and not native ones).

### Build & run

<details>
<summary>Android</summary>

If you configured everything properly, you can run the app on an Android device or Emulator with the following yarn commands:

* Using the New Architecture
```
yarn android:new
```

* Using the Old Architecture
```
yarn android:old
```

</details>

<details>
<summary>iOS</summary>

If you configured everything properly, you're ready to build and run the example app on an iOS device or Simulator with the following yarn commands:

* Using the New Architecture

```
yarn ios:new
```

* Using the Old Architecture

```
yarn ios:old
```

Or by choosing Product > Run from Xcode, or by clicking the Run button in your project’s toolbar, similarly how you would run a native iOS application.

> **_NOTE_**
> Running the app on an iOS device requires codesign setup.

</details>

### Try it out

Now that the Flutter example app is up and running, it's time to try it out!

Check out our [Quickstart Guide](https://docs.nevis.net/mobilesdk/quickstart).

#### Troubleshooting

##### Not enough space on Android emulator

When the Android emulator has insufficient internal memory the installation may fail with the error:

```bash
android.os.ParcelableException: java.io.IOException: Requested internal only, but not enough space
```

The solution is to increase the internal memory. In Android Studio

* Open the Virtual Device Manager.
* Select the emulator which you want to make changes then click on the edit button associated to it.
* Click on _Show Advanced Settings_ button to expose hidden things.
* Scroll down to the _Memory and Storage_ section and increase the amount of _Internal Storage_.
* Finally, hit the _Finish_ button to apply the changes. Reboot the Android emulator to ensure everything will work as expected.

## Integration Notes

In this section you can find hints about how the Nevis Mobile Authentication SDK is integrated into the example app.

* All SDK invocation is implemented in the corresponding view model class.
* All SDK specific user interaction related protocol implementation can be found in the [userInteraction](src/userInteraction) folder.

### Initialization

The [HomeViewModel](src/screens/HomeViewModel.ts) class is responsible for creating and initializing a `MobileAuthenticationClient` instance which is the entry point to the SDK. Later this instance can be used to start the different operations.

### Registration

Before being able to authenticate using the Nevis Mobile Authentication SDK, go through the registration process. Depending on the use case, there are two types of registration: [in-app registration](#in-app-registration) and [out-of-band registration](#out-of-band-registration).

#### In-app registration

If the application is using a backend using the Nevis Authentication Cloud, the [AuthCloudApiRegistrationViewModel](src/screens/AuthCloudApiRegistrationViewModel.ts) class will be used by passing the `enrollment` response or an `appLinkUri`.

When the backend used by the application does not use the Nevis Authentication Cloud the name of the user to be registered is passed to the [UsernamePasswordLoginViewModel](src/screens/UsernamePasswordLoginViewModel.ts) class.
If authorization is required by the backend to register, provide an `AuthorizationProvider`. In the example app a `CookieAuthorizationProvider` is created from the cookies obtained by the `login()` function (see [UsernamePasswordLoginViewModel](src/screens/UsernamePasswordLoginViewModel.ts)).

#### Out-of-band registration

When the registration is initiated in another device or application, the information required to process the operation is transmitted through a QR code or a link. After the payload obtained from the QR code or the link is decoded the [OutOfBandOperationHandler](src/userInteraction/OutOfBandOperationHandler.ts) class starts the out-of-band operation.

### Authentication

Using the authentication operation, you can verify the identity of the user using an already registered authenticator. Depending on the use case, there are two types of authentication: [in-app authentication](#in-app-authentication) and [out-of-band authentication](#out-of-band-authentication).

#### In-app authentication

For the application to trigger the authentication, the name of the user is provided to the [SelectAccountViewModel](src/screens/SelectAccountViewModel.ts) class.

#### Out-of-band authentication

When the authentication is initiated in another device or application, the information required to process the operation is transmitted through a QR code or a link. After the payload obtained from the QR code or the link is decoded the  [OutOfBandOperationHandler](src/userInteraction/OutOfBandOperationHandler.ts) class starts the out-of-band operation.

#### Transaction confirmation

There are cases when specific information is to be presented to the user during the user verification process, known as transaction confirmation. The `AuthenticatorSelectionContext` and the `AccountSelectionContext` contain string with the information. In the example app it is handled in the [AccountSelectorImpl](src/userInteraction/AccountSelectorImpl.ts) class.

### Deregistration

The [HomeViewModel](src/screens/HomeViewModel.ts) class is responsible for deregistering either a user or all of the registered users from the device.

### Other operations

#### Change PIN

With the change PIN operation you can modify the PIN of a registered PIN authenticator for a given user. It is implemented in:
* in case of a single registered user see the [HomeViewModel](src/screens/HomeViewModel.ts) class.
* in case of multiple registered users see the [SelectAccountViewModel](src/screens/SelectAccountViewModel.ts) class.

#### Decode out-of-band payload

Out-of-band operations occur when a message is delivered to the application through an alternate channel like a push notification, a QR code, or a deep link. With the help of the [OutOfBandOperationHandler](src/userInteraction/OutOfBandOperationHandler.ts) class the application can create an `OutOfBandPayload` either from a JSON or a Base64 URL encoded String. The `OutOfBandPayload` is then used to start an `OutOfBandOperation`, see chapters [Out-of-Band Registration](#out-of-band-registration) and [Out-of-Band Authentication](#out-of-band-authentication).

#### Change device information

During registration, the device information can be provided that contains the name identifying your device, and also the Firebase Cloud Messaging registration token. Updating both the name is implemented in the [DeviceInformationChangeViewModel](src/screens/DeviceInformationChangeViewModel.ts) class.

Firebase Cloud Messaging is not supported in the example app.

## License

Nevis Mobile Authentication Client SDK for React Native is released under a commercial license. See [LICENSE](LICENSE) for details.

© 2023 made with ❤ by Nevis
