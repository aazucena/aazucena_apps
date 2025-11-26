#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# These variables will be sourced from the Docker ENV or ARGs passed in
# Default to empty if not set externally, and quote them for safety.
set -a
[ -f .env ] && source .env
set +a

# --- Function to sanitize a folder name ---
sanitize_folder_name() {
    local name="$1"
    local sanitized="$name"

    # 1. Remove anything related to "icons" (case-insensitive removal)
    if [ -n "$ICON_SRC" ]; then
        sanitized="${sanitized//[iI][cC][oO][nN][sS]/}"
    fi

    # 2. Remove leading/trailing non-alphanumerics/dashes/underscores
    sanitized=$(echo "$sanitized" | sed -e 's/^[^a-zA-Z0-9]*//' -e 's/[^a-zA-Z0-9]*$//')

    # 3. Replace internal sequences of non-alphanumerics with a single dash
    sanitized=$(echo "$sanitized" | sed -e 's/[^a-zA-Z0-9._\-]\+/-/g')

    # Return the sanitized name
    echo "$sanitized"
}

# Check if the icon list is empty
if [ -z "$ICON_LIST" ]; then
    echo "ICON_LIST is empty. No packages to install."
    exit 0
fi

# --- 1. Install all packages first ---
# ... (installation logic remains the same) ...

echo "--- Installing icon packages: $ICON_LIST ---"

# Convert comma-separated list to space-separated list safely
ICON_LIST_SPACED="${ICON_LIST//,/ }"

# Determine installation command (using arrays for security)
INSTALL_CMD=()
case "$ICON_PKG_MANAGER" in
    "npm") INSTALL_CMD=("npm" "install");;
    "yarn") INSTALL_CMD=("yarn" "add");;
    "pnpm") INSTALL_CMD=("pnpm" "add");;
    *) echo "Error: Unsupported package manager: $ICON_PKG_MANAGER" ; exit 1;;
esac

# Execute installation
"${INSTALL_CMD[@]}" $ICON_LIST_SPACED

echo "--- Installation complete. Proceeding to copy files. ---"

# --- 2. Process each package individually ---

mkdir -p "$ICON_PUBLIC_DIR"
echo "--- Ensuring destination directory exists: $ICON_PUBLIC_DIR ---"

# SECURITY FIX: Explicit check that the base node_modules directory exists
if [ ! -d "./node_modules" ]; then
    echo "Error: The ./node_modules directory was not created during installation. Cannot proceed with file copying."
    exit 1
fi

# Convert the comma-separated ICON_SRC list into a space-separated list for iteration
ICON_SRC_SPACED="${ICON_SRC//,/ }"

# Determine the count of source folders
ICON_SRC_COUNT=$(echo "$ICON_SRC_SPACED" | wc -w)

# Loop through the space-separated list of package names
for package_name in $ICON_LIST_SPACED; do
    echo "--- Processing package: $package_name ---"

    # Reference node_modules directly using the relative path
    PACKAGE_DIR="./node_modules/$package_name"
    DEST_FOLDER_BASE="" # Variable to hold the final folder name (e.g., 'icons' or 'example')


    # A. Attempt to Read the 'name' field from package.json using jq
    if [ -f "$PACKAGE_DIR/package.json" ]; then
        PKG_NAME_VALUE=$(jq -r '.name' "$PACKAGE_DIR/package.json")

        if [ -n "$PKG_NAME_VALUE" ] && [ "$PKG_NAME_VALUE" != "null" ]; then
            # Use the function to sanitize the name derived from package.json
            DEST_FOLDER_BASE=$(sanitize_folder_name "$PKG_NAME_VALUE")
            echo "Determined and sanitized folder name: $DEST_FOLDER_BASE"
        fi
    fi

    # B. Fallback: If package.json logic failed
    if [ -z "$DEST_FOLDER_BASE" ]; then
        echo "Warning: package.json logic failed. Falling back to input name."
        # Use the function to sanitize the original package name
        DEST_FOLDER_BASE=$(sanitize_folder_name "$package_name")
    fi

    # SECURITY FIX 2: Final safety check for path traversal
    if [[ "$DEST_FOLDER_BASE" == ".."* ]] || [[ "$DEST_FOLDER_BASE" == "/"* ]] || [[ "$DEST_FOLDER_BASE" == "*"* ]] || [ -z "$DEST_FOLDER_BASE" ]; then
         echo "Error: Final folder name derived is unsafe or empty: $DEST_FOLDER_BASE. Skipping."
         continue
    fi

    # Define the base directory for this specific package
    PACKAGE_DEST_BASE_DIR="$ICON_PUBLIC_DIR/$DEST_FOLDER_BASE"
    mkdir -p "$PACKAGE_DEST_BASE_DIR" # Ensure the base package folder exists

    # C. Loop through all possible source paths defined in ICON_SRC_SPACED
    for src_folder in $ICON_SRC_SPACED; do

        SRC_DIR="$PACKAGE_DIR/$src_folder"

        # --- CONDITIONAL RENAMING LOGIC ---
        TARGET_SUFFIX=""

        if [[ "$ICON_SRC_COUNT" -gt 1 ]]; then
            # If multiple sources exist, we need a suffix.
            if [[ "$src_folder" =~ ^[iI][cC][oO][nN][sS]$ ]]; then
                # Rename 'icons' to 'regular' suffix
                TARGET_SUFFIX="regular"
            else
                # Use the source folder name as the suffix (e.g., 'solid')
                TARGET_SUFFIX="$src_folder"
            fi
        # If only one source exists, we leave TARGET_SUFFIX empty (e.g., "example" instead of "example-regular")
        fi

        # Sanitize the suffix
        SANITIZED_SUFFIX=$(sanitize_folder_name "$TARGET_SUFFIX")

        # Determine the final flat destination directory name
        if [ -n "$SANITIZED_SUFFIX" ]; then
            # e.g., example-regular or example-solid
            FINAL_DEST_NAME="$DEST_FOLDER_BASE-$SANITIZED_SUFFIX"
        else
            # e.g., example (if only one source)
            FINAL_DEST_NAME="$DEST_FOLDER_BASE"
        fi

        # Final destination path
        CATEGORIZED_DEST_DIR="$ICON_PUBLIC_DIR/$FINAL_DEST_NAME"

        echo "Checking source path: $SRC_DIR for SVGs..."

        if [ -d "$SRC_DIR" ] && [ -n "$(find "$SRC_DIR" -maxdepth 1 -name '*.svg')" ]; then
            mkdir -p "$CATEGORIZED_DEST_DIR"
            echo "Copying SVG files from $SRC_DIR to $CATEGORIZED_DEST_DIR"
            cp -f "$SRC_DIR"/*.svg "$CATEGORIZED_DEST_DIR/"
            echo "Successfully copied SVG files from $src_folder to $SANITIZED_SRC_FOLDER folder."
        else
            echo "Info: No *.svg files found in $SRC_DIR. Skipping this source folder."
        fi
    done

done

echo "--- All icon packages processed and files copied ---"
