//
// Copyright © 2026 Nevis Security AG. All rights reserved.
//

import React
import React_RCTAppDelegate

class ReactNativeFactoryDelegateImpl: RCTDefaultReactNativeFactoryDelegate {
	override func sourceURL(for _: RCTBridge) -> URL? {
		bundleURL()
	}

	override func bundleURL() -> URL? {
		#if DEBUG
			RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
		#else
			Bundle.main.url(forResource: "main", withExtension: "jsbundle")
		#endif
	}
}
