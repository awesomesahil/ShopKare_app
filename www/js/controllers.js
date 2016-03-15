angular.module('starter.controllers', ['Data.factory'])

.controller('AppCtrl',['$scope', '$state', '$ionicSideMenuDelegate', 'AuthFactory', 'UserFactory', 'Loader', function($scope, $state, $ionicSideMenuDelegate, AuthFactory, UserFactory, Loader) {
  $scope.isLoggedIn=AuthFactory.isLoggedIn();
  $scope.logout = function()
  {
    UserFactory.logout()
    .success(function(reply){
      if (reply == 'Logged out')
      {
	AuthFactory.deleteAuth();
	$scope.isLoggedIn = false;
	Loader.toggleLoadingWithMessage('Logged out');
	$state.go('loginsignup');
      }
      else{
	Loader.toggleLoadingWithMessage(reply);
      }
    })
    .error(function(err){
      Loader.toggleLoadingWithMessage('Unable to Logout');
    });
  }
  $scope.category = function(category)
  {
    $state.go('app.category', {
       categoryname: category
     });
  };
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.deals=[
  {
    imageurl:'img/hotdeals1.jpg'
  },
  {
    imageurl:'img/hotdeals2.jpg'
  },
  {
    imageurl:'img/hotdeals3.jpg'
  }
  ];
  $scope.Grocery=["Baby Products","Cereals","Beverages and Drinks","Personal Care", 'Pulses and Grains', 'Flours', 'Household Cleaning', 'Snacks'];
  $scope.Stationary=["Staples","Pencils","Drafters","Pens"];
  $scope.ExpandCategory = function(category)
  {
    if (category == 'Grocery')
    {
      $scope.showGrocery=true;
      $scope.showStationary=false;
    }
    else
    {
      $scope.showGrocery=false;
      $scope.showStationary=true;
    }
  };
}])

.controller('Grocery',['$scope', '$state', 'Categories', function($scope, $state, Categories) {
  console.log('Grocery');
  $scope.category = function(category)
  {
    $state.go('app.category', {
       categoryname: category
     });
  };
  $scope.products=[
  {
    imageurl:'img/hotdeals1.jpg'
  },
  {
    imageurl:'img/hotdeals2.jpg'
  },
  {
    imageurl:'img/hotdeals3.jpg'
  }
  ];
  $scope.selectSubCategory = function(maincategory)
  {
     $state.go('app.subcategory',{
       level1Category:'Grocery',
       mainCategory:maincategory,
       subCategory:JSON.stringify(Categories.getSubCategories('Grocery', maincategory))
     });
  };
}])

.controller('Category',['$scope', '$stateParams', '$state', function($scope, $stateParams, $state) {
  $scope.categoryname=$stateParams.categoryname;
  $scope.deals=[
  {
    imageurl:'img/hotdeals1.jpg'
  },
  {
    imageurl:'img/hotdeals2.jpg'
  },
  {
    imageurl:'img/hotdeals3.jpg'
  },
  {
    imageurl:'img/hotdeals2.jpg'
  },
  {
    imageurl:'img/hotdeals3.jpg'
  }
  ];
  $scope.viewSubCategory = function(index)
  {
    $state.go('app.subcategory', {
       categoryname: $stateParams.categoryname,
       subcategory: $scope.categories[index]
     });
  };
  $scope.categories=['Masala','Oats', 'Dals'];
}])

.controller('subCategory',['$scope', '$stateParams', '$state', function($scope, $stateParams, $state) {
  $scope.MainCategory=$stateParams.mainCategory;
  $scope.viewSubCategoryProducts = function(subcategory)
  {
    $state.go('app.products',{
      level1Category:$stateParams.level1Category,
      mainCategory:$stateParams.mainCategory,
      subcategory: subcategory
    });
  };
  $scope.subcategories=JSON.parse($stateParams.subCategory);
  $scope.deals=[
  {
    imageurl:'img/hotdeals1.jpg'
  },
  {
    imageurl:'img/hotdeals2.jpg'
  },
  {
    imageurl:'img/hotdeals3.jpg'
  },
  {
    imageurl:'img/hotdeals2.jpg'
  },
  {
    imageurl:'img/hotdeals3.jpg'
  }
  ];
  $scope.viewSubCategory = function(index)
  {
    $state.go('app.subcategory', {
       categoryname: $stateParams.categoryname,
       subcategory: $scope.categories[index]
     });
  };
  $scope.categories=['Masala','Oats', 'Dals'];
}])

