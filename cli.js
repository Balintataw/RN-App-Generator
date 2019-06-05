#!/usr/bin/env node
// TODOS
// Clone to parent directory or give an option
// Remove dead or unused files after completion
// Update help menu 
const fs = require('fs-extra');
const replace = require('replace-in-file');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const execSync = require('child_process').execSync;
const argv = require('yargs').argv;
const Spinner = require('cli-spinner').Spinner;
const inquirer = require('inquirer');
const git = require('simple-git/promise');
const figlet = require('figlet');

const REMOTE = 'git@github.com:Balintataw/RN-App-Generator-Whitelabel.git';
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
 
// use spinner.start() / spinner.stop()
const spinner = new Spinner('Processing.. %s');
const anim = '|/-\\';
spinner.setSpinnerString(anim);

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
async function cloneDir(next) {
    try {
        spinner.start()
        await git().clone(REMOTE, WL_DIR_NAME)
        console.log(BGREEN, 'Clone Successful!', WIPE);
    } catch(err) {
        console.error(BRED, err, WIPE);
    } finally {
        spinner.stop()
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
    let isValid =  ['Y','y', 'N', 'n'].includes(val)
    return isValid || "Please enter [Y/y,N/n]!";
};
function validateInput(val) {
    let isValid = val.length > 0;
    return isValid || "Value cannot be blank.";
};
function validateBundleId(val) {
    let isValid = val.includes('com')
    return isValid || "Bundle id should be formatted like 'com.<app-name>'";
};

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
//  GET USER DEFINED VARIABLES
// ------------------------------------------------------------- 

const initializeSetup2 = async () => {
    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "appName",
            message: "Name of the target application to generate?",
            default: 'app-test',
            validate: validateInput
        },
        {
            type: "input",
            name: "bundleId",
            message: "Bundle identifier for the app?",
            default: 'com.test',
            validate: validateBundleId
        },
        {
            type: "input",
            name: "displayName",
            message: "Display name of the app, appearing under the app icon on devices?",
            default: 'App Test',
            validate: validateInput
        },
        {
            type: "checkbox",
            name: "modules",
            message: "Select modules. (screens)",
            choices: ['Home','About','Contact','Auth'],
            default: ['Home'],
            // todo validate
        },
        {
            type: "list",
            name: "theme",
            message: "Select theme.",
            choices: ['solarized-dark','solarized-light'],
            default: ['solarized-dark'],
            // todo validate
        },
    ]);

    WL_APP_NAME = answers.appName;
    WL_BUNDLE_ID = answers.bundleId;
    WL_DISPLAY_NAME = answers.displayName;
    WL_MODULES = answers.modules;
    WL_THEME = answers.theme;
    WL_DIR_NAME = `${WL_APP_NAME}`;
    checkForDirectoryNameConflicts();
};

// -------------------------------------------------------------
//  CHECK FOR DIRECTORY NAME CONFLICTS BEFORE CLONING
// ------------------------------------------------------------- 

const checkForDirectoryNameConflicts = async () => {
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
                callCloneDir();
            } catch(error) {
                console.error(BRED, error, WIPE);
            } finally {
            }
        } else {
            console.log("\nExiting setup...");
            process.exit(0);
        };
    } else {
        callCloneDir();
    }
};

// -------------------------------------------------------------
//  CLONE WHITELABEL DIRECTORY
// ------------------------------------------------------------- 

let callCloneDir = () => {
    console.log(`Cloning 'whitelabel' directory to ${WL_DIR_NAME}`);
    cloneDir(() => {
        configureModules();
    })
};

// -------------------------------------------------------------
// CONFIGURE APPLICATION SECTION
// -------------------------------------------------------------

// ------------------------------------------------------------------------------
//      1. CONFIGURE modules/index.js
// ------------------------------------------------------------------------------

// modules/index.js
// import Module1 from './Module1';
// import Module2 from './Module2';
// ...
// import ModuleN from './ModuleN';
//
// export default [Module1, Module2, ..., ModuleN];

let configureModules = () => {
    const WL_MODULES_FILE = `./${WL_DIR_NAME}/modules/index.js`;
    const WL_MODULES_LIST = WL_MODULES;

    fs.writeFile(WL_MODULES_FILE, '', () => {
        // erase file content and re-write
        const moduleLogger = fs.createWriteStream(WL_MODULES_FILE, {
            flags: 'a' // 'a' means appending (old data will be preserved)
        });
        WL_MODULES_LIST.forEach(mod => {
            // append string to your file
            moduleLogger.write(`import ${mod} from './${mod}';\n`);
        });

        moduleLogger.write("\n");
        moduleLogger.write(`export default [${WL_MODULES_LIST}];`);
        moduleLogger.end();
        console.log(`${BGREEN}Modules configuration complete.${WIPE}`);
        configureTheme();
    });
};

// ------------------------------------------------------------------------------
//       2. CONFIGURE themes/index.js
// ------------------------------------------------------------------------------

// themes/index.js
// const styles = require('./theme').default;
//
// module.exports = fileName => styles[fileName] || {};
//

let configureTheme = () => {
    const WL_THEME_FILE = `./${WL_DIR_NAME}/themes/index.js`;

    fs.writeFile(WL_THEME_FILE, '', () => {
        // erase file content and re-write
        const themeLogger = fs.createWriteStream(WL_THEME_FILE, {
            flags: 'a' // 'a' means appending (old data will be preserved)
        });
        themeLogger.write(`const styles = require('./${WL_THEME}').default;`);
        themeLogger.write("\n");
        themeLogger.write(`module.exports = fileName => styles[fileName] || {};`);
        themeLogger.end();
        console.log(`${BGREEN}Theme configuration complete.${WIPE}`);

        configureDisplayName();
    });
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
    // if layout bottom tabs selected see the following to hide tabs when keyboard is shown
    // https://github.com/react-navigation/react-navigation-tabs/issues/64
    // https://github.com/react-navigation/react-navigation/issues/618

    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "layout",
            message: "Choose an initial layout",
            choices: [ 'Drawer', 'Bottom Tabs', 'Give me everything!' ],
            validate: (layouts) => {
                return layouts.length === 1 || "Only one layout can be selected"
            }
        },
    ]);

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
    if(answers.layout === 'Give me everything!') {
        // remove existing index.js in routes folder
        // add Tabs nav in its place and rename to index.js
        await exec(`rm ./${WL_DIR_NAME}/routes/index.js`);
        copyFiles(
            `./${WL_DIR_NAME}/routers/everythingNav.js`,
            `./${WL_DIR_NAME}/routes/index.js`,
            () => installDependencies());
    };
};

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
        {
            type: "confirm",
            name: "storage",
            message: "Do you want to install Async Storage(community)? [y/n]",
            choices: ['y','n'],
            default: 'n',
            validate: validateResponse
        }
    ]);

    console.log(`Installing dependencies...`);
    spinner.start();
    if(answers.redux) {command += ` && npm install --silent redux react-redux`};
    if(answers.storage) {command += ` && npm install --silent @react-native-community/async-storage`};
    try {
        await exec(` cd ${WL_DIR_NAME} && ${command}`);
        spinner.stop();
        console.log('\n');
        figlet('\nThank you\nfor using\nRN-App-Generator', function(err, data) {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                return;
            }
            console.log(BGREEN, data, WIPE)
            console.log(BGREEN, 'Setup complete!', WIPE, '\nIf you installed any packages you may need to link them. See documentation for details.');
        });
    } catch(error) {
        console.error(BRED, error, WIPE);
    }
};

initializeSetup2();
