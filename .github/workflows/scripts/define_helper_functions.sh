#! /bin/bash

###############################################################################
# Base64-decodes and AES-decrypts file contents
# Usage: decode_and_decrypt_keystore_file <file_content_encrypted_encoded> <decryption_key> <temp_dir_path> <output_file_path>
###############################################################################
decode_and_decrypt_file() {
    # Extract parameters into local variables and print their lengths (for sensitive values) or values.
    local file_content_encrypted_encoded="${1}"
    local decryption_key="${2}"
    local temp_dir_path="${3}"
    local output_file_path="${4}"
    echo "File content encrypted and encoded (number of characters) : ${#file_content_encrypted_encoded}"
    echo "Decryption key (number of characters)                     : ${#decryption_key}"
    echo "Temporary directory path                                  : ${temp_dir_path}"
    echo "Output file path                                          : ${output_file_path}"

    # Ensure the temporary directory exists.
    mkdir -p "${temp_dir_path}"

    echo "Decoding file content."
    echo "${file_content_encrypted_encoded}" | base64 --decode > "${temp_dir_path}/file.tar.gz.enc"
    stat "${temp_dir_path}/file.tar.gz.enc"

    echo "Decrypting file content."
    echo "${decryption_key}" | openssl enc -d -aes256 -pbkdf2 -in "${temp_dir_path}/file.tar.gz.enc" | tar xz -O > "${output_file_path}"
    stat "${output_file_path}"
}

###############################################################################
# Creates a `keystore.properties` file with the provided keystore details.
# Usage: create_keystore_properties_file <keystore_password> <key_password> <key_alias> <keystore_file_path> <keystore_properties_file_path>
###############################################################################
create_keystore_properties_file() {
    # Extract parameters into local variables and print their lengths (for sensitive values) or values.
    local keystore_password="${1}"
    local key_password="${2}"
    local key_alias="${3}"
    local keystore_file_path="${4}"
    local keystore_properties_file_path="${5}"
    echo "Keystore password (number of characters) : ${#keystore_password}"
    echo "Key password (number of characters)      : ${#key_password}"
    echo "Key alias                                : ${key_alias}"
    echo "Keystore file path                       : ${keystore_file_path}"
    echo "Keystore properties file path            : ${keystore_properties_file_path}"

    # Create the `keystore.properties` file with the provided values.
    echo "Creating keystore.properties file."
    echo "storePassword=${keystore_password}" > "${keystore_properties_file_path}"
    echo "keyPassword=${key_password}"       >> "${keystore_properties_file_path}"
    echo "keyAlias=${key_alias}"             >> "${keystore_properties_file_path}"
    echo "storeFile=${keystore_file_path}"   >> "${keystore_properties_file_path}"
    wc -l "${keystore_properties_file_path}"
}

###############################################################################
# Adds lines that reference the `keystore.properties` file, to the top of the
# `build.gradle` file.
# Note: To effectively "prepend" the lines, we first write everything to a
#       temporary file in the order we want, then we overwrite the target file
#       with the contents of that temporary file.
# Usage: inject_keystore_properties_reference_into_build_gradle_file <keystore_properties_file_path> <temp_dir_path> <build_gradle_file_path>
###############################################################################
inject_keystore_properties_reference_into_build_gradle_file() {
    # Extract parameters into local variables and print their values.
    local keystore_properties_file_path="${1}"
    local build_gradle_file_path="${2}"
    local temp_dir_path="${3}"
    echo "Keystore properties file path : ${keystore_properties_file_path}"
    echo "build.gradle file path        : ${build_gradle_file_path}"
    echo "Temporary directory path      : ${temp_dir_path}"

    # Add lines that reference the `keystore.properties` file, to the top of the `build.gradle` file.
    echo "Injecting keystore properties reference into build.gradle file."

    # Create a temporary file with the additional lines.
    echo '
        def keystorePropertiesFile = rootProject.file("keystore.properties")
        def keystoreProperties = new Properties()
        keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
    ' > "${temp_dir_path}/build.gradle"
    
    # Append the original `build.gradle` content to the temporary file.
    cat "${build_gradle_file_path}" >> "${temp_dir_path}/build.gradle"

    # Move the temporary file back to the original `build.gradle` file location.
    echo "Length of original build.gradle file: $(wc -l < "${build_gradle_file_path}")"
    mv "${temp_dir_path}/build.gradle" "${build_gradle_file_path}"
    echo "Length of updated build.gradle file: $(wc -l < "${build_gradle_file_path}")"
}
