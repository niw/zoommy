BUILD_DIR = build
SRC_DIR = .

TARGET = zoommy

SCRIPT_DIR = javascripts
IMAGE_DIR = images/zoommy
DOC_DIR = .

PREFIX = .
DIST_DIR = $(PREFIX)/zoommy

LIBRARIES = \
	$(SRC_DIR)/$(SCRIPT_DIR)/prototype.js \
	$(SRC_DIR)/$(SCRIPT_DIR)/effects.js \
	$(NULL)

SCRIPTS = \
	$(SRC_DIR)/$(SCRIPT_DIR)/zoommy.js \
	$(NULL)

IMAGES = \
	$(SRC_DIR)/$(IMAGE_DIR)/* \
	$(NULL)

TEMPLATE = \
	$(SRC_DIR)/$(DOC_DIR)/readme.html.erb \
	$(SRC_DIR)/$(DOC_DIR)/readme_ja.txt \
	$(SRC_DIR)/$(DOC_DIR)/readme_en.txt \
	$(NULL)

DOCS = \
	$(SRC_DIR)/$(DOC_DIR)/readme_ja.html \
	$(SRC_DIR)/$(DOC_DIR)/readme_en.html \
	$(NULL)

ATTACHMENTS = \
	$(SRC_DIR)/MIT-LICENSE.txt \
	$(NULL)

JS = java -jar $(BUILD_DIR)/js.jar
ERB = $(BUILD_DIR)/erb.rb
VER = $(BUILD_DIR)/version.rb

VERSION = `$(VER) $(SRC_DIR)/version.txt`
REVISION = `$(VER) $(SRC_DIR)/version.txt $(SRC_DIR)`

.SUFFIXES: .txt .html

all: archive

.txt.html:
	cat $< | sed "s/@VERSION/$(VERSION)/" | $(ERB) `echo $< | sed "s/\(_[a-z][a-z]\)\{0,1\}\..*//"`.html.erb > $@

dist_dir:
	mkdir -p $(DIST_DIR)

script_dir: dist_dir
	mkdir -p $(DIST_DIR)/$(SCRIPT_DIR)

image_dir: dist_dir
	mkdir -p $(DIST_DIR)/$(IMAGE_DIR)

doc_dir: dist_dir
	mkdir -p $(DIST_DIR)/$(DOC_DIR)

library: script_dir $(LIBRARIES)
	cp -r $(LIBRARIES) $(DIST_DIR)/$(SCRIPT_DIR)

script: script_dir $(SCRIPTS)
	cat $(SCRIPTS) | sed "s/@VERSION/$(REVISION)/" > $(DIST_DIR)/$(SCRIPT_DIR)/$(TARGET)_src.js
	$(JS) $(BUILD_DIR)/min.js $(DIST_DIR)/$(SCRIPT_DIR)/$(TARGET)_src.js $(DIST_DIR)/$(SCRIPT_DIR)/$(TARGET).js
	$(JS) $(BUILD_DIR)/pack.js $(DIST_DIR)/$(SCRIPT_DIR)/$(TARGET)_src.js $(DIST_DIR)/$(SCRIPT_DIR)/$(TARGET)_pack.js

image: image_dir $(IMAGES)
	cp -r $(IMAGES) $(DIST_DIR)/$(IMAGE_DIR)

doc: doc_dir $(TEMPLATE) $(DOCS)
	cp -r $(DOCS) $(DIST_DIR)/$(DOC_DIR)

attachment: dist_dir $(ATTACHMENTS)
	cp -r $(ATTACHMENTS) $(DIST_DIR)

archive: dist_dir library script image doc attachment
	zip -r $(PREFIX)/$(TARGET)-$(VERSION).zip $(DIST_DIR) -x "*/.*"

clean:
	rm -rf $(PREFIX)/$(TARGET)-*.zip
	rm -rf $(DOCS)
	rm -rf $(DIST_DIR)
