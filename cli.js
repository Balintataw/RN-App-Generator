#!/usr/bin/env node
const fs = require('fs-extra');
const replace = require('replace-in-file');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const execSync = require('child_process').execSync;
const argv = require('yargs').argv;
const Spinner = require('cli-spinner').Spinner;
const inquirer = require('inquirer');

const BGREEN = '\033[1;32m'   // BoldGreen
const BRED = '\033[1;31m'     // BoldRed
const WIPE = '\033[1m\033[0m' // wipe color

let HELP = argv.h;
let WL_APP_NAME = argv.aname; 
let WL_BUNDLE_ID = argv.bundle; 
let WL_DISPLAY_NAME = argv.dname; 
let WL_MODULES = argv.mods; 
let WL_THEME = argv.theme; 
let WL_DIR_NAME = `app-${WL_APP_NAME}`;
let WL_BUNDLE_PATH = '';

// ------------------------------------------------------------------------------
// UTILITIES
// ------------------------------------------------------------------------------
 
// spinner is async and most of my commands are sync
let spinner = new Spinner('processing.. %s \n');
spinner.setSpinnerString('|/-\\');

// var twirlTimer = function() {
//     var P = ["\\", "|", "/", "-"];
//     var x = 0;
//     return setInterval(function() {
//         process.stdout.write("\r" + P[x++]);
//         x &= 3;
//     }, 250);
// };

const replaceStringInFiles = async (files = [], source, destination, next) => {
    const replaceOptions = {
        files: files,
        from: new RegExp(source, "g"),
        to: destination
    }
    try {
        const results = await replace.sync(replaceOptions);
        results.forEach(r => {
            console.log(BGREEN, 'File', r.file, 'Successfully changed', WIPE);
        })
    } catch(err) {
        console.error("ERR in replaceStringInFiles", err);
    } finally {
        next();
    }
};
async function copyFiles(source, destination, next) {
    try {
        await fs.copy(source, destination)
        console.log(BGREEN, 'Copy Successful!', WIPE);
    } catch(err) {
        console.error(BRED, err, WIPE);
    } finally {
        next();
    }
};
async function moveFiles (source, destination, next) {
    try {
        await fs.move(source, destination)
        console.log(` ${BGREEN}Success!${WIPE} Moved to ${destination}`);
    } catch(err) {
        console.error(BRED, err, WIPE);
    } finally {
        next();
    }
};
function validateResponse(val) {
    console.log("VAL", val)
    let isValid =  ['Y','y', 'N', 'n'].includes(val)
    return isValid || "Please enter [Y/y,N/n]!";
}

// ------------------------------------------------------------------------------
// PRINT HELP
// ------------------------------------------------------------------------------

const help = function() {
	console.log(`
        Usage: wl-generate [flags]

        Example: wl-generate --aname=test --bundle=com.test --dname="Test App" --mods=Home,About,Contact --theme=solarized-dark

        Description:

        This utility generates a configured project \"app-<app-name>\" from \"whitelabel\".
        The new project features custom bundle id and display name.

        Flags:

            --h Print help.

            --aname [app-name]
                Name of the target application to generate. Has to be different from
                'whitelabel'. The directory \"app-<app-name>\" will be generated.

            --bundle [bundle-id]
                Bundle identifier for the app.

            --dname [display-name]
                Display name of the app, appearing under the app icon on devices.

            --mods [module1,module2,...,moduleN]
                List of modules to be used in the app, separated by commas (','). At
                least one must be provided.
                Current options: Auth, Home, About, Contact

            --theme [theme]
                Name of the theme to be used in the app.
                Current options: solarized-light, solarized-dark
        `)
    process.exit(0)
}
if (!!HELP) {help()}

// -------------------------------------------------------------
// WRONG ARGUMENT ERRORS
// -------------------------------------------------------------
if(WL_APP_NAME === 'whitelabel') {
    console.log(BRED, "pname (app name) cannot be 'whitelabel'", WIPE);
    process.exit(1);
}
if(!WL_APP_NAME) {console.log("Missing app name (--aname) \nRun 'wl-generate --h' for help"); process.exit(1)};
if(!WL_BUNDLE_ID) {console.log("Missing bundle id (--bundle) \nRun 'wl-generate --h' for help"); process.exit(1)};
if(!WL_DISPLAY_NAME) {console.log("Missing display name (--dname) \nRun 'wl-generate --h' for help"); process.exit(1)};
if(!WL_MODULES) {console.log("Missing modules (--mods) \nRun 'wl-generate --h' for help"); process.exit(1)};
if(!WL_THEME) {console.log("Missing theme (--theme) \nRun 'wl-generate --h' for help"); process.exit(1)};

