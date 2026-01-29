//
// Copyright © 2026 Nevis Security AG. All rights reserved.
//

import Foundation

@main
class AppDelegate: RCTAppDelegate {

	// MARK: RCTAppDelegate Overrides

	// swiftformat:disable:next unusedArguments
	override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
		moduleName = "nevis-mobile-authentication-sdk-example-app-react"
		// Prevent RCTAppDelegate from creating the window, will be created in SceneDelegate.
		automaticallyLoadReactNativeWindow = false
		return super.application(application, didFinishLaunchingWithOptions: launchOptions)
	}

	override func bundleURL() -> URL? {
		#if DEBUG
			return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
		#else
			return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
		#endif
	}

	// MARK: RCTBridgeDelegate Overrides

	override func sourceURL(for bridge: RCTBridge) -> URL? {
		bridge.bundleURL ?? bundleURL()
	}
}
