# job-test --- author: Zeljko Olah

> Simple app for albums and photo listings

## Build Setup

``` bash
# install dependencies
npm install

# enable JSON-server API at localhost:3000
npm run server

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# Test for a frontend developer

Proposed resources for this task assignment
It is strongly suggested that you use this github project for obtaining sample data via REST API, as it contains many parts that are relevant to the task in question: https://github.com/typicode/jsonplaceholder#how-to
A simple CLI for scaffolding Vue.js projects. https://github.com/vuejs/vue-cli

# Some general guidelines include

You are free to use any of the 3rd party libraries/packages available.
Take your time. There are no bonus points for finishing it quickly.
Once you're done, please describe in a few short sentences:
what you did
how you did it, and
why do you think it was the best way to do it

# Application wise guidelines

try to make components reusable as much as possible, and as granular as you see fit for this task.
use Vuex for all of your state management throughout the app, it doesn't have to be anything complicated, just to have a proper structure.
as this is a fairly simple application you don't have to use any module like Vuex structure.
all API calls should be performed from within Vuex actions, and not by the component itself.

# About the application

Using the suggested API from above, write an application which will allow to select for some user, then show all albums which pertain to that particular user.

Ideally, user albums would be shown on a separate route view.

On the album page, we should be able to filter/search album by it's title.

Show an example of class/style binding, for when album we search for is not being found.
Searching/Filtering should be performed on data which is already in the state, so no additional request being made.
Once the user clicks on the desired album, show all the photos that are available within it - along with some meta data like title and maybe id. Also give a notion on that page, which album we are currently viewing.

Photos should be presented in a grid-like interface, like thumbnails.
Make the results paginated, so that each page will hold up to 10 images at most.
Make delete button available within the thumbnail card, so that the actual photo may be deleted.
Give some visual clue, for the photo that is about to be deleted, before we actually confirm the action.
Make a simple menu that will allow us to access various parts of application easily.

When you finish, please zip/attach all the files, then send them to marko@chord.agency for a review.

Thank you, and we wish you a good luck!
