# Build multiple Semantic-UI themes
*A proof of concept repository, demonstrating how to build multiple semantic-ui themes in one build.*

The easiest way to setup a new theme is to run the command: `node_modules/.bin/ts-node build/setupTheme <THEME_NAME> <PRIMARY_COLOR_NAME>:<PRIMARY_COLOR_VALUE> <SECONDARY_COLOR_NAME>:<SECONDARY_COLOR_VALUE>`

This should setup the basic files needed for that theme.

Then execute the command: `npm run build`

This will generate the compiled files for the theme and place them in the `styles/dist/<THEME_NAME>` directory.