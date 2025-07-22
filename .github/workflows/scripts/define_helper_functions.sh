#! /bin/bash

###############################################################################
# Base64-decodes and AES-decrypts file contents
# Usage: decode_and_decrypt_keystore_file <file_content_encrypted_encoded> <decryption_key> <temp_dir_path> <output_file_path>
###############################################################################
decode_and_decrypt_file() {
    # Extract parameters into local variables and print their lengths as a sanity check.
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
    echo "${decryption_key}" | openssl enc -d -aes256 -pbkdf2 -in "${temp_dir_path}/file.tar.gz.enc" | tar xz
    stat "${output_file_path}"
}