.controller('Product',['$scope', '$stateParams', function($scope, $stateParams) {
  $scope.items=[
  {
    imageurl:'img/hotdeals1.jpg'
  },
  {
    imageurl:'img/hotdeals2.jpg'
  },
  {
    imageurl:'img/hotdeals3.jpg'
  },
  {
    imageurl:'img/hotdeals2.jpg'
  },
  {
    imageurl:'img/hotdeals3.jpg'
  }
  ];
  
  $scope.categories=['Masala','Oats', 'Dals'];
}])

.controller('Medical',['$scope', '$stateParams', '$ionicPopover', function($scope, $stateParams, $ionicPopover) {
  console.log('Medical');
  $scope.items=[
  {
    imageurl:'img/hotdeals1.jpg'
  },
  {
    imageurl:'img/hotdeals2.jpg'
  },
  {
    imageurl:'img/hotdeals3.jpg'
  },
  {
    imageurl:'img/hotdeals2.jpg'
  },
  {
    imageurl:'img/hotdeals3.jpg'
  }
  ];
  // .fromTemplateUrl() method
  $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  
  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.categories=['Masala','Oats', 'Dals'];
}])

.controller('Products',['$scope', '$stateParams', 'ProductFactory', function($scope, $stateParams, ProductFactory) {
  $scope.index='ss';
  $scope.updatePrice = function(productIndex)
  {
    console.log(productIndex.Quantity[1]);
  }
  $scope.AddToCart = function(index)
  {
    console.log($scope.$index);
  };
  $scope.quantity='';
  ProductFactory.getProducts('Grocery', 'Cereals', 'Cornflakes')
  .success(function(reply){
    if (reply == 'Unable to Fetch')
    {
      Loader.toggleLoadingWithMessage('Sorry Unable to fetch Products right now.');
    }
    else{
      $scope.products=reply;
      console.log(JSON.stringify($scope.products[0].images));
    }
  })
  .error(function(error){
    Loader.toggleLoadingWithMessage('Unable to Fetch Products right now.');
  });
  $scope.subcategory = $stateParams.subcategory;
  $scope.categories=['Masala','Oats', 'Dals'];
}])

.controller('LoginSignup',['$scope', 'UserFactory', 'Loader', '$state', 'AuthFactory', function($scope, UserFactory, Loader, $state, AuthFactory) {
  console.log('Login Signup');
  $scope.showLogin=true;
  $scope.signupuser={
    Name:'',
    Email: '',
    Mobile: '',
    Password: ''
  };
  $scope.user={
    Email:AuthFactory.getEmail(),
    Password: AuthFactory.getPassword(),
    Mobile:''
  };
  $scope.Login = function()
  {
//     Loader.toggleLoadingWithMessage('Login Successfull',1000);
    UserFactory.login(JSON.stringify($scope.user))
     .success(function(resp){
       if (resp=='Login Success')
       {
	 Loader.toggleLoadingWithMessage('Hello '+AuthFactory.getUser()); 
 	 $state.go('app.home');
       }
       else{
	 Loader.toggleLoadingWithMessage(resp);
       }
    })
     .error(function(error){
       console.log(error);
    });
  };
  $scope.showSignup= function()
  {
    $scope.showLogin=!$scope.showLogin;
  };
  $scope.Signup = function()
  {
    UserFactory.register(JSON.stringify($scope.signupuser))
    .success(function(resp){
      Loader.toggleLoadingWithMessage(resp);
      if (resp == 'Registration Successfull')
      {
	console.log($scope.signupuser.Name);
	AuthFactory.setUser($scope.signupuser.Name);
	console.log(AuthFactory.getUser());
	AuthFactory.setEmail($scope.signupuser.Email);
	AuthFactory.setPassword($scope.signupuser.Password);
	$state.go('app.home');
      }
    })
    .error(function(err){
      console.log(err);
    })
    ;
  };
}])
;

function updatePrice(price)
{
  console.log(price);
}