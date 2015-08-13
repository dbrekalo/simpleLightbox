;(function($) {

    'use strict';

    var instanceNum = 0,
        $html = $('html'),
        $document = $(document),
        $window = $(window);

    function SimpleLightbox(options) {

        this.options = $.extend({}, SimpleLightbox.defaults, options);
        this.ens = '.slb' + (++instanceNum);
        this.init();

    }

    SimpleLightbox.defaults = {

        elementClass: '',
        htmlClass: 'slbActive',
        closeBtnClass: '',
        nextBtnClass: '',
        prevBtnClass: '',
        loadingClass: '',

        closeBtnCaption: 'Close',
        nextBtnCaption: 'Next',
        prevBtnCaption: 'Previous',
        loadingCaption: 'Loading...',

        bindToItems: true,
        closeOnOverlayClick: true,
        nextOnImageClick: true,
        showCaptions: true,

        captionAttribute: 'title',
        urlAttribute: 'href',

        startAt: 0,
        loadingTimeout: 100,

        appendTarget: $('body'),

        beforeSetContent: null,
        beforeClose: null,
        beforeDestroy: null,

        videoRegex: new RegExp(/youtube.com|vimeo.com/)

    };

    $.extend(SimpleLightbox.prototype, {

        items: [],
        captions: [],

        init: function() {

            var self = this;

            if (this.options.$items) {

                this.$items = this.options.$items;

                this.$items.each(function() {

                    var $item = $(this);

                    self.items.push($item.attr(self.options.urlAttribute));
                    self.captions.push($item.attr(self.options.captionAttribute));

                });

                this.options.bindToItems && this.$items.on('click' + this.ens, function(e) {

                    e.preventDefault();
                    self.showPosition(self.$items.index($(e.currentTarget)));

                });

            } else if (this.options.items) {

                this.items = this.options.items;

            }

            if (this.options.captions) {
                this.captions = this.options.captions;
            }

        },

        next: function() {

            return this.showPosition(this.currentPosition + 1);

        },

        prev: function() {

            return this.showPosition(this.currentPosition - 1);

        },

        normalizePosition: function(position) {

            if (position >= this.items.length) {
                position = 0;
            } else if (position < 0) {
                position = this.items.length - 1;
            }

            return position;

        },

        showPosition: function(position) {

            var self = this;

            this.currentPosition = this.normalizePosition(position);

            return this.setupLightboxHtml().prepareItem(this.currentPosition, this.setContent).show();

        },

        prepareItem: function(position, callback) {

            var self = this,
                url = this.items[position];

            this.loadingTimeout = setTimeout(function() {

                self.setContent('<p class="slbLoading ' + self.options.loadingClass + '">' + self.options.loadingCaption + '</p>').show();

            }, this.options.loadingTimeout);

            if (this.options.videoRegex.test(url)) {

                callback.call(self, $('<div class="slbIframeCont"><iframe class="slbIframe" frameborder="0" allowfullscreen src="' + url + '"></iframe></div>'));

            } else {

                var $imageCont = $('<div class="slbImageWrap"><img class="slbImage" src="' + url + '" /></div>');

                this.$currentImage = $imageCont.find('.slbImage');

                if (this.options.showCaptions && this.captions[position]) {
                    $imageCont.append('<div class="slbCaption">' + this.captions[position] + '</div>');
                }

                this.loadImage(url, function() {

                    self.setImageDimensions();

                    callback.call(self, $imageCont);

                    self.loadImage(self.items[self.normalizePosition(self.currentPosition + 1)]);

                });

            }

            return this;

        },

        loadImage: function(url, callback) {

            if (!this.options.videoRegex.test(url)) {

                var image = new Image();
                callback && (image.onload = callback);
                image.src = url;

            }

        },

        setupLightboxHtml: function() {

            var o = this.options;

            if (!this.$el) {

                this.$el = $(
                    '<div class="slbElement ' + o.elementClass + '">' +
                        '<div class="slbOverlay"></div>' +
                        '<div class="slbWrapOuter">' +
                            '<div class="slbWrap">' +
                                '<div class="slbContentOuter">' +
                                    '<div class="slbContent"></div>' +
                                    '<button type="button" title="' + o.closeBtnCaption + '" class="slbCloseBtn ' + o.closeBtnClass + '">×</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>'
                );

                if (this.items.length > 1) {

                    $(
                        '<div class="slbArrows">' +
                            '<button type="button" title="' + o.prevBtnCaption + '" class="prev slbArrow' + o.prevBtnClass + '">' + o.prevBtnCaption + '</button>' +
                            '<button type="button" title="' + o.nextBtnCaption + '" class="next slbArrow' + o.nextBtnClass + '">' + o.nextBtnCaption + '</button>' +
                        '</div>'
                    ).appendTo(this.$el.find('.slbContentOuter'));

                }

                this.$content = this.$el.find('.slbContent');

            }

            return this;

        },

        show: function() {

            if (!this.modalInDom) {

                this.$el.appendTo(this.options.appendTarget);
                $html.addClass(this.options.htmlClass);
                this.setupLightboxEvents();

                this.modalInDom = true;

            }

            return this;

        },

        setContent: function(content) {

            var $content = $(content);

            clearTimeout(this.loadingTimeout);

            this.setupLightboxHtml();
            this.options.beforeSetContent && this.options.beforeSetContent($content, this);
            this.$content.html($content);

            return this;

        },

        setImageDimensions: function() {

            this.$currentImage && this.$currentImage.css('max-height', $window.height() + 'px');

        },

        setupLightboxEvents: function() {

            var self = this;

            if (!this.lightboxEventsSetuped) {

                this.$el.on('click' + this.ens, function(e) {

                    var $target = $(e.target);

                    if ($target.is('.slbCloseBtn') || (self.options.closeOnOverlayClick && $target.is('.slbWrap'))) {

                        self.close();

                    } else if ($target.is('.slbArrow')) {

                        $target.hasClass('next') ? self.next() : self.prev();

                    } else if (self.options.nextOnImageClick && self.items.length > 1 && $target.is('.slbImage')) {

                        self.next();

                    }

                });

                $document.on('keyup' + this.ens, function(e) {

                    if (e.keyCode === 27) { self.close(); }

                    if (self.items.length > 1) {
                        (e.keyCode === 39 || e.keyCode === 68) && self.next();
                        (e.keyCode === 37 || e.keyCode === 65) && self.prev();
                    }

                });

                $window.on('resize' + this.ens, function() {

                    self.setImageDimensions();

                });

                this.lightboxEventsSetuped = true;

            }

        },

        close: function() {

            if (this.modalInDom) {

                this.beforeClose && this.beforeClose(this);

                this.$el && this.$el.off(this.ens);
                $document.off(this.ens);
                $window.off(this.ens);
                this.lightboxEventsSetuped = false;

                this.$el.detach();
                $html.removeClass(this.options.htmlClass);
                this.modalInDom = false;
            }

        },

        destroy: function() {

            this.close();
            this.beforeDestroy && this.beforeDestroy(this);
            this.$items && this.$items.off(this.ens);
            this.$el && this.$el.remove();

        }

    });

    SimpleLightbox.open = function(options) {

        var instance = new SimpleLightbox(options);

        return options.content ? instance.setContent(options.content).show() : instance.showPosition(instance.options.startAt);

    };

    $.fn.simpleLightbox = function(options) {

        var lightboxInstance,
            $items = this;

        return this.each(function() {
            if (!$.data(this, 'simpleLightbox')) {
                lightboxInstance = lightboxInstance || new SimpleLightbox($.extend({}, options, {$items: $items}));
                $.data(this, 'simpleLightbox', lightboxInstance);
            }
        });

    };

    $.simpleLightbox = SimpleLightbox;

})(window.jQuery || window.Zepto || window.simpleQuery);
