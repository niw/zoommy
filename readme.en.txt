Zoommy
======

Demo
----

Zoomy automatically change next code into delicious image link.

    <a href="http://farm4.static.flickr.com/3033/2457505175_37b8fffc2a.jpg">
        <img src="http://farm4.static.flickr.com/3033/2457505175_37b8fffc2a_s.jpg" />
    </a>

<a href="http://farm4.static.flickr.com/3033/2457505175_37b8fffc2a.jpg">
<img src="http://farm4.static.flickr.com/3033/2457505175_37b8fffc2a_s.jpg" />
</a>

Setup
-----

1. Copy dependencies into your web site

  Zoommy depends on [Prototype.js](http://www.prototypejs.org/) version 1.6+ and [script.aculo.us](http://script.aculo.us/) version 1.8+(not sure exact version but .
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

  If you want to use the paths for images used in Zoomy(files coped in section 2) as relative path,
  You should put the next tag into header of each html page.

        <head>
        ....
        <script type="text/javascript">
        zoommy_config = {imagePath: 'relative/path/to/zoomy/image/from/html'}
        </script>
        ....

5. 



Change log
----------
 * 1.0.1
   * First release.
