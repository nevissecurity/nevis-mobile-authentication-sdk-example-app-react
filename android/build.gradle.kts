buildscript {
    extra.apply {
        set("buildToolsVersion", "36.0.0")
        set("minSdkVersion", 24)
        set("compileSdkVersion", 36)
        set("targetSdkVersion", 36)
        set("ndkVersion", "27.1.12297006")
        set("kotlinVersion", "2.1.20")
    }

    repositories {
        google()
        mavenCentral()
    }

    dependencies {
        classpath("com.android.tools.build:gradle")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin")
    }
}

plugins {
    id("com.facebook.react.rootproject")
}

fun getConfig(name: String): String {
    val localPropertiesFile = project.rootProject.file("local.properties")
    if (localPropertiesFile.exists()) {
        val localProperties = java.util.Properties()
        localProperties.load(localPropertiesFile.inputStream())
        localProperties.getProperty(name)?.let { return it }
    }
    System.getenv(name)?.let { return it }
    System.getProperty(name)?.let { return it }
    if (project.hasProperty(name)) {
        return project.property(name) as String
    }
    println(
        "Getting env variable failed, returning empty: set $name as environment variable or as system property in your ~/.gradle/gradle.properties"
    )
    return ""
}

allprojects {
    repositories {
        google()
        mavenCentral()
        maven {
            url = uri("https://maven.pkg.github.com/nevissecurity/nevis-mobile-authentication-sdk-android-package")
            credentials {
                username = getConfig("GH_USERNAME")
                password = getConfig("GH_PERSONAL_ACCESS_TOKEN")
            }
        }
    }
}

// Workaround for a React Native issue, should remain until it is solved: https://github.com/facebook/react-native/issues/44501
gradle.startParameter.excludedTaskNames.addAll(
    gradle.startParameter.taskNames.filter { it.contains("testClasses") }
)
