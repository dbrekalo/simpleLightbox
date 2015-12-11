#SimpleLightbox
Lightweight plugin for responsive lightbox images and galleries based on jquery api

##Basic usage
```html

<div class="gallery">
	<a title="Image 1" href="img1-large.jpg"><img src="img1-small.jpg" /></a>
	<a title="Image 2" href="img2-large.jpg"> <img src="img2-small.jpg" /></a>
	<a title="Image 3" href="img3-large.jpg"> <img src="img3-small.jpg" /></a>
</div>

```

```javascript

	$('.gallery a').simpleLightbox();

```

##Advanced usage
```javascript

var $items = $('.gallery a');

$items.simpleLightbox({
	beforeSetContent: function($imageCont){
		$imageCont.append('<div class="watermark"></div>')
	}
});

$items.on('click', function(e) {

	$.simpleLightbox.open({
		$items: $items,
		startAt: $items.index($(e.target))
	});

})

$.simpleLightbox.open({
	items: ['img1-large.jpg', 'img2-large.jpg', 'img3-large.jpg']
});

$.simpleLightbox.open({
	content: '<div>Popup content</div>'
});

```
##API
```javascript

var lightbox = $.simpleLightbox.open({
	items: ['img1-large.jpg', 'img2-large.jpg', 'img3-large.jpg']
});

// Go to next image
lightbox.next();

// Go to previous image
lightbox.prev();

// Close lightbox
lightbox.close();

// Destroy lightbox (does close and removes all $items click handlers)
lightbox.destroy();

// Open lightbox
lightbox.show();

// Open lightbox at certain position
lightbox.showPosition(1);

// Set custom content
lightbox.setContent('<div>My content</div>');


```


##Plugin options
```javascript

$.simpleLightbox.defaults = {

    // add custom classes to lightbox elements
    elementClass: '',
    elementLoadingClass: 'slbLoading',
    htmlClass: 'slbActive',
    closeBtnClass: '',
    nextBtnClass: '',
    prevBtnClass: '',
    loadingTextClass: '',

    // customize / localize controls captions
    closeBtnCaption: 'Close',
    nextBtnCaption: 'Next',
    prevBtnCaption: 'Previous',
    loadingCaption: 'Loading...',

    bindToItems: true, // set click event handler to trigger lightbox on provided $items
    closeOnOverlayClick: true,
    closeOnEscapeKey: true,
    nextOnImageClick: true,
    showCaptions: true,

    captionAttribute: 'title', // choose data source for library to glean image caption from
    urlAttribute: 'href', // where to expect large image

    startAt: 0, // start gallery at custom index
    loadingTimeout: 100, // time after loading element will appear

    appendTarget: 'body', // append elsewhere if needed

    beforeSetContent: null, // convenient hooks for extending library behavoiur
    beforeClose: null,
    beforeDestroy: null,

    videoRegex: new RegExp(/youtube.com|vimeo.com/) // regex which tests load url for iframe content

};

```