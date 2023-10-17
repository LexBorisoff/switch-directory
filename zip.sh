#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ $# -le 1 ]; then
	# Windows x64
	if [ $# = 0 ] || [ $1 = "all" ] || [ $1 = "windows" ]; then
		rm -f dist/sd-windows-x64.zip
		zip -j dist/sd-windows-x64.zip dist/bin/windows-x64/*
	fi

	# Linux x64
	if [ $# = 0 ] || [ $1 = "all" ] || [ $1 = "linux" ]; then
		rm -f dist/sd-linux-x64.zip
		zip -j dist/sd-linux-x64.zip dist/bin/linux-x64/*
	fi

	# MacOS x64
	if [ $# = 0 ] || [ $1 = "all" ] || [ $1 = "macos-x64" ]; then
		rm -f dist/sd-macos-x64.zip
		zip -j dist/sd-macos-x64.zip dist/bin/macos-x64/*
	fi

	# MacOS ARM
	if [ $# = 0 ] || [ $1 = "all" ] || [ $1 = "macos-arm" ]; then
		rm -f dist/sd-macos-arm.zip
		zip -j dist/sd-macos-arm.zip dist/bin/macos-arm/*

	fi
fi
