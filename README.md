# React Native App Generator

Scaffolding project for creating a white-label application generator with React Native.

## About

This repo provides a node script for generating apps from
a white-label application. The white-label app supports modules composition and
theme configuration, thay can be changed on the fly and applications with custom
configurations can be generated.

## Usage

To start using and customize the white-label app, do the following

1. Install dependencies with `npm install`;
2. Run the application with `wl-generate`.

## The React Native CLI project

This project is a modular React Native application. It features
modules and themes personalization. The app is contained in
the repository [RN-App-Generator-Whitelabel](https://github.com/Balintataw/RN-App-Generator-Whitelabel "RN-App-Generator-Whitelabel") for now.

### Modules

Modules represent a particular section of the application. They are defined in
the [RN-App-Generator-Whitelabel](https://github.com/Balintataw/RN-App-Generator-Whitelabel "RN-App-Generator-Whitelabel") `/modules` directory. Each module must export an object with the
following attributes

1. `name`: The name of the module. It must be unique (_i.e._, two modules cannot
have the same name).
2. `Component`: A React component that will be displayed.

For instance
```jsx
// modules/Home.js
import React from 'react';
import { Text, View } from 'react-native';

const styles = require('../theme')('Module');

const HomeComponent = () => (
    <View style={styles.container}>
      <Text style={styles.text}>
        Module <Text style={styles.accent}>Home</Text>
      </Text>
    </View>
);

export default {
    name: 'Home',
    Component: HomeComponent,
};
```

Modules are the automatically exported, depending on the white-label
configuration, by the [RN-App-Generator-Whitelabel](https://github.com/Balintataw/RN-App-Generator-Whitelabel "RN-App-Generator-Whitelabel") `/modules` directory as a list, and they can be
used anywhere
```jsx
// App.js
import React from 'react';
import { Text, SafeAreaView, View } from 'react-native';
import modules from './modules';

const styles = require('./theme')('App');

export default () => (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        White-Label App
      </Text>
      <View>
        {modules.map(({ name, Component }) =>
            <Component key={name} />
        )}
      </View>
    </SafeAreaView>
);
```

__N.B.: Modules should not be imported individually, but always as a whole.__

### Themes

Themes define the styles for components. By just toggling the theme, the styles
will change, without editing components files.

Themes are defined in the [RN-App-Generator-Whitelabel](https://github.com/Balintataw/RN-App-Generator-Whitelabel "RN-App-Generator-Whitelabel") `/themes` directory. Each theme has a custom directory,
containing stylesheet files. For instance, a stylesheet file may look like
```jsx
// theme/solarized-dark/App.js
import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.build({
    $primaryColor: '#002B36', // dark blue-grey
    $accentColor: '#CB4B16', // orange
    $primaryText: '#657b83', // light blue-grey
});
```

Stylesheets are then collected and exported in an `index.js` file
```jsx
// theme/solarized-dark/index.js
import App from './App';
import Module from './Module';

export default {
    App,
    Module,
};
```

__N.B.: Every theme should consist of the same stylesheet files and same style
classes, to provide maximum interoperability between themes.__

## White-label generation

The white-label generation allows to generate projects (new directories) based
on `whitelabel`, with a particular configuration, display name and bundle id.
This allows to install on the same device multiple applications originating from
the `whitelabel` one.

Generate app with Node
```
wl-generate
```

and will produce a new directory (or override the existing) `app-<name>`. By default,
it will generate directory `app-test`. The script supports the
following flags
* `--h`: Display Options.

## Comments

This work is not definitive and doesn't provide yet all features of a
white-label application, but it is a starting point.

## License

Everything inside this repository is [MIT licensed](./LICENSE).