// -------------------------------------------------------------
//  COPY WHITELABEL DIRECTORY
// ------------------------------------------------------------- 

const initializeSetup = async () => {
    if (fs.existsSync(`./${WL_DIR_NAME}`)) {
        // alert user that file will be removed due to duplicate naming
        const answers = await inquirer.prompt([
                {
                    type: "confirm",
                    name: "overwrite",
                    message: "An app with that name already exists. Overwrite? [y/n]",
                    choices: ['y','n'],
                    default: 'n',
                    validate: validateResponse
                }
            ]);
        if(answers.overwrite) {
            console.log(`Removing existing directory ./${WL_DIR_NAME}`);
            try {
                await exec(`rm -rf ./${WL_DIR_NAME}`);
                console.log(BGREEN, 'Done!', WIPE);
                callCopyFiles();
            } catch(error) {
                console.error(BRED, error, WIPE);
            } finally {
            }
        } else {
            console.log("\nExiting setup...");
            process.exit(0);
        };
    } else {
        callCopyFiles();
    }
};

let callCopyFiles = () => {
    console.log(`Copying 'whitelabel' directory to ${WL_DIR_NAME}`);
    copyFiles(`./whitelabel`, `./${WL_DIR_NAME}`, () => {
        configureWhitelabel();
    });
};

// -------------------------------------------------------------
// CONFIGURE APPLICATION
// -------------------------------------------------------------

// run configure script here, still written in bash
let configureWhitelabel = async () => {
    console.log("Configuring whitelabel");
    try {
        await exec(`./wl-configure.sh -a ${WL_APP_NAME} -m ${WL_MODULES} -t ${WL_THEME}`);
        console.log(` ${BGREEN}Done!${WIPE}`);
        configureDisplayName();
    } catch(error) {
        console.error(`${BRED}exec error: ${error}${WIPE}`);
    }
};

// -------------------------------------------------------------
// CONFIGURE DISPLAY NAME
// -------------------------------------------------------------

let configureDisplayName = () => {
    console.log(`Setting app name to ${BGREEN}${WL_DISPLAY_NAME}${WIPE} in directory ${BGREEN}${WL_DIR_NAME}${WIPE}`);
    const displayNameFiles = [
        `./${WL_DIR_NAME}/android/app/src/main/res/values/strings.xml`,
        `./${WL_DIR_NAME}/ios/whitelabel/Info.plist`
    ];
    replaceStringInFiles(displayNameFiles, 'whitelabel', WL_DISPLAY_NAME, () => {
        configureBundleId();
    });
};

// ------------------------------------------------------------------------------
// CONFIGURE BUNDLE ID
// ------------------------------------------------------------------------------

let configureBundleId = () => {
    console.log(`Setting bundle id to ${BGREEN}'${WL_BUNDLE_ID}'${WIPE}`)
    // Replace 'com.whitelabel' with given bundle id
    // Name is set in whitelabel/app.json
    const bundleIdFiles = [
        `${WL_DIR_NAME}/android/app/BUCK`,
        `${WL_DIR_NAME}/android/app/build.gradle`,
        `${WL_DIR_NAME}/android/app/src/main/AndroidManifest.xml`,
        `${WL_DIR_NAME}/android/app/src/main/java/com/whitelabel/MainActivity.java`,
        `${WL_DIR_NAME}/android/app/src/main/java/com/whitelabel/MainApplication.java`,
        `${WL_DIR_NAME}/ios/whitelabel.xcodeproj/project.pbxproj`
    ];
    replaceStringInFiles(bundleIdFiles, 'com.whitelabel', WL_BUNDLE_ID, () => {
        createBundleDirectory();
    });
};

