require "tempfile"
require "fileutils"

module Fastlane
	module Actions
		##
		# This class provides an action to modify a Gradle file by replacing or appending content.
		#
		# See {ModifyGradleFileAction.available_options available options} for supported parameters.
		class ModifyGradleFileAction < Action
			##
			# Main entry point for this Fastlane action.
			#
			# @param params [FastlaneCore::Configuration] Parameters for the action.
			# @return [void]
			def self.run(params)
				gradle_file_path ||= params[:gradle_file_path]
				constant = params[:constant]
				value = params[:value]
				mode ||= params[:mode]

				if gradle_file_path.nil?
					app_folder_name ||= params[:app_folder_name]
					UI.message("Using project folder `#{app_folder_name}`!")

					Dir.glob("**/#{app_folder_name}/build.gradle.kts") do |path|
						modify(path, constant, value, mode)
					end
				else
					UI.message(" Using gradle file (#{gradle_file_path})!")
					modify(gradle_file_path, constant, value, mode)
				end
			end

			##
			# Modifies a text file in-place by applying an operation ("replace" or "append")
			# on every line that contains `constant_name`.
			#
			# The method streams the original file line-by-line into a temporary file, then
			# replaces the original file with the temporary one.
			#
			# @param path [String] Path to the file to modify.
			# @param constant_name [String] Substring to look for in each line. The operation is applied
			#   only to lines that include this value.
			# @param constant_value [String] Replacement text (for "replace") or the text to insert
			#   (for "append").
			# @param mode [String] Operation mode:
			#   - `replace`: Replaces the first occurrence of `constant_name` in the matching line with `constant_value`.
			#   - `append`: Writes the original matching line, then writes `constant_value` as a new line after it.
			# @return [void]
			def self.modify(path, constant_name, constant_value, mode)
				raise "No file exist at path: (#{path})!" unless File.file?(path)

				begin
					temp_file = Tempfile.new("fastlaneModifyGradleFile")
					File.open(path, "r") do |file|
						file.each_line do |line|
							if line.include? constant_name
								if mode == "replace"
									components = line.strip.split
									current_token = components[components.length - 1]
									quoted_value = current_token[/"([^"]*)"/, 1]
									if quoted_value
										# Kotlin DSL values are often wrapped, e.g. uri("...") or getByName("..."),
										# so only the quoted portion of the token is replaced, keeping the wrapper intact.
										line.replace line.sub("\"#{quoted_value}\"", "\"#{constant_value}\"")
									else
										line.replace line.sub(current_token, constant_value.to_s)
									end
									temp_file.puts line
								elsif mode == "append"
									temp_file.puts line
									temp_file.puts constant_value
								end
							else
								temp_file.puts line
							end
						end
						file.close
					end
					temp_file.rewind
					temp_file.close
					FileUtils.mv(temp_file.path, path)
					temp_file.unlink
				rescue
					raise "Modifying gradle file failed!"
				end
			end
			private_class_method :modify

			def self.description
				"Modify gradle file of your Android project."
			end

			def self.available_options
				[
					FastlaneCore::ConfigItem.new(
						key: :app_folder_name,
						description: "The name of the application source folder in the Android project (default: app)",
						optional: true,
						type: String,
						default_value: "app"
					),
					FastlaneCore::ConfigItem.new(
						key: :gradle_file_path,
						description: "The relative path to the gradle file containing the constant parameter (default:app/build.gradle)",
						optional: true,
						type: String,
						default_value: nil
					),
					FastlaneCore::ConfigItem.new(
						key: :constant,
						description: "The constant whose value is to be replaced or appended after",
						optional: false,
						type: String
					),
					FastlaneCore::ConfigItem.new(
						key: :value,
						description: "The new value",
						optional: false,
						type: String
					),
					FastlaneCore::ConfigItem.new(
						key: :mode,
						description: "The working mode. Possible values are replace or append (default: replace)",
						optional: true,
						type: String,
						default_value: "replace"
					)
				]
			end

			def self.author
				"Nevis Security AG"
			end

			def self.is_supported?(platform)
				[:android].include? platform
			end

			def self.example_code
				[
					modify_gradle_file(
						gradle_file_path: file,
						constant: "<constant>",
						value: "<value>",
						mode: "append"
					)
				]
			end

			def self.category
				:project
			end
		end
	end
end
