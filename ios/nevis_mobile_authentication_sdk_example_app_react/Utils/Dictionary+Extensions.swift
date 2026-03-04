//
// Copyright © 2026 Nevis Security AG. All rights reserved.
//

import Foundation

/// Utility initializer for converting `UIScene.ConnectionOptions` into launch options.
///
/// This provides a small bridge between scene-based URL open events and the
/// traditional `UIApplication.LaunchOptionsKey` dictionary style.
///
/// - Important: Only the first URL context is used.
extension [UIApplication.LaunchOptionsKey: Any] {
	/// Creates a launch options dictionary from the given scene connection options.
	///
	/// If `connectionOptions.urlContexts` contains at least one entry, the resulting
	/// dictionary will include the `.url` launch option.
	///
	/// - Parameter connectionOptions: The scene connection options received via `UISceneDelegate`.
	/// - Returns: A dictionary suitable for passing to URL handling code that expects launch options.
	init(from connectionOptions: UIScene.ConnectionOptions) {
		self = [:]
		if let urlContext = connectionOptions.urlContexts.first {
			self[.url] = urlContext.url
		}
	}
}
