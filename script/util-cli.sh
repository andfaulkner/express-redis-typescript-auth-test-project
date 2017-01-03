#!/usr/bin/env sh

usage() {
    echo "Usage:      util-cli [command]"
    echo "[command]:"
    echo "    clean : remove build folder and replace it with an empty one"
    echo "     nuke : kill all ghost NodeJS processes (without killing Node in IDEs)"
}

if [[ -n "$1" ]]; then
    if [[ "$1" = "clean" ]]; then
      node "$(pwd)/script/util-cmds/clean-cmd.js"
    elif [[ "$1" = "nuke" ]]; then
      node "$(pwd)/script/util-cmds/nuke-cmd.js"
    fi
else
    usage
fi
