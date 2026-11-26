# Nevis Mobile Authentication SDK React Native Example App

## Project Overview

A React Native (TypeScript) example app for Android and iOS. It shows how to integrate the Nevis Mobile Authentication SDK React Native plugin, a FIDO UAF 1.1 based SDK for passwordless authentication. It is meant as a learning resource and a source of integration code for customer apps. It is not a production-ready app.

Flows demonstrated:

- Client initialization (`MobileAuthenticationClientInitializer`)
- Registration
  - in-app with Authentication Cloud (`authCloudApiRegistration`, using an enrollment response or an `appLinkUri`)
  - in-app with an Identity Suite backend (`registration` with a `CookieAuthorizationProvider` after a username/password login)
  - out-of-band through a QR code, a deep link or pending operations
- Authentication: in-band, out-of-band (QR code / deep link), and transaction confirmation
- Deregistration of one account or all accounts, and deleting local authenticators
- Changing the PIN and the password
- Changing device information
- Fetching pending out-of-band operations
- Reading local data, `MetaData` (SDK version, facet ID, signing certificate) and device capabilities (FIDO UAF attestation support)

Paradigm: function components with **hook-based view models** (`useXxxViewModel()` in `src/screens/*ViewModel.ts`) and React Navigation (native stack). The SDK's builder API is promise-based: `execute()` returns a promise, and results arrive through `onSuccess` / `onError`. SDK interaction callbacks (`src/userInteraction/`) navigate to the screen that needs user input and **pass the SDK handler in the route params**. There is no DI framework; `ClientProvider` and `ConfigurationLoader` are simple singletons.

The example covers only part of the SDK. For features that are not shown here, use the documentation at https://docs.nevis.net/mobilesdk. Don't infer SDK behavior from memory.

## SDK & Related Resources

How the SDK is consumed:

- **React Native plugin** from npm: `@nevis-security/nevis-mobile-authentication-sdk-react`, constrained in `package.json`.
- The plugin wraps the native SDKs, and **the app has to add the native SDKs itself**:
  - **Android**: `ch.nevis:nevis-mobile-authentication-sdk-android-debug`, declared as `debugImplementation` in `android/app/build.gradle`. It comes from GitHub Packages at `https://maven.pkg.github.com/nevissecurity/nevis-mobile-authentication-sdk-android-package` (declared in `android/build.gradle`), which needs `GH_USERNAME` and `GH_PERSONAL_ACCESS_TOKEN` (a token with the `read:packages` scope), as environment variables or in `~/.gradle/gradle.properties`. That repository only hosts the **debug flavor**; see `README.md` for how to get the release flavor.
  - **iOS**: CocoaPods (`ios/Podfile`). `NevisMobileAuthentication-Debug` is linked for the `Debug` configuration and `NevisMobileAuthentication` (release flavor) for `Release`.
