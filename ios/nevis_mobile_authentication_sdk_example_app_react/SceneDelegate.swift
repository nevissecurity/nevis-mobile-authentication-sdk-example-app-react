//
// Copyright © 2026 Nevis Security AG. All rights reserved.
//

import Foundation
import React_RCTAppDelegate

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
	// MARK: UIWindowSceneDelegate

	// swiftformat:disable:next unusedArguments
	func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
		guard let windowScene = scene as? UIWindowScene else {
			return
		}

		guard let appDelegate = UIApplication.shared.delegate as? RCTAppDelegate else {
			return
		}

		let window = UIWindow(windowScene: windowScene)

		// In scene-based lifecycle, a cold-start via custom URL scheme delivers the URL in `connectionOptions`.
		// Create the React root view here (instead of relying on the app delegate) and forward the derived
		// launch options so Linking/initial navigation can handle the URL on first render.
		let rootView = appDelegate.rootViewFactory.view(withModuleName: appDelegate.moduleName ?? "",
		                                                initialProperties: appDelegate.initialProps,
		                                                launchOptions: .init(from: connectionOptions))
		let rootViewController = UIViewController()
		rootViewController.view = rootView
		window.rootViewController = rootViewController
		appDelegate.window = window

		window.makeKeyAndVisible()
	}

	// swiftformat:disable:next unusedArguments
	func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
		guard let urlContext = URLContexts.first else {
			return
		}

		RCTLinkingManager.application(UIApplication.shared, open: urlContext.url)
	}
}
