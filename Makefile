VERSION=0.1.0
TARGET=zoommy-$(VERSION).zip
OBJS= \
	readme.ja.txt \
	readme.en.txt \
	readme.ja.html \
	readme.en.html \
	images/zoommy \
	javascripts/zoommy.js \
	javascripts/prototype.js \
	javascripts/effects.js \
	$(NULL)

ERB=ruby -rubygems -rerb -e "require 'BlueCloth'; File.open(ARGV.shift){|f| SRC_FILE_NAME=ARGV.shift; ERB.new(f.read).run}"

all: $(TARGET)

readme.ja.html: readme.html.erb readme.ja.txt
	$(ERB) readme.html.erb readme.ja.txt > $@

readme.en.html: readme.html.erb readme.en.txt
	$(ERB) readme.html.erb readme.en.txt > $@

$(TARGET): $(OBJS)
	zip -r $(TARGET) $(OBJS) -x "*/.*" 

clean:
	rm -rf readme.*.html $(TARGET)