- The plugin and the native SDKs don't necessarily share the same version number. Look up which native SDK versions belong to a plugin version in the [support matrix](https://docs.nevis.net/configurationguide/nevis-lifecycle/Support-Policies-for-Third-Party-Software/access-app-and-mobile-sdk#react-native-plugin).
- See the [React Native installation guide](https://docs.nevis.net/mobilesdk/guide/installation/react-native-installation) and [SDK flavors](https://docs.nevis.net/mobilesdk/guide/introduction#sdk-flavors).

Documentation (https://docs.nevis.net):

- [Quickstart: build the example and use it](https://docs.nevis.net/mobilesdk/quickstart)
- [Requirements](https://docs.nevis.net/mobilesdk/guide/requirements) and [device support](https://docs.nevis.net/mobilesdk/guide/device-support)
- [Configuration](https://docs.nevis.net/mobilesdk/guide/configuration) (Authentication Cloud, Identity Suite, custom backend, facet ID)
- [Initialization](https://docs.nevis.net/mobilesdk/guide/initialization)
- Operations: [registration](https://docs.nevis.net/mobilesdk/guide/operation/registration), [authentication](https://docs.nevis.net/mobilesdk/guide/operation/authentication), [deregistration](https://docs.nevis.net/mobilesdk/guide/operation/deregistration), [other operations](https://docs.nevis.net/mobilesdk/guide/operation/other-operations)
- [Error handling](https://docs.nevis.net/mobilesdk/guide/error-handling), [best practices](https://docs.nevis.net/mobilesdk/guide/best-practices), [troubleshooting](https://docs.nevis.net/mobilesdk/appendixes/troubleshooting)
- Integration scenarios: [Authentication Cloud](https://docs.nevis.net/mobilesdk/integration-scenarios/authentication-cloud), [Identity Suite](https://docs.nevis.net/mobilesdk/integration-scenarios/identity-suite)
- [Push support](https://docs.nevis.net/mobilesdk/guide/push_support) (not implemented in this example)
- [React Native API reference](https://docs.nevis.net/mobilesdk/api-references/react_native/), [all API references](https://docs.nevis.net/mobilesdk/reference/api-references)
- [React Native release notes](https://docs.nevis.net/mobilesdk/release_notes/react-native-release-notes)
- [Authentication Cloud documentation](https://docs.nevis.net/authcloud/)

Example apps on other platforms (same feature set, useful for comparison):

- Android: https://github.com/nevissecurity/nevis-mobile-authentication-sdk-example-app-android
- Android, Kotlin Coroutines: https://github.com/nevissecurity/nevis-mobile-authentication-sdk-example-app-android-coroutines
- iOS: https://github.com/nevissecurity/nevis-mobile-authentication-sdk-example-app-ios
- iOS, RxSwift: https://github.com/nevissecurity/nevis-mobile-authentication-sdk-example-app-ios-rx
- Flutter: https://github.com/nevissecurity/nevis-mobile-authentication-sdk-example-app-flutter

## Prerequisites & Configuration

Backend: either a **Nevis Authentication Cloud** instance (with an access key to start enrollments), or an **Identity Suite** setup (nevisFIDO behind nevisProxy/nevisAuth). See `README.md` § "Getting Started".

To point the app at your own environment:

1. **Pick the environment.** In `src/configuration/ConfigurationLoader.ts`, the constructor sets `this._appEnvironment = AppEnvironment.AuthenticationCloud`. Change it to `AppEnvironment.IdentitySuite` if needed. Because this is TypeScript, Fast Refresh picks up the change without a native rebuild.
2. **Backend settings.** These live in `assets/`:
   - `config_authentication_cloud.json`: replace `myinstance.mauth.nevis.cloud` in `sdk.hostname`.
   - `config_identity_suite.json`: set `sdk.hostname` and `loginRequestURL` (a top-level key).
   - The SDK `Configuration` is built in `ConfigurationLoader.sdkConfiguration`: `Configuration.authCloudBuilder()` for Authentication Cloud, and `Configuration.admin4PatternBuilder()` (default Identity Suite paths) for Identity Suite. If your endpoints differ, change the builder there. See [Configuration](https://docs.nevis.net/mobilesdk/guide/configuration).
   - Both files contain `authenticatorAllowlist`, the AAIDs that may be offered:
     - Android: `F1D0#0001` PIN, `#0002` fingerprint, `#0003` biometric, `#0004` device passcode, `#0005` password.
     - iOS: `F1D0#1001` PIN, `#1002` Touch ID, `#1003` Face ID, `#1004` device passcode, `#1005` password.
3. **Identity Suite login (in-app registration only).** `src/screens/UsernamePasswordLoginViewModel.ts` posts the credentials to `loginRequestURL` with nevisAuth form fields (`isiwebuserid` / `isiwebpasswd`). The cookies it receives become a `CookieAuthorizationProvider`. Adapt this to your login flow.
4. **Deep links.** Change the `nevisaccess` custom scheme in two places:
   - **Android**: in `android/app/src/main/AndroidManifest.xml`, the `VIEW` intent filter.
   - **iOS**: in `ios/nevis_mobile_authentication_sdk_example_app_react/Info.plist`, under `CFBundleURLTypes` → `CFBundleURLSchemes`.

   `HomeScreen` listens through React Native `Linking` (`getInitialURL` plus the `url` event). `HomeViewModel.handleDeepLink` extracts the `dispatchTokenResponse` query parameter and hands it to `OutOfBandOperationHandler`. For verified App Links / Universal Links, add an https host with `assetlinks.json` (Android) or Associated Domains with `apple-app-site-association` (iOS).
5. **App identifiers and facet IDs.** The Android `applicationId` and the iOS bundle ID are both `ch.nevis.mobile.authentication.sdk.react.example`. The backend must know **both** facet IDs (`android:apk-key-hash:…` and `ios:bundle-id:…`), or operations fail with an untrusted facet ID error. The Home screen shows the facet ID of the running build (from `MetaData`). On Android the facet ID is derived from the signing certificate, so builds signed with different keys have different facet IDs; register the facet ID of every certificate you use. See [Facet ID](https://docs.nevis.net/mobilesdk/guide/configuration#facet-id).
6. **iOS signing.** Set your own development team in Xcode to run on a device.

## Build & Run Commands

`README.md` has the full setup (toolchain versions, GitHub token, CocoaPods, ccache). Quick reference (Yarn, see `package.json` scripts):

```bash
yarn                    # install JS dependencies
yarn android:run        # clean, build and run on an Android emulator / device
yarn ios:run            # clean, pod install (yarn pods) and run on an iOS simulator / device
yarn start              # Metro bundler only
yarn lint               # ESLint (eslint.config.mjs)
yarn formatcheck        # Prettier check (.prettierrc)
yarn check-dependencies # React Native dependency alignment (rnx-align-deps)
```

Requirements: the Node version in `.nvmrc` (see also `engines` in `package.json`), Yarn (`packageManager` in `package.json`), Java 17, Xcode and CocoaPods. iOS pods must be installed with `USE_FRAMEWORKS=static`; `yarn pods` does this for you. The app uses the React Native New Architecture. There are no automated tests; to verify changes, run the app against a backend.

## Architecture

### Source layout (`src/`)

```
App.tsx                    NavigationContainer (navigationRef) + native stack with all screens
configuration/             ConfigurationLoader (environment, SDK Configuration), AppConfiguration
screens/
  <Name>Screen.tsx         UI (function component)
  <Name>ViewModel.ts       useXxxViewModel() hook: SDK calls and handler completion for that screen
  RootStackParamList.ts    route params (they carry SDK handlers)
userInteraction/           SDK callback implementations: AccountSelectorImpl, AuthenticatorSelectorImpl,
                           Pin/Password Enroller, UserVerifier and Changer, Biometric/Fingerprint/DevicePasscode
                           user verifiers, PasswordPolicyImpl, OutOfBandOperationHandler (decode + run out-of-band ops)
utility/                   ClientProvider (singleton holding MobileAuthenticationClient), RootNavigation (navigate outside
                           components), AuthenticatorValidator, device information, error/HTTP helpers
error/                     ErrorHandler (shows technical errors on the Result screen; demo only), AppError
components/, model/, i18n/, Styles.tsx
android/, ios/             Native host projects (native SDK dependencies, URL scheme, permissions)
```

### How SDK callbacks reach the UI

1. A view model starts an operation, for example `HomeViewModel` or `SelectAccountViewModel` calling `client.operations.authentication`. It creates the interaction objects directly (`new AuthenticatorSelectorImpl(...)`, `new PinUserVerifierImpl()`, …) and calls `.execute()`.
2. When the SDK needs user input, the interaction implementation (for example `AuthenticatorSelectorImpl.selectAuthenticator`) prepares the data and calls `RootNavigation.navigate('SelectAuthenticator', { items, handler })`.
3. The target screen reads the **handler** from its route params, and its view model completes it (for example `useSelectAuthenticatorViewModel().select(aaid, handler)` → `handler.aaid(aaid)`) or cancels it.
4. `onSuccess` navigates to the `Result` screen. `onError` goes to `ErrorHandler.handle(operationType, error)`.

Other details:

- **Authenticator selectors**: `AuthenticatorSelectorImpl` is created with `AuthenticatorSelectorOperation.registration` or `.authentication`, and filters differently through `AuthenticatorValidator`.
- **Initialization**: `HomeScreen` calls `HomeViewModel.initClient()` on mount, which runs `MobileAuthenticationClientInitializer` and stores the client in `ClientProvider`. Deep link handling starts after initialization.
- **Out-of-band**: `OutOfBandOperationHandler` decodes payloads (QR code, deep link, pending operations) and runs `OutOfBandRegistration` / `OutOfBandAuthentication` with the appropriate interaction objects.

## Integration Guidance

When moving code into your own app:

| If you want to… | Look at | Notes |
|---|---|---|
| Add the SDK | `package.json`, `android/build.gradle`, `android/app/build.gradle`, `ios/Podfile` | Both the plugin **and** the native SDKs are needed. For release builds, add the release flavor on both platforms; see [React Native installation](https://docs.nevis.net/mobilesdk/guide/installation/react-native-installation). |
| Configure the backend | `assets/config_*.json`, `ConfigurationLoader` | [Configuration](https://docs.nevis.net/mobilesdk/guide/configuration) |
| Initialize the SDK once | `HomeViewModel.initClient`, `ClientProvider` | |
| Bridge SDK callbacks to UI | `src/userInteraction/`, `RootNavigation`, `RootStackParamList` | Reusable pattern; you can also keep handlers in your own state store instead of route params. |
| Register with Authentication Cloud | `AuthCloudApiRegistrationViewModel` | Your backend gets the enrollment response / `appLinkUri` from Authentication Cloud. |
| Register with Identity Suite | `UsernamePasswordLoginViewModel` | Replace the login call with your own; keep the `AuthorizationProvider` idea. |
| Handle QR codes / deep links | `OutOfBandOperationHandler`, `HomeScreen` / `HomeViewModel.handleDeepLink` | QR scanning (`ReadQrCodeScreen`, `react-native-camera-kit`) is demo scaffolding. |
| Authenticate in-band | `SelectAccountViewModel` | |
| Pick the authenticator | `AuthenticatorSelectorImpl`, `AuthenticatorValidator`, `SelectAuthenticatorViewModel` | Reusable filtering logic; replace the UI. |
| Enroll, verify or change a PIN/password | `Pin*Impl.ts`, `Password*Impl.ts`, `CredentialViewModel` | Recoverable errors and protection status (lockout/cool-down) are shown on the credential screen. |
| Biometric / fingerprint / device passcode | `*UserVerifierImpl.ts`, `ConfirmationViewModel` | Customize the prompt texts. |
| Transaction confirmation | `AccountSelectorImpl`, `TransactionConfirmationViewModel` | [Transaction confirmation](https://docs.nevis.net/mobilesdk/concept/operations/transaction-confirmation) |
| Deregister / change credentials / device info | `HomeViewModel`, `SelectAccountViewModel`, `DeviceInformationChangeViewModel` | |
| Pending out-of-band operations | `HomeViewModel` | |
| Push notifications | Not implemented | See [Push support](https://docs.nevis.net/mobilesdk/guide/push_support). |

Demo-only code that should not be copied as is:

- showing raw technical errors to users (`ErrorHandler`; see [Error handling](https://docs.nevis.net/mobilesdk/guide/error-handling))
- the hard-coded login request
- the UI components and styles
- the placeholder URL scheme and host names

If something isn't covered here, check https://docs.nevis.net (guide + React Native API reference) before you write code. Don't guess the API.

## Conventions & Gotchas

- **Native SDK versions**: the plugin version (`package.json`), the Android SDK version (`android/app/build.gradle`) and the iOS pod versions (`ios/Podfile`) are configured separately. They don't necessarily share the same version number, so use the [support matrix](https://docs.nevis.net/configurationguide/nevis-lifecycle/Support-Policies-for-Third-Party-Software/access-app-and-mobile-sdk#react-native-plugin) and the [React Native release notes](https://docs.nevis.net/mobilesdk/release_notes/react-native-release-notes) to select compatible native SDK versions for the plugin before upgrading.
- **Release flavor**: the Android release flavor is not in the public package repository, and on iOS it is only linked for the `Release` configuration. The release flavor detects emulators, simulators, debuggers and root/jailbreak, and refuses to run there. Debug builds use the debug flavor.
- **Handlers live in navigation params**: every SDK handler must be completed or cancelled exactly once. When a screen is left without input (back button, close), cancel the handler, as the existing screens do (for example `BackHandler` in `CredentialScreen`). Otherwise the operation hangs.
- **Minimum OS**: Android `minSdkVersion` 24 (Android 7) and iOS deployment target 15.1. The Android biometric authenticator needs API 29+, and the device passcode authenticator needs API 30+.
- **Device lock and enrollment**: biometric, fingerprint and device passcode authenticators need a secure lock screen / device passcode and enrolled biometrics. Simulate them in the Android emulator's extended controls or with the iOS simulator's *Features → Face ID / Touch ID*.
- **Permissions**: camera and Face ID permissions are set up through `react-native-permissions` (`setup_permissions` in `ios/Podfile`), and the iOS `Info.plist` must keep `NSCameraUsageDescription` and `NSFaceIDUsageDescription`. Without them, iOS terminates the app when Face ID or the QR scanner is used.
- **Code style**: TypeScript; `yarn lint` and `yarn formatcheck` must pass (tabs, Prettier config in `.prettierrc`). Keep React Native dependency versions aligned with `yarn check-dependencies`.
- **Never commit secrets**: `android/keystore.properties` and `android/local.properties` are git-ignored and must stay that way. Don't commit GitHub tokens or keystores that hold real signing keys either. Local plugin links (`.yalc/`, `yalc.lock`) are git-ignored as well.
