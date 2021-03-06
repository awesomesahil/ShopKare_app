// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('loginsignup', {
    url: '/loginsignup',
    templateUrl: 'templates/loginsignup.html',
    controller: 'LoginSignup'
  })
  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
	controller: 'AppCtrl'
      }
    }
  })
  .state('app.home.grocery', {
    url: '/grocery',
    views: {
      'Grocery': {
        templateUrl: 'templates/grocery.html',
	controller: 'Grocery'
      }
    }
  })
  .state('app.home.medical', {
    url: '/medical',
    views: {
      'Medical': {
        templateUrl: 'templates/Medical.html',
	controller: 'Medical'
      }
    }
  })
  .state('app.home.courier', {
    url: '/courier',
    views: {
      'Courier': {
        templateUrl: 'templates/Courier.html',
	controller: 'Courier'
      }
    }
  })
  .state('app.products', {
    url: '/products?level1Category&mainCategory&subcategory',
    views: {
      'menuContent': {
        templateUrl: 'templates/products.html',
	controller: 'Products'
      }
    }
  })
  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
	controller: 'Search'
      }
    }
  })
  .state('app.subcategory', {
    url: '/subcategory?level1Category&mainCategory&subCategory',
    views: {
      'menuContent': {
        templateUrl: 'templates/subcategory.html',
	controller: 'subCategory'
      }
    }
  })
  .state('app.product', {
    url: '/product?product',
    views: {
      'menuContent': {
        templateUrl: 'templates/product.html',
	controller: 'Product'
      }
    }
  })
  .state('app.checkout', {
    url: '/checkout',
    views: {
      'menuContent': {
        templateUrl: 'templates/checkout.html',
	controller: 'Checkout'
      }
    }
  })
  .state('app.orderplacement', {
    url: '/orderplacement?coupon',
    views: {
      'menuContent': {
        templateUrl: 'templates/orderplacement.html',
	controller: 'OrderPlacement'
      }
    }
  })
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home/grocery');
});
