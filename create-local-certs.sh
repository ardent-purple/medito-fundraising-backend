#!/bin/bash

# Set the Common Name (CN) to the domain name or IP address of your server
COMMON_NAME="localhost"

# Set the number of days the certificate will be valid (365 days = 1 year)
DAYS_VALID=365

# Set the output directory for the generated files
OUTPUT_DIR="certs"

# Create the output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

openssl genpkey -algorithm RSA -out "$OUTPUT_DIR/privkey.pem"

# Generate a Certificate Signing Request (CSR)
openssl req -new -key "$OUTPUT_DIR/privkey.pem" -out "$OUTPUT_DIR/fullchain.csr" -subj "//CN=$COMMON_NAME"

# Generate a self-signed certificate using the private key and CSR
openssl x509 -req -days $DAYS_VALID -in "$OUTPUT_DIR/fullchain.csr" -signkey "$OUTPUT_DIR/privkey.pem" -out "$OUTPUT_DIR/fullchain.pem"

# Display information about the generated certificate
openssl x509 -in "$OUTPUT_DIR/fullchain.pem" -noout -text

echo "Self-signed certificate created successfully."
echo "Private key: $OUTPUT_DIR/privkey.pem"
echo "Certificate: $OUTPUT_DIR/fullchain.pem"
