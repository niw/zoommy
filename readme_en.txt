Zoommy @VERSION
===============
Thank you for downloading and trying Zoommy!
This document describe how to use Zoommy with tiny demonstrations.

Zoommy is tested and works on Safari, Firefox, IE7 and IE6 on both MacOS X and Windows.

Zoommy was strongy inspired from [Apple webpage](http://www.apple.com/) and [FacyZoom](http://www.cabel.name/2008/02/fancyzoom-10.html).

Demo
----
Zoommy automatically change next code into delicious image link! (zoomminizing!)

    <a href="http://farm4.static.flickr.com/3033/2457505175_37b8fffc2a.jpg">
        <img src="http://farm4.static.flickr.com/3033/2457505175_37b8fffc2a_s.jpg" />
    </a>

<div class="demo">
<a href="http://farm4.static.flickr.com/3033/2457505175_37b8fffc2a.jpg">
<img src="http://farm4.static.flickr.com/3033/2457505175_37b8fffc2a_s.jpg" />
</a>
</div>

In addition, Zoommy also automically change image chains into slideshow gallery!

    <a href="http://farm3.static.flickr.com/2337/2457818492_fd9f9b7f0f.jpg" rel="zoommy['mySlideShow']"
	    title="Montmartre, Paris, France">
        <img src="http://farm3.static.flickr.com/2337/2457818492_fd9f9b7f0f_s.jpg" />
    </a>
    <a href="http://farm3.static.flickr.com/2411/2458159794_84884f683b.jpg" rel="zoommy['mySlideShow']"
	   title="Raffles Hotel, Singapore">
        <img src="http://farm3.static.flickr.com/2411/2458159794_84884f683b_s.jpg" />
    </a>
    <a href="http://farm3.static.flickr.com/2106/2483739956_89be523894.jpg" rel="zoommy['mySlideShow']"
	   title="Karuizawa, Nagano, Japan">
        <img src="http://farm3.static.flickr.com/2106/2483739956_89be523894_s.jpg" />
    </a>

<div class="demo">
<a href="http://farm3.static.flickr.com/2337/2457818492_fd9f9b7f0f.jpg" rel="zoommy['mySlideShow']" title="Montmartre, Paris, France">
<img src="http://farm3.static.flickr.com/2337/2457818492_fd9f9b7f0f_s.jpg" />
</a>
<a href="http://farm3.static.flickr.com/2411/2458159794_84884f683b.jpg" rel="zoommy['mySlideShow']" title="Raffles Hotel, Singapore">
<img src="http://farm3.static.flickr.com/2411/2458159794_84884f683b_s.jpg" />
</a>
<a href="http://farm3.static.flickr.com/2106/2483739956_89be523894.jpg" rel="zoommy['mySlideShow']" title="Karuizawa, Nagano, Japan">
<img src="http://farm3.static.flickr.com/2106/2483739956_89be523894_s.jpg" />
</a>
</div>

Setup
-----
1. Copy dependencies into your web site

  Zoommy depends on [Prototype.js](http://www.prototypejs.org/) version 1.6.x and [script.aculo.us](http://script.aculo.us/) version 1.8.x.
  If your website already use these libraries, like a [Ruby on Rails](http://www.rubyonrails.org/) project, These files does not need to copy.
  Sorry that Zoommy is currently incompatible Prototype.js version 1.5.x, please check your version of prototype.js.

  * javascripts/prototype.js 
  * javascripts/effects.js

2. Copy next files into your web site

  * images/zoommy
  * javascripts/zoommy.js

3. Adding include tag into your web pages' header

  The tag for prototype.js and effects.js does not need if they are already there.

        <head>
        ....
        <script type="text/javascript" src="javascripts/prototype.js"></script>
        <script type="text/javascript" src="javascripts/effects.js"></script>
        <script type="text/javascript" src="javascripts/zoommy.js"></script>
        ....

4. Additional configuration if needed

  If you want to use the paths for images used in Zoomy(files coped in paragraph 2) as relative path,
  You should put the next tag into header of each html page.

        <head>
        ....
        <script type="text/javascript">
        zoommy_config = {imagePath: 'relative/path/to/zoomy/image/from/html'};
        </script>
        ....

5. All done, then open your web page!


Customize
---------

### Adding title

  You can show the title of image when zooming. Just adding the __title="_(title of image)_"__ attribute to the anchor tag.

        <a href="http://farm4.static.flickr.com/3033/2457505175_37b8fffc2a.jpg" title="Blue sky and Sunshine!!">
            <img src="http://farm4.static.flickr.com/3033/2457505175_37b8fffc2a_s.jpg" />
        </a>

<div class="demo">
<a href="http://farm4.static.flickr.com/3033/2457505175_37b8fffc2a.jpg" title="Blue sky and Sunshine!!">
<img src="http://farm4.static.flickr.com/3033/2457505175_37b8fffc2a_s.jpg" />
</a>
</div>

### Making slideshow gallery

  Adding __ref="zoommy['_(name of slideshow)_']"__ attirbute to anchor tag, Zoommy groups images with same name and changes them into slideshow gallery.

        <a href="http://farm3.static.flickr.com/2337/2457818492_fd9f9b7f0f.jpg" rel="zoommy['travel around the world']">
            <img src="http://farm3.static.flickr.com/2337/2457818492_fd9f9b7f0f_s.jpg" />
        </a>
        <a href="http://farm3.static.flickr.com/2411/2458159794_84884f683b.jpg" rel="zoommy['travel around the world']">
            <img src="http://farm3.static.flickr.com/2411/2458159794_84884f683b_s.jpg" />
        </a>
        <a href="http://farm3.static.flickr.com/2106/2483739956_89be523894.jpg" rel="zoommy['travel around the world']">
            <img src="http://farm3.static.flickr.com/2106/2483739956_89be523894_s.jpg" />
        </a>

<div class="demo">
<a href="http://farm3.static.flickr.com/2337/2457818492_fd9f9b7f0f.jpg" rel="zoommy['travel around the world']">
<img src="http://farm3.static.flickr.com/2337/2457818492_fd9f9b7f0f_s.jpg" />
</a>
<a href="http://farm3.static.flickr.com/2411/2458159794_84884f683b.jpg" rel="zoommy['travel around the world']">
<img src="http://farm3.static.flickr.com/2411/2458159794_84884f683b_s.jpg" />
</a>
<a href="http://farm3.static.flickr.com/2106/2483739956_89be523894.jpg" rel="zoommy['travel around the world']">
<img src="http://farm3.static.flickr.com/2106/2483739956_89be523894_s.jpg" />
</a>
</div>

### Exclude from Zoomminize

  You can keep the anchors without Zoommy by adding __rel="nozoommy"__ attribute to the tags.

        <a href="http://farm4.static.flickr.com/3033/2457505175_37b8fffc2a.jpg" target="_blank" rel="nozoommy">
            <img src="http://farm4.static.flickr.com/3033/2457505175_37b8fffc2a_s.jpg" />
        </a>

<div class="demo">
<a href="http://farm4.static.flickr.com/3033/2457505175_37b8fffc2a.jpg" target="_blank" rel="nozoommy">
<img src="http://farm4.static.flickr.com/3033/2457505175_37b8fffc2a_s.jpg" />
</a>
</div>

### Disable Zoommy badge

  As default, Zoommy add a zoom badge(small plus icon) to the thumbnail image inside the anchor tag on top left corner.
  You can strip this badge by adding __noBadge: true__ option to the configuration code inside head tag.

        <head>
        ....
        <script type="text/javascript">
        zoommy_config = {
			noBadge: true
        };
        </script>
        ....

### Adjusting Z-Index of Zoommy

  If you want to use Zoommy with another fancy scripts or libraries, you may adding the __baseZIndex__ option to the configuration code for specification the Z-Index ordering.
  Default bottom, base Z-Index Zoommy uses are 900.

        <head>
        ....
        <script type="text/javascript">
        zoommy_config = {baseZIndex: 10000};
        </script>
        ....

FAQ
---
 * Q. Some anchor tag doesn't not change into Zoommy? Why?

   A. Zoommy changes the anchor tags which href attribute ends with ".png", ".gif", ".jpg" or ".jpeg", or which rel attribute start with "zoommy".
   This means that you may add __rel="zoommy"__ to anchor tag if its href attribute doesn't end with these extensions.

        <a href="/path/to/image?var=value" rel="zoommy">
            <img src="/path/to/thumbnail" />
        </a>

Change log
----------
 * 1.0.1
   * First release.


License and Copyright
---------------------

  Zoommy is under MIT License.


Yoshimasa Niwa <niw@niw.at> [http://niw.at/](http://niw.at) Zoommy @VERSION
