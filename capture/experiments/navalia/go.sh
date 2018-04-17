#!/bin/bash
export PATH=$HOME/local/bin:$PATH

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

kill $(lsof -t -i:9222)
chrome="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"
eval $chrome --hide-scrollbars --remote-debugging-port=9222 --disable-gpu &
# --headless
# chrome --hide-scrollbars --remote-debugging-port=9222 --disable-gpu &
# chrome --hide-scrollbars --remote-debugging-port=9222 &
# echo  (version 8 of node, run from within bash shell)
eval nvm use v8