let createBundleDirectory = async () => {
    // Replace '.' with '/' to get bundle path
    // E.g., 'com.whitelabel' -> 'com/whitelabel'
    WL_BUNDLE_PATH = WL_BUNDLE_ID.replace('.','/');

    // Create directories for Android java files following new bundle id structure
    console.log(`Creating directories for android with new bundle id`);
    try {
        await exec(`mkdir -p "./${WL_DIR_NAME}/android/app/src/main/java/${WL_BUNDLE_PATH}/"`)
        console.log(BGREEN, `Created${WIPE} ./${WL_DIR_NAME}/android/app/src/main/java/${WL_BUNDLE_PATH}/`);
        moveBundleFiles();
    } catch(error) {
        console.error(`${BRED}exec error: ${error}${WIPE}`);
    } finally {
    }
};

let moveBundleFiles = async () => {
    // Copy MainApplication and MainActivity to new directories
    console.log(`Moving 'MainActivity.java' and MainApplication.java`);
    moveFiles(
        `./${WL_DIR_NAME}/android/app/src/main/java/com/whitelabel/MainActivity.java`,
        `./${WL_DIR_NAME}/android/app/src/main/java/${WL_BUNDLE_PATH}/MainActivity.java`,
        () => {});

    moveFiles(
        `./${WL_DIR_NAME}/android/app/src/main/java/com/whitelabel/MainApplication.java`,
        `./${WL_DIR_NAME}/android/app/src/main/java/${WL_BUNDLE_PATH}/MainApplication.java`,
        () => {});

    // Remove old directory com/whitelabel
    console.log(`Removing old files...`);
    try {
        await exec(`rm -rf ./${WL_DIR_NAME}/android/app/src/main/java/com/whitelabel/`);
        console.log(BGREEN, `Removed${WIPE} ./${WL_DIR_NAME}/android/app/src/main/java/com/whitelabel/`);
        chooseLayout();
    } catch(error) {
        console.error(`${BRED}exec error: ${error}${WIPE}`);
    } finally {
    }
};
// ------------------------------------------------------------------------------
// CHOOSE LAYOUT
// ------------------------------------------------------------------------------

let chooseLayout = async () => {
    let command = '';

    const answers = await inquirer.prompt([
            {
                type: "list",
                name: "layout",
                message: "Choose an initial layout",
                choices: [ 'Drawer', 'Bottom Tabs' ],
                validate: (layouts) => {
                    return layouts.length === 1 || "Only one layout can be selected"
                }
            },
        ]);

    console.log(`Installing selected layout...`);
    if(answers.layout === 'Drawer') {
        // remove existing index.js in routes folder
        // add Drawer nav in its place and rename to index.js
        await exec(`rm ./${WL_DIR_NAME}/routes/index.js`);
        copyFiles(
            `./${WL_DIR_NAME}/routers/drawerNav.js`,
            `./${WL_DIR_NAME}/routes/index.js`,
            () => installDependencies());
    };
    if(answers.layout === 'Bottom Tabs') {
        // remove existing index.js in routes folder
        // add Tabs nav in its place and rename to index.js
        await exec(`rm ./${WL_DIR_NAME}/routes/index.js`);
        copyFiles(
            `./${WL_DIR_NAME}/routers/bottomTabsNav.js`,
            `./${WL_DIR_NAME}/routes/index.js`,
            () => installDependencies());
    };
}

// ------------------------------------------------------------------------------
// INSTALL DEPENDENCIES
// ------------------------------------------------------------------------------

let installDependencies = async () => {

    let command = `npm install --silent`;
    const answers = await inquirer.prompt([
            {
                type: "confirm",
                name: "redux",
                message: "Do you want to install redux? [y/n]",
                choices: ['y','n'],
                default: 'n',
                validate: validateResponse
            },
            // {
            //     type: "confirm",
            //     name: "stylesheet",
            //     message: "Do you want to install Extended Style Sheet? [y/n]",
            //     choices: ['y','n'],
            //     default: 'n',
            //     validate: validateResponse
            // }
        ]);

    console.log(`Installing dependencies...`);
    if(answers.redux) {command += ` && npm install --silent redux react-redux`};
    // if(answers.stylesheet) {command += ` && npm install --silent react-native-extended-stylesheet`};
    try {
        await exec(` cd ${WL_DIR_NAME} && ${command}`);
        console.log(BGREEN, 'Setup complete!', WIPE, '\nIf you installed any packages you may need to link them. See documentation for details.');
    } catch(error) {
        console.error(BRED, error, WIPE);
    }
};

initializeSetup();