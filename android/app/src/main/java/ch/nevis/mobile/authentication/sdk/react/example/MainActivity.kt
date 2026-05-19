package ch.nevis.mobile.authentication.sdk.react.example

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

	/**
	 * Returns the name of the main component registered from JavaScript. This is used to schedule
	 * rendering of the component.
	 */
	override fun getMainComponentName(): String = "nevis-mobile-authentication-sdk-example-app-react"

	/**
	 * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate].
	 */
	override fun createReactActivityDelegate(): ReactActivityDelegate =
		DefaultReactActivityDelegate(this, mainComponentName)
}
