'use strict';

angular.module('cmsShoppableApp')
.controller('AddProductCtrl', function ($scope, $uibModalInstance, editIndex, productGroup, product, Upload, projectDetailService) {

	$scope.productGroup = productGroup;
	$scope.product = product || {
		colors: [],
		sizes: [],
		images: []
	};
	$scope.sizeList = [
		{ id: 1, value:'XS' },
		{ id: 2, value:'S' },
		{ id: 3, value:'M' },
		{ id: 4, value:'L' },
		{ id: 5, value:'XL' },
		{ id: 6, value:'XXL' },
		{ id: 7, value:'XXX' }
	];
	
	$scope.addProductColor = function() {
		if (_.findWhere($scope.product.colors, $scope.currentColor) == null) {
		    $scope.product.colors.push($scope.currentColor);
		}
	};
	
	$scope.addProductSize = function() {
		if (_.findWhere($scope.product.sizes, $scope.size) == null) {
		    $scope.product.sizes.push($scope.size);
		}
	};

	$scope.save = function (valid) {
		if(!valid || $scope.product.images.length == 0) {
			return false;
		}
		// console.log('project._id', project._id, editIndex);
	    $scope.product.productGroupId = productGroup._id;
	    $scope.disableButton = true;
	    if(editIndex>=0) {
			projectDetailService.updateProduct($scope.product)
			.success(function(product){
				$uibModalInstance.close({ product: product, editIndex: editIndex});
			})
			.error(function(error){
				$scope.disableButton = false;
				$scope.error = error;
				console.log(error);
			});
	    } else {
			projectDetailService.addProduct($scope.product)
			.success(function(product){
				$uibModalInstance.close({ product: product });
			})
			.error(function(error){
				$scope.disableButton = false;
				$scope.error = error;
				console.log(error);
			});
	    }
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.uploadFile = function(file, index){
		$scope.file = file;
		if (!$scope.file) return;
		if (file && !file.$error) {
			file.upload = Upload.upload({
				url: "https://api.cloudinary.com/v1_1/" + $.cloudinary.config().cloud_name + "/upload",
				fields: {
					upload_preset: $.cloudinary.config().upload_preset,
					tags: 'product',
					// context: 'photo=' + $scope.title
				},
				file: file
			}).progress(function (e) {
				$scope.uploadProgress = Math.round((e.loaded * 100.0) / e.total);
				$scope.uploadStatus = "Uploading... " + $scope.uploadProgress + "%";
			}).success(function (data, status, headers, config) {
				// data.context = {custom: {photo: $scope.title}};
				// debugger;
				console.log('data', data, index);
				$scope.file.result = data;
				$scope.product.images.push({
					bytes         		: data.bytes,
					created_at    		: data.created_at,
					// etag       		: data.etag,
					format        		: data.format,
					height        		: data.height,
					original_filename : data.original_filename,
					public_id     		: data.public_id,
					resource_type 		: data.resource_type,
					secure_url    		: data.secure_url,
					signature     		: data.signature,
					// tags       		: data.tags,
					type        			: data.type,
					url         			: data.url,
					version       		: data.version,
					width         		: data.width,
					imageUploaded 		: true
				});
				$scope.uploadProgress = 0;
				$scope.uploadStatus = '';
			}).error(function (data, status, headers, config) {
				$scope.file.result = data;
			});
		}
	};

	/* Modify the look and fill of the dropzone when files are being dragged over it */
	$scope.dragOverClass = function($event) {
		var items = $event.dataTransfer.items;
		var hasFile = false;
		if (items != null) {
			for (var i = 0 ; i < items.length; i++) {
				if (items[i].kind == 'file') {
					hasFile = true;
					break;
				}
			}
		} else {
			hasFile = true;
		}
		return hasFile ? "dragover" : "dragover-err";
	};
});