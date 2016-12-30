################################### ENVIRONMENT VARIABLE SETTERS ###################################
with_projroot() {
    xargs env NODE_PATH=./ $@
}

with_run_env() {
    xargs env NODE_PATH=./ AUTO_LAUNCH=true
}

###################################### BUILD COMMAND RUNNERS #######################################
# build the client, rebuild on file change
build_client_watch() {
    npm run build:client:watch
}

# build the server, rebuild on file change
build_server_watch() {
    npm run build:server:watch
}

# build both the client and the server, rebuild each on respective changes
build_all_watch() {
    npm run build:watch
}

###################################### LAUNCH COMMAND RUNNERS ######################################
run_server_watch() {
    npm run run:server:watch
}
