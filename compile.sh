#!/usr/bin/env bash

if [ $# -le 1 ]; then
	# Windows x64
	if [ $# = 0 ] || [ $1 = "all" ] || [ $1 = "windows" ]; then
		rm -fr dist/windows-x64
		deno compile -o dist/bin/windows-x64/sd --target=x86_64-pc-windows-msvc --allow-read --allow-sys --allow-env --allow-run src/main.ts
		cp sd.sh dist/bin/windows-x64
	fi

	# MacOS x64
	if [ $# = 0 ] || [ $1 = "all" ] || [ $1 = "macos-x64" ]; then
		rm -fr dist/macos-x64
		deno compile -o dist/bin/macos-x64/__sd --target=x86_64-apple-darwin --allow-read --allow-sys --allow-env --allow-run src/main.ts
		cp sd.sh dist/bin/macos-x64
	fi

	# MacOS ARM
	if [ $# = 0 ] || [ $1 = "all" ] || [ $1 = "macos-arm" ]; then
		rm -fr dist/macos-arm
		deno compile -o dist/bin/macos-arm/__sd --target=aarch64-apple-darwin --allow-read --allow-sys --allow-env --allow-run src/main.ts
		cp sd.sh dist/bin/macos-arm
	fi

	# Linux x64
	if [ $# = 0 ] || [ $1 = "all" ] || [ $1 = "linux" ]; then
		rm -fr dist/linux-x64
		deno compile -o dist/bin/linux-x64/__sd --target=x86_64-unknown-linux-gnu --allow-read --allow-sys --allow-env --allow-run src/main.ts
		cp sd.sh dist/bin/linux-x64
	fi
fi
