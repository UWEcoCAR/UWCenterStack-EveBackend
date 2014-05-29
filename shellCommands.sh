# uwcs-eb - Changes the current directory to the UWCenterStack-EveBackend repo directory
alias uwcs-eb='cd $UWCENTERSTACK_EVEBACKEND_HOME'

# uwcs-eb-test - Runs the test file for the UWCenterStack-EveBackend repo
alias uwcs-eb-test='uwcs-eb ; node test.js'

# uwcs-eb-publish - Pushes the package to npm
alias uwcs-eb-publish='uwcs-eb && npm version patch && npm publish'