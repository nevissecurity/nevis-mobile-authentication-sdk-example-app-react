//
// Copyright © 2026 Nevis Security AG. All rights reserved.
//

import Foundation
import ReactAppDependencyProvider

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
	// MARK: Properties

	var window: UIWindow?
	var reactNativeFactory: RCTReactNativeFactory?
	var reactNativeFactoryDelegate: ReactNativeFactoryDelegateImpl?

	// MARK: UIWindowSceneDelegate

	// swiftformat:disable:next unusedArguments
	func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
		guard let windowScene = scene as? UIWindowScene else {
			return
		}

		let delegate = ReactNativeFactoryDelegateImpl()
		let factory = RCTReactNativeFactory(delegate: delegate)
		delegate.dependencyProvider = RCTAppDependencyProvider()

		reactNativeFactory = factory
		reactNativeFactoryDelegate = delegate

		window = UIWindow(windowScene: windowScene)

		// In scene-based lifecycle, a cold-start via custom URL scheme delivers the URL in `connectionOptions`.
		// Create the React root view here (instead of relying on the app delegate) and forward the derived
		// launch options so Linking/initial navigation can handle the URL on first render.
		factory.startReactNative(
			withModuleName: "nevis-mobile-authentication-sdk-example-app-react",
			in: window,
			launchOptions: .init(from: connectionOptions)
		)
	}

	// swiftformat:disable:next unusedArguments
	func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
		guard let urlContext = URLContexts.first else {
			return
		}

		RCTLinkingManager.application(UIApplication.shared, open: urlContext.url)
	}
}
