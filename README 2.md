pkg-ascot
=========

Directives for Dapper

### Setup

- Pull down the git repo
```
git clone git@github.com:generalthings/pkg-ascot.git
```
- move into ascot root dir
```
cd pkg-ascot
```
- Install node. Make sure you have the latest version!!!
```
brew install node
```
- Install our custom bower globally
```
npm install -g git+ssh://git@github.com/generalthings/bower.git#gopro
```

or if you're on ZSH
```
noglob npm install -g git+ssh://git@github.com/generalthings/bower.git#gopro
```

- put a .bowerrc file in your home directory
```
vim ~/.bowerrc
```
```
{
   "strictSsl":false,
   "registry":{
      "search":[
         "https://bower.herokuapp.com",
         "https://flame.qa.gopro-platform.com"
      ],
      "register":"https://flame.qa.gopro-platform.com",
      "publish":"https://flame.qa.gopro-platform.com"
   }
}
```
- Install bower dependancies. If it asks you which angular you want, choose the latest
```
bower install
```
- Install dapper css
```
bower jakarta install css
```
- Install gulp gloably
```
npm install gulp -g
```
- Install node_modules,  Strangely, gulp won't actually work until you've done this!?
```
npm install
```
- Build your files into the build directory, start a server at loclahost:3444, and start a file watcher
```
gulp dev
```

### Running Unit Tests
- Install karma globally
```
npm install -g karma
```
- Have gulp running to build your files, then run karma
```
gulp
karma start build/karma-unit.js
```

### Running End to End ( e2e ) Tests
- Install protractor globally
```
npm install -g protractor
```
- Install webdrivers
```
 webdriver-manager update
```
- Start a webdriver
```
webdriver-manager start
```
- Start serving up your angular app
```
gulp
```
- Run the protractor tests
```
protractor e2e/protractor.conf.js
```

### Updating a new version

- Build ascot.js and ascot.min.js
```
gulp
```

- Tag the release version
```
git tag -a x.x.x
git push origin master --tags
```
=====================

- App level hiding and show classes should be available by constants

- Preface directives and their attributes with gp-
- Don't pass a value into a directive (i.e. DO: gp-my-directive, DON'T: gp-my-directive="someval")
- Don't add staple classes in a directive (unchangable outside of directive)

- ControllerNames are CamelCase with the first letter capital
- directiveNames are camelCase with the first letter lowercase
- Always define controller outside of directive
- To namespace sub directives or not? ( depends! )
- Put the controller above the directive that it's used for
- End controller names with 'Ctrl'
- When setting a controller, use 'as' syntax to name it lower case without the Ctrl
  TabsCtrl as tabs, AccordianCtrl as accordian
- Lean towards breaking up things into many controllers

- always give your directives isolare scope
- Link function only for communicating between directives and defining when to call actions
- Pass attributes into the directive scope object instead of reading from attrs object
- Traversing template elements and transcluded content is okay, but registered elements are better
- Every directive has default classes that can be overridden with attributes

===================

#Accordion

Applies accordion behavior to DOM elements

###Usage

To create an accordion all you need to do is apply the appropriate
attributes to your DOM elements and it will start acting like an
accordion and apply the appropraite classes to each element. When the 
user clicks the accordion header it will toggle open/close the content.

gp-accordion
  gp-accordion-section
    gp-accordion-header
    gp-accordion-content

You can specify the opening and closing animation classes using
"open" & "close" attributes.

After selecting an accordion section if you would liek the other sections to
close you can specify that by setting "close-others" attribute to "true".

You can specify which accordion sections you would like to be open intially
by setting "selected" attribute to "true".

###Attributes

- gp-accordion: Specifies the root accordion container
- gp-accordion-section: An accordion section that will contain a
  header and content
- gp-accordion-header: The header of an accordion section
- gp-accordion-content: The content section of an accordion section
- open: The class that will be applied to the 
  accordion-content on open, default is set to ng-show
- close: The class that will be applied to the
  accordion-content on close, default is ng-hide
- close-others: Will only have the selected accordion section open if
  true, default is false
- selected: Arribute to be applied to accordion-section if set to true
  the content for the accordion section will be open when first displayed
- accordion-class: Overrides default CSS that clas this element
- section-class: Overrides default CSS that class this element
- header-class: Overrides default CSS that class this element
- content-class: Overrides default CSS that class this element

###Example

<div gp-accordion open="ng-show" close="ng-hide" close-others="true">
  <div gp-accordion-section selected="true">
    <div gp-accordion-header class="bgc-gry-ltr">
      Header Blah
    </div>
    <div gp-accordion-content>
      Content Blah Blah
    </div>
  </div>
  <div gp-accordion-section>
    <div gp-accordion-header class="bgc-gry-ltr">
      Header 2 Blah
    </div>
    <div gp-accordion-content>
      2 Content Blah Blah
    </div>
  </div>
  <div gp-accordion-section>
    <div gp-accordion-header class="bgc-gry-ltr">
      Header 3 Blah
    </div>
    <div gp-accordion-content>
      3 Content Blah Blah
    </div>
  </div>
</div>
===
#Tooltip

Creates a tooltip

###Usage

To create a tooltip wrap the text you want tooltiped with the directive
and set the attributes to customize the look and behavior.

gp-tooltip
  Your awesome content

By default the tooltip is set to trigger on "hover" and the tooltip
direction on the "top". Specify the text you want in the tooltip using
the "tooltip-text" attribute.

###Attributes

- type: The type of tooltip trigger you want, 'hover' or 'click'
- tooltip-text: The text the tooltip will display
- tooltip-dir: The direction the tooltip wil pop out from, 'top',
  'bottom', 'left' or 'right'
- tooltip-class: Class that is applied to the tooltip container
- tooltip-trigger-class: Class applied to the tooltip-trigger container
  that wraps everything
- tooltip-width: Applied width to the tooltip that show up

###Example

Example of a
<span gp-tooltip tooltip-text="OMGOSH HOVERING!">
  tooltipsy HOVER right here
</span>
is here.

Example of a
<span gp-tooltip type="click" tooltip-trigger-class="" tooltip-class="ani-fade-in ani-fast" tooltip-dir="right" tooltip-width="900" tooltip-text="OMGOSH CLICKED!">
  tooltipsy CLICK right here
</span>
is here.
===
