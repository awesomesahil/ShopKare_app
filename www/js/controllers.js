angular.module('starter.controllers', ['Data.factory'])

.controller('AppCtrl',['$scope', '$state', '$ionicSideMenuDelegate', 'AuthFactory', 'UserFactory', 'Loader', 'CartFactory', function($scope, $state, $ionicSideMenuDelegate, AuthFactory, UserFactory, Loader, CartFactory) {
  $scope.isLoggedIn=AuthFactory.isLoggedIn();
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.getCartItems = function()
  {
  $scope.items=[];
  $scope.totalammount=0;
  var items = CartFactory.getCartItems();
   if(items)
   {
    for (var i=0; i<items.length;i++)
    {
      console.log(JSON.stringify(items[i]));
      $scope.items.push(items[i]);
      $scope.totalammount = $scope.totalammount + $scope.items[i].Quantity*$scope.items[i].Price;
    } 
   }
   else{
     $scope.emptyCart='Sorry No products added. Start adding products';
  }
  };
  $scope.RemoveItem = function(index)
  {
    $scope.items.splice(index,1);
    CartFactory.clearCart();
    CartFactory.addToCart($scope.items);
    $scope.getCartItems();
  };
  $scope.DecreaseQuantity = function(index)
  {
    if($scope.items[index].Quantity)
    {
      $scope.items[index].Quantity = $scope.items[index].Quantity-1;
      CartFactory.clearCart();
      CartFactory.addToCart($scope.items);
      $scope.getCartItems();
    }
  };
  $scope.IncreaseQuantity = function(index)
  {
    $scope.items[index].Quantity = $scope.items[index].Quantity+1;
    CartFactory.clearCart();
    CartFactory.addToCart($scope.items);
    $scope.getCartItems();
  };
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

.controller('Courier',['$scope', '$stateParams', 'CartFactory', 'Loader', function($scope, $stateParams, CartFactory, Loader) {
  console.log('Courier');
  $scope.courier={};
  $scope.Confirm = function()
  {
    Loader.showLoading('Please wait while we are placing your Order.');
    CartFactory.newCourierOrder($scope.courier)
    .success(function(response){
      Loader.hideLoading();
      Loader.toggleLoadingWithMessage(response);
    })
    .error(function(error){
      Loader.hideLoading();
      Loader.toggleLoadingWithMessage(error);
    })
  };
}])

.controller('Medical',['$scope', '$stateParams', '$ionicPopover', function($scope, $stateParams, $ionicPopover) {
  console.log('Medical');
  $scope.images=[];
  
  $scope.optionClicked = function(choice){
    $scope.popover.hide();
    if(choice==1)
    {
      window.imagePicker.getPictures(
	function(results) {
	  for (var i = 0; i < results.length; i++) {
	    $scope.images.push(results[i]);
	    $scope.$apply();
	  }
	  if(!$scope.$$phase) {
					$scope.$apply();
				}
	}, function (error) {
	    Loader.toggleLoadingWithMessage('Unable to pick images.');
	}, {
	     maximumImagesCount: 2-$scope.images.length,
	     quality: 40
	    }
      );
    }
    
    else if(choice==2)
    {

	var options = {
	destinationType: Camera.DestinationType.FILE_URI,
	sourceType: Camera.PictureSourceType.CAMERA,
	};

      $cordovaCamera.getPicture(options).then(function(imageURI) {
	$scope.images.push(imageURI);
	$scope.$apply();
      }, function(err) {
	Loader.toggleLoadingWithMessage('Unable to select image. ');
	// error
      });

    }
  };
  // .fromTemplateUrl() method
  $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  
  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  
}])

.controller('Products',['$scope', '$stateParams', 'ProductFactory', 'Loader', 'CartFactory', function($scope, $stateParams, ProductFactory, Loader, CartFactory) {
  $scope.products=[];
  $scope.AddToCart = function(productindex, quantity)
  {
    var cityIndex = 0;
     console.log(JSON.stringify($scope.products[productindex]));
     console.log(JSON.stringify($scope.products[productindex].Quantity[cityIndex].Quantities.indexOf(quantity)));
     console.log(JSON.stringify(quantity));
      var product={
        ProductID: $scope.products[productindex]._id,
	QuantityType: quantity.Quantity[0],
	Price: quantity.Quantity[1],
	Quantity:$scope.products[productindex].quantity,
	QuantityIndex: $scope.products[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	product_name: $scope.products[productindex].product_name,
	'Main Category': $scope.products[productindex]['Main Category'],
	'Sub Category': $scope.products[productindex]['Sub Category'],
	'Level1 Category': $scope.products[productindex]['Level1 Category']
     };
     if(CartFactory.getCartItems())
     {
      var CartItems = CartFactory.getCartItems();
      CartItems.push(product);
      CartFactory.clearCart();
      CartFactory.addToCart(CartItems);
      }
      else{
	CartFactory.addToCart(product);
      }
    Loader.toggleLoadingWithMessage('Added to Cart',1000);
  };
  $scope.AddQuantity = function(index)
  {
     $scope.products[index].quantity=$scope.products[index].quantity+1;
  };
  $scope.RemoveQuantity = function(index)
  {
    if($scope.products[index].quantity != 0) 
    $scope.products[index].quantity=$scope.products[index].quantity-1;
  };
  $scope.updatePrice = function(index)
  {
    console.log(index);
  };
  $scope.quantity='';
  ProductFactory.getProducts('Grocery', 'Cereals', 'Cornflakes')
  .success(function(reply){
    if (reply == 'Unable to Fetch')
    {
      Loader.toggleLoadingWithMessage('Sorry Unable to fetch Products right now.');
    }
    else{
      for (var i=0; i< Object.keys(reply).length; i++)
	{
	  $scope.products.push(reply[i]);
	  $scope.products[i].quantity=0;
	}
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