#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SD_EXE="$SCRIPT_DIR/sd.exe"

sd() {
	$SD_EXE -verbose "$@"
	local DIRECTORY_PATH=$($SD_EXE -sd "$@")
	if ! test -z "$DIRECTORY_PATH"; then
		cd "$DIRECTORY_PATH"
	fi
}
