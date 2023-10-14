#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SD_EXE="$SCRIPT_DIR/__sd"

sd() {
	$SD_EXE -verbose "$@"
	local DIRECTORY_PATH=$($SD_EXE -to "$@")
	if ! test -z "$DIRECTORY_PATH"; then
		cd "$DIRECTORY_PATH"
	fi
}